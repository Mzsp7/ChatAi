/**
 * Chat Message Item Component
 *
 * Renders individual chat messages with different styling for user and AI messages.
 * Features sophisticated animations, glassmorphism effects, and automatic link detection.
 *
 * Key Features:
 * - Distinct styling for user vs AI messages
 * - Automatic URL detection and link creation
 * - Loading animation for streaming AI responses
 * - Apple-inspired design with glassmorphism effects
 * - Smooth animations and hover effects
 * - Responsive design with proper spacing
 *
 * Design Elements:
 * - User messages: Dark bubble on the right
 * - AI messages: Transparent background on the left with avatar
 * - Gradient borders and shadows
 * - Professional typography and spacing
 */

import React from 'react';
import { ChatMessageData, MessageRole } from '../types';
import LoadingDots from './LoadingDots';

/**
 * Props interface for ChatMessageItem component
 */
interface ChatMessageItemProps {
  /** The message data to display */
  message: ChatMessageData;
  /** Whether this message is currently receiving streamed content */
  isActiveStreamTarget: boolean;
}

/**
 * ChatMessageItem Component
 *
 * Renders a single chat message with appropriate styling based on the sender.
 * Handles text formatting, link detection, and loading states.
 *
 * @param props - Component props including message data and streaming state
 * @returns JSX element representing a chat message
 */
