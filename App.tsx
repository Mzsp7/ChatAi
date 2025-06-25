/**
 * Main Application Component for ChatAi
 *
 * This is the root component that manages the entire ChatAi application.
 * It handles chat functionality, routing, UI state management, and integrates
 * with Google's Generative AI for chat responses.
 *
 * Key Features:
 * - Real-time chat interface with AI responses
 * - Apple-inspired glassmorphism design with 3D animations
 * - Responsive sidebar navigation with collapsible functionality
 * - Route management for different pages (Home, About)
 * - Message streaming and error handling
 * - Local storage for UI preferences
 *
 * Dependencies:
 * - Google Generative AI SDK for chat responses
 * - React Router for navigation
 * - Custom components for UI elements
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai"; // Only type import for response
import { ChatMessageData, MessageRole } from './types';
import ChatMessageItem from './components/ChatMessageItem';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import AboutPage from './components/AboutPage';

import { Routes, Route, useNavigate } from 'react-router-dom';
// LoadingDots is imported by ChatMessageItem and ChatInput if needed



/**
 * Main App Component
 *
 * Manages the entire ChatAi application state and functionality.
 * Handles chat sessions, message management, UI state, and routing.
 *
 * @returns {JSX.Element} The main application component
 */
const App: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /** Array of all chat messages (user and AI responses) */
  const [messages, setMessages] = useState<ChatMessageData[]>([]);

  /** Loading state for API initialization and message processing */
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true until init attempt

  /** Error state for displaying user-friendly error messages */
  const [error, setError] = useState<string | null>(null);

  /** Active Google AI chat session for maintaining conversation context */
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  /** ID of the AI message currently being streamed (for loading indicators) */
  const [activeAiMessageId, setActiveAiMessageId] = useState<number | null>(null);

  /** Sidebar collapse state for responsive design */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ============================================================================
  // REFS AND NAVIGATION
  // ============================================================================

  /** Reference to chat container for auto-scrolling functionality */
  const chatContainerRef = useRef<HTMLDivElement>(null);

  /** API key from environment variables or window object */
  const apiKey = process.env.API_KEY || (window as any)?.process?.env?.API_KEY;

  /** React Router navigation hook for programmatic routing */
  const navigate = useNavigate();

  // ============================================================================
  // INITIALIZATION AND SETUP
  // ============================================================================

  /**
   * Initialize Google AI chat session on component mount
   *
   * This effect runs once when the component mounts and sets up the AI chat session.
   * It handles API key validation, creates a new chat session, and displays
   * appropriate error messages if initialization fails.
   *
   * Error scenarios handled:
   * - Missing API key
   * - Invalid API key
   * - Network connectivity issues
   * - Service unavailability
   */
  useEffect(() => {
    // Check if API key is configured
    if (!apiKey) {
      const keyErrorMsg = "CRITICAL: API Key is not configured. Please check index.html.";
      console.error(keyErrorMsg);
      setError(keyErrorMsg);

      // Display user-friendly error message in chat
      setMessages([{
        id: Date.now(),
        role: MessageRole.AI,
        text: "Configuration Error: The API Key is missing. The application cannot contact the AI service. Please ensure the API key is correctly set in index.html.",
        timestamp: new Date()
      }]);
      setIsLoading(false);
      return;
    }

    // Initialize AI chat session
    setIsLoading(true);
    try {
      // Create new Google AI instance with API key
      const ai = new GoogleGenAI({ apiKey: apiKey });

      // Create chat session with specific model
      // Using Gemini 2.5 Flash Preview for optimal performance
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
      });

      setChatSession(newChat);

      // Display welcome message
      setMessages([{
        id: Date.now(),
        role: MessageRole.AI,
        text: "Hello, I am ChatAi\nHow can I help you?",
        timestamp: new Date()
      }]);

      setError(null);
    } catch (e: any) {
      // Handle initialization errors with detailed messaging
      const initErrorMsg = `Failed to initialize AI. Please check your API key's validity, model access, and network connection. Details: ${e.message || 'Unknown error'}`;
      console.error("Failed to initialize Gemini AI:", e);
      setError(initErrorMsg);

      // Display error message in chat interface
      setMessages([{
        id: Date.now(),
        role: MessageRole.AI,
        text: `Error initializing AI: ${e.message || 'Unknown error'}. This could be due to an invalid API key, network issues, or service misconfiguration. Please check the browser console for more details.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]); // Re-run if API key changes

  /**
   * Auto-scroll chat container to bottom when new messages are added
   *
   * This effect ensures the chat always shows the latest message by automatically
   * scrolling to the bottom whenever the messages array changes.
   */
  useEffect(() => {
    if (chatContainerRef.current) {
      // Scroll to bottom to show latest message
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // Re-run whenever messages change

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

  /**
   * Handle sending a new message to the AI and processing the response
   *
   * This function manages the entire message flow:
   * 1. Validates input and session state
   * 2. Adds user message to chat
   * 3. Creates placeholder for AI response
   * 4. Streams AI response in real-time
   * 5. Handles errors gracefully
   *
   * @param prompt - The user's message text
   */
  const handleSendMessage = useCallback(async (prompt: string) => {
    // Validate input and session state
    if (!prompt.trim() || isLoading || !chatSession) return;

    setIsLoading(true);
    // Keep previous general error until successful send, or let new error overwrite
    // setError(null); // Clear previous general error if you want a clean slate for each send

    // Create user message object
    const userMessage: ChatMessageData = {
      id: Date.now(),
      role: MessageRole.USER,
      text: prompt,
      timestamp: new Date(),
    };

    // Generate unique ID for AI response (offset by 1ms to ensure uniqueness)
    const newAiMessageId = Date.now() + 1;
    setActiveAiMessageId(newAiMessageId);

    // Add user message and empty AI message placeholder to chat
    setMessages(prevMessages => [
      ...prevMessages,
      userMessage,
      { id: newAiMessageId, role: MessageRole.AI, text: '', timestamp: new Date() }
    ]);

    // Track accumulated response text for streaming
    let accumulatedResponseText = '';

    try {
      // Start streaming response from AI
      const stream: AsyncIterable<GenerateContentResponse> = await chatSession.sendMessageStream({ message: prompt });
      setError(null); // Clear error if stream starts successfully

      // Process each chunk of the streaming response
      for await (const chunk of stream) {
        if (chunk.text) {
          // Accumulate response text for real-time display
          accumulatedResponseText += chunk.text;

          // Update the AI message with accumulated text
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === newAiMessageId ? { ...msg, text: accumulatedResponseText } : msg
            )
          );
        }
      }
    } catch (e: any) {
      // Handle streaming errors gracefully
      console.error("Error sending message to Gemini:", e);
      const errorMessage = `Sorry, I encountered an error: ${e.message || 'Unknown API error'}`;
      setError(errorMessage);

      // Replace empty AI message with error message
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === newAiMessageId ? { ...msg, text: errorMessage, role: MessageRole.AI } : msg
        )
      );
    } finally {
      // Clean up loading states
      setIsLoading(false);
      setActiveAiMessageId(null);
    }
  }, [isLoading, chatSession]); // Dependencies: isLoading and chatSession

  // ============================================================================
  // ERROR DISPLAY LOGIC
  // ============================================================================

  /** Get the last message in the chat */
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  /** Check if error is already displayed in the last AI message */
  const errorAlreadyInLastMessage = error && lastMessage && lastMessage.role === MessageRole.AI && lastMessage.text.includes(error);

  /** Determine whether to show error banner (avoid duplicate error display) */
  const showBannerError = error && !errorAlreadyInLastMessage;

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================

  /** Navigate to home page */
  const handleHome = () => navigate('/');

  /**
   * Start a new chat session
   * Resets the conversation with a fresh welcome message
   */
  const handleNewChat = () => {
    navigate('/');
    setMessages([
      {
        id: Date.now(),
        role: MessageRole.AI,
        text: "Hello, I am ChatAi\nHow can I help you?",
        timestamp: new Date()
      }
    ]);
  };

  /** Navigate to about page */
  const handleAbout = () => navigate('/about');

  /** Toggle sidebar collapsed/expanded state */
  const handleToggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    // Main application container with layered background effects
    <div className="flex h-screen text-slate-100 font-sans relative overflow-hidden" style={{
      // Complex layered background for depth and visual appeal
      backgroundImage: `
        linear-gradient(135deg, rgba(19,19,20,0.95) 0%, rgba(25,25,30,0.92) 50%, rgba(19,19,20,0.95) 100%),
        radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
        url('/brain-bg.jpg')
      `,
      backgroundSize: 'cover, 100% 100%, 100% 100%, cover',
      backgroundPosition: 'center, center, center, center',
      backgroundRepeat: 'no-repeat',
    }}>
      {/* Collapsible sidebar navigation */}
      <Sidebar onHome={handleHome} onNewChat={handleNewChat} onAbout={handleAbout} collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-full">
        <Routes>
          {/* Home route - Main chat interface */}
          <Route path="/" element={
            <>
              {/* Fixed top navigation bar with glassmorphism effect */}
              <div className={`fixed ${sidebarCollapsed ? 'left-16' : 'left-56'} right-0 top-0 z-20 h-16 flex items-center justify-center bg-gradient-to-r from-[#18181b]/90 via-[#23232a]/90 to-[#18181b]/90 backdrop-blur-xl shadow-xl border-b border-slate-700/50 transition-all duration-300`}>
                <div className="flex items-center space-x-3">
                  {/* App logo with gradient background */}
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  {/* App title with gradient text effect */}
                  <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ChatAi
                  </span>
                </div>
              </div>
              {showBannerError && (
                <div className={`bg-red-500 text-white p-3 text-center fixed ${sidebarCollapsed ? 'left-16' : 'left-56'} right-0 top-16 z-30 flex justify-between items-center transition-all duration-300`}>
                  <p>{error}</p>
                  <button 
                    onClick={() => setError(null)} 
                    className="ml-2 p-1 px-2 text-xs bg-red-700 hover:bg-red-800 rounded"
                    aria-label="Dismiss error"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              <div
                ref={chatContainerRef}
                className={`flex-grow p-6 overflow-y-auto space-y-6 pt-8 scroll-smooth chat-container ${showBannerError ? (sidebarCollapsed ? 'mt-28' : 'mt-28') : (sidebarCollapsed ? 'mt-16' : 'mt-16')}`}
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4a5568 #2d3748'
                }}
              >
                {messages.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full animate-fade-in-up relative">
                    <div className="text-center space-y-12 max-w-4xl mx-auto relative z-10">

                      {/* Apple-style Hero Section */}
                      <div className="space-y-8">
                        {/* Refined Logo */}
                        <div className="relative mb-12">
                          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/[0.08] shadow-2xl">
                            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                              <span className="text-4xl font-light text-white tracking-wide">AI</span>
                            </div>
                          </div>
                          {/* Subtle glow */}
                          <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl blur-2xl animate-pulse-gentle"></div>
                        </div>

                        {/* Apple-style Typography */}
                        <div className="space-y-6">
                          <h1 className="text-7xl md:text-8xl font-thin tracking-tight text-white leading-none">
                            Hello, I am
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                              ChatAi
                            </span>
                          </h1>
                          <p className="text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                            Your intelligent companion for meaningful conversations and creative collaboration.
                          </p>
                        </div>
                      </div>

                      {/* Apple-style Suggestion Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                        <div className="group relative">
                          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-700 hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] cursor-pointer">
                            <div className="flex flex-col items-center space-y-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                <span className="text-2xl">💡</span>
                              </div>
                              <div className="text-center">
                                <h3 className="text-lg font-medium text-white mb-2">Ask Anything</h3>
                                <p className="text-gray-400 text-sm font-light">Get answers to your questions with intelligent responses</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="group relative">
                          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-700 hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] cursor-pointer">
                            <div className="flex flex-col items-center space-y-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                <span className="text-2xl">🚀</span>
                              </div>
                              <div className="text-center">
                                <h3 className="text-lg font-medium text-white mb-2">Create Together</h3>
                                <p className="text-gray-400 text-sm font-light">Collaborate on creative projects and innovative ideas</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="group relative">
                          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-700 hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] cursor-pointer">
                            <div className="flex flex-col items-center space-y-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                <span className="text-2xl">✨</span>
                              </div>
                              <div className="text-center">
                                <h3 className="text-lg font-medium text-white mb-2">Explore Ideas</h3>
                                <p className="text-gray-400 text-sm font-light">Discover new perspectives and expand your thinking</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Subtle call to action */}
                      <div className="pt-8">
                        <p className="text-gray-500 text-sm font-light tracking-wide">
                          Start a conversation below
                        </p>
                      </div>
                    </div>

                    {/* Background ambient elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-float-1"></div>
                      <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-purple-400/30 rounded-full animate-float-2"></div>
                      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-400/20 rounded-full animate-float-3"></div>
                    </div>
                  </div>
                )}
                {messages.map((msg) => (
                  <ChatMessageItem 
                    key={msg.id} 
                    message={msg} 
                    isActiveStreamTarget={msg.id === activeAiMessageId}
                  />
                ))}
                {isLoading && messages.length === 0 && !error && (
                     <div className="flex justify-center items-center h-full">
                        <p>Initializing AI, please wait...</p>
                     </div>
                )}
              </div>
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              {/* Floating open sidebar button */}
              {sidebarCollapsed && (
                <button
                  className="fixed left-2 top-4 z-50 bg-[#23232a] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border border-[#23232a] hover:bg-[#18181b] transition-colors"
                  onClick={handleToggleSidebar}
                  aria-label="Open sidebar"
                >
                  <span className="text-2xl">≡</span>
                </button>
              )}
            </>
          } />
          <Route path="/about" element={<AboutPage />} />

        </Routes>
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up-delay {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(147, 51, 234, 0.5);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }

        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          75% { transform: translateY(5px) rotate(270deg); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.3s both;
        }

        .animate-slide-up-delay {
          animation: slide-up-delay 1s ease-out 0.6s both;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 4s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 5s ease-in-out infinite;
        }

        /* Grid pattern background for chat container */
        .chat-container {
          --color: rgba(114, 114, 114, 0.15);
          background-color: transparent;
          background-image:
            linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%, transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%, transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%, transparent);
          background-size: 55px 55px;
          position: relative;
        }

        .chat-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(24, 24, 27, 0.8) 0%, rgba(24, 24, 27, 0.4) 50%, rgba(24, 24, 27, 0.8) 100%);
          pointer-events: none;
          z-index: 0;
        }

        .chat-container > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default App;