const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, isActiveStreamTarget }) => {
  // ============================================================================
  // STYLING AND LAYOUT LOGIC
  // ============================================================================

  /** Determine if this is a user message */
  const isUser = message.role === MessageRole.USER;

  /** Container classes for message alignment */
  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  /** Bubble styling classes based on message type */
  const bubbleClasses = isUser
    ? 'bg-[#333537] rounded-2xl'  // Dark bubble for user messages
    : 'bg-transparent';           // Transparent for AI messages

  // ============================================================================
  // TEXT PROCESSING UTILITIES
  // ============================================================================

  /**
   * Render text with automatic link detection and conversion
   *
   * Scans the text for URLs and converts them to clickable links
   * while preserving the rest of the text formatting.
   *
   * @param text - The text content to process
   * @returns React nodes with links converted to anchor elements
   */
  const renderTextWithLinks = (text: string): React.ReactNode => {
    // Regular expression to match HTTP/HTTPS URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
        if (urlRegex.test(part)) {
            // Convert URLs to clickable links with security attributes
            return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{part}</a>;
        }
        return part;
    });
  };

  return (
    <div className={`flex items-start space-x-4 ${containerClasses} animate-message-appear group mb-6`}>
      {!isUser && (
        <div className="w-12 h-12 flex-shrink-0 relative">
          {/* AI Avatar with Apple-inspired design */}
          <div className="w-12 h-12 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/[0.08] shadow-2xl group-hover:scale-105 transition-all duration-500">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              {/* AI Brain/Chip Icon */}
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L19 8L21 9ZM22 3H16V5H22V3ZM2 3V5H8V3H2ZM3 9L5 8L3 7V9ZM12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18ZM21 17V15L19 16L21 17ZM22 21H16V19H22V21ZM2 21V19H8V21H2ZM3 17L5 16L3 15V17ZM12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"/>
              </svg>
            </div>
          </div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-lg animate-pulse-gentle opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      )}
      <div className={`relative max-w-4xl ${bubbleClasses}`}>
        <div className={`relative overflow-hidden message-container ${isUser ? 'user-message' : 'ai-message'} transition-all duration-500 group-hover:shadow-2xl`}>

          {/* Background patterns and effects */}
          <div className="absolute inset-0 opacity-40">
            {isUser ? (
              <>
                {/* User message gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 via-purple-500/90 to-indigo-600/90"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.1]"></div>
              </>
            ) : (
              <>
                {/* AI message glassmorphism background */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-purple-500/[0.03]"></div>
              </>
            )}
          </div>

          {/* Border and container styling */}
          <div className={`relative z-10 rounded-3xl p-6 ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl border border-white/20'
              : 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] text-white shadow-lg hover:border-white/[0.16] hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04]'
          }`}>

            {/* Content */}
            <div className={`prose prose-sm max-w-none whitespace-pre-wrap break-words ${isUser ? 'prose-invert' : ''}`}
                 style={{
                   fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                   fontSize: '1.05rem',
                   lineHeight: '1.7',
                   color: '#ffffff'
                 }}>
              {renderTextWithLinks(message.text)}
            </div>

            {/* AI typing indicator */}
            {isActiveStreamTarget && (
              <div className="mt-4 flex items-center space-x-3">
                <div className="scale-75">
                  <LoadingDots />
                </div>
                <span className="text-xs text-white/70 font-light tracking-wide">AI is thinking...</span>
              </div>
            )}

            {/* Message type indicator */}
            <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
              isUser ? 'bg-white/30' : 'bg-blue-400/50'
            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

            {/* Subtle accent line */}
            <div className={`absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent ${
              isUser ? 'via-white/20' : 'via-white/10'
            } to-transparent`}></div>
          </div>

          {/* Enhanced glow effect */}
          <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl ${
            isUser
              ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20'
              : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
          }`}></div>
        </div>

        {/* Enhanced timestamp */}
        <div className="absolute -bottom-5 left-2 text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 font-light">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {isUser && (
        <div className="w-12 h-12 flex-shrink-0 relative">
          {/* User Avatar with Apple-inspired design */}
          <div className="w-12 h-12 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/[0.08] shadow-2xl group-hover:scale-105 transition-all duration-500">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              {/* User Person Icon */}
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes message-appear {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
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

        .animate-message-appear {
          animation: message-appear 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        /* Message container styling */
        .message-container {
          position: relative;
          border-radius: 24px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .user-message {
          background: linear-gradient(135deg,
            rgba(59, 130, 246, 0.9) 0%,
            rgba(147, 51, 234, 0.9) 50%,
            rgba(79, 70, 229, 0.9) 100%);
          box-shadow:
            0 8px 32px rgba(59, 130, 246, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .ai-message {
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.02) 100%);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .user-message:hover {
          background: linear-gradient(135deg,
            rgba(59, 130, 246, 0.95) 0%,
            rgba(147, 51, 234, 0.95) 50%,
            rgba(79, 70, 229, 0.95) 100%);
          box-shadow:
            0 12px 40px rgba(59, 130, 246, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .ai-message:hover {
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.04) 100%);
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        /* Enhanced link styling for both message types */
        .prose a {
          color: rgba(147, 197, 253, 0.9);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .prose a:hover {
          color: rgba(196, 181, 253, 1);
          border-bottom-color: rgba(147, 197, 253, 0.6);
          text-shadow: 0 0 8px rgba(147, 197, 253, 0.3);
        }

        /* Enhanced code styling for both message types */
        .prose code {
          background: rgba(0, 0, 0, 0.3);
          color: rgba(196, 181, 253, 0.9);
          padding: 0.2em 0.5em;
          border-radius: 8px;
          font-size: 0.9em;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        }

        .prose pre {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          overflow-x: auto;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .prose pre code {
          background: transparent;
          border: none;
          padding: 0;
          color: rgba(248, 250, 252, 0.9);
        }

        /* Enhanced list styling */
        .prose ul, .prose ol {
          margin: 1.2em 0;
          padding-left: 1.5em;
        }

        .prose li {
          margin: 0.6em 0;
          line-height: 1.6;
        }

        .prose ul li::marker {
          color: rgba(147, 197, 253, 0.7);
        }

        .prose ol li::marker {
          color: rgba(147, 197, 253, 0.7);
          font-weight: 600;
        }

        /* Enhanced blockquote styling */
        .prose blockquote {
          border-left: 4px solid rgba(147, 197, 253, 0.6);
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 0 12px 12px 0;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .prose blockquote p {
          margin: 0;
          color: rgba(248, 250, 252, 0.9);
        }

        /* Headers styling */
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: rgba(248, 250, 252, 1);
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        /* Table styling */
        .prose table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5em 0;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          overflow: hidden;
        }

        .prose th, .prose td {
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1rem;
          text-align: left;
        }

        .prose th {
          background: rgba(0, 0, 0, 0.3);
          font-weight: 600;
          color: rgba(147, 197, 253, 0.9);
        }

        /* Strong and emphasis styling */
        .prose strong {
          color: rgba(248, 250, 252, 1);
          font-weight: 700;
        }

        .prose em {
          color: rgba(196, 181, 253, 0.9);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default ChatMessageItem;
