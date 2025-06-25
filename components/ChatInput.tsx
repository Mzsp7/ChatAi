/**
 * Chat Input Component
 *
 * A sophisticated chat input component featuring Apple-inspired design with
 * glassmorphism effects, animated sparkle icons, and a rotating light send button.
 * Supports multi-line input with Enter to send functionality.
 *
 * Key Features:
 * - Animated sparkle icon with continuous rotation
 * - Glassmorphism input field with backdrop blur
 * - Rotating light effect on send button
 * - Auto-resizing textarea
 * - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
 * - Loading state with animated dots
 * - Smooth hover and focus animations
 *
 * Design Elements:
 * - Gradient backgrounds and borders
 * - 3D visual effects and shadows
 * - Smooth transitions and micro-interactions
 * - Professional Apple-inspired aesthetic
 */

import React, { useState, useCallback } from 'react';
import SendIcon from './icons/SendIcon';
import LoadingDots from './LoadingDots';

/**
 * Props interface for ChatInput component
 */
interface ChatInputProps {
  /** Callback function to handle sending messages */
  onSendMessage: (message: string) => void;
  /** Loading state to disable input during AI processing */
  isLoading: boolean;
}

/**
 * ChatInput Component
 *
 * Renders an advanced chat input interface with animations and visual effects.
 * Manages local message state and handles user interactions.
 *
 * @param props - Component props including message handler and loading state
 * @returns JSX element representing the chat input interface
 */
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /** Current message text being typed by the user */
  const [message, setMessage] = useState('');

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle sending a message
   *
   * Validates the message, sends it via callback, and clears the input.
   * Only sends if message is not empty and not currently loading.
   */
  const handleSend = useCallback(() => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }, [message, isLoading, onSendMessage]);

  /**
   * Handle keyboard events for the textarea
   *
   * Implements Enter to send functionality while preserving Shift+Enter
   * for multi-line input.
   *
   * @param event - Keyboard event from textarea
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-6 bg-gradient-to-t from-[#131314] to-[#18181b] border-t border-slate-700/50">
      <div className="relative mx-auto max-w-4xl">
        <div className="input-container relative group">
          {/* Animated Sparkle Icon */}
          <svg
            className="sparkle-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.5 6C11.3949 6.00006 11.2925 5.96705 11.2073 5.90565C11.1221 5.84425 11.0583 5.75758 11.0251 5.65792L10.7623 4.86908C10.6623 4.57101 10.4288 4.33629 10.13 4.23693L9.34102 3.97354C9.24166 3.94019 9.1553 3.87649 9.09411 3.79142C9.03292 3.70635 9 3.60421 9 3.49943C9 3.39465 9.03292 3.29252 9.09411 3.20745C9.1553 3.12238 9.24166 3.05867 9.34102 3.02532L10.13 2.76193C10.4282 2.66191 10.663 2.42852 10.7623 2.12979L11.0258 1.34094C11.0591 1.24161 11.1229 1.15526 11.2079 1.09409C11.293 1.03291 11.3952 1 11.5 1C11.6048 1 11.707 1.03291 11.7921 1.09409C11.8771 1.15526 11.9409 1.24161 11.9742 1.34094L12.2377 2.12979C12.2868 2.27697 12.3695 2.4107 12.4792 2.52041C12.589 2.63013 12.7227 2.71281 12.87 2.76193L13.659 3.02532C13.7583 3.05867 13.8447 3.12238 13.9059 3.20745C13.9671 3.29252 14 3.39465 14 3.49943C14 3.60421 13.9671 3.70635 13.9059 3.79142C13.8447 3.87649 13.7583 3.94019 13.659 3.97354L12.87 4.23693C12.5718 4.33696 12.337 4.57034 12.2377 4.86908L11.9742 5.65792C11.9411 5.75747 11.8774 5.84406 11.7923 5.90545C11.7072 5.96684 11.6049 5.99992 11.5 6Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 13C5.85133 13.0001 5.7069 12.9504 5.58969 12.859C5.47247 12.7675 5.38921 12.6395 5.35313 12.4952L5.12388 11.5745C4.91418 10.7391 4.26198 10.0868 3.42674 9.87703L2.50619 9.64774C2.36169 9.61194 2.23333 9.52878 2.14159 9.41151C2.04985 9.29425 2 9.14964 2 9.00075C2 8.85185 2.04985 8.70724 2.14159 8.58998C2.23333 8.47272 2.36169 8.38955 2.50619 8.35376L3.42674 8.12446C4.26198 7.91473 4.91418 7.2624 5.12388 6.427L5.35313 5.50629C5.38892 5.36176 5.47207 5.23338 5.58931 5.14162C5.70655 5.04986 5.85113 5 6 5C6.14887 5 6.29345 5.04986 6.41069 5.14162C6.52793 5.23338 6.61108 5.36176 6.64687 5.50629L6.87612 6.427C6.97865 6.83721 7.19071 7.21184 7.48965 7.51082C7.78858 7.80981 8.16313 8.02192 8.57326 8.12446L9.49381 8.35376C9.63831 8.38955 9.76667 8.47272 9.85841 8.58998C9.95015 8.70724 10 8.85185 10 9.00075C10 9.14964 9.95015 9.29425 9.85841 9.41151C9.76667 9.52878 9.63831 9.61194 9.49381 9.64774L8.57326 9.87703C8.16313 9.97957 7.78858 10.1917 7.48965 10.4907C7.19071 10.7897 6.97865 11.1643 6.87612 11.5745L6.64687 12.4952C6.61079 12.6395 6.52753 12.7675 6.41031 12.859C6.2931 12.9504 6.14867 13.0001 6 13Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.5005 23C13.3376 23 13.1791 22.9469 13.049 22.8487C12.9189 22.7505 12.8243 22.6127 12.7795 22.456L11.9665 19.61C11.7915 18.9971 11.4631 18.4389 11.0124 17.9882C10.5616 17.5374 10.0035 17.209 9.39054 17.034L6.54454 16.221C6.38795 16.1761 6.25021 16.0815 6.15216 15.9514C6.05411 15.8214 6.00108 15.6629 6.00108 15.5C6.00108 15.3371 6.05411 15.1786 6.15216 15.0486C6.25021 14.9185 6.38795 14.8239 6.54454 14.779L9.39054 13.966C10.0035 13.791 10.5616 13.4626 11.0124 13.0118C11.4631 12.5611 11.7915 12.0029 11.9665 11.39L12.7795 8.544C12.8244 8.38741 12.919 8.24967 13.0491 8.15162C13.1792 8.05357 13.3376 8.00054 13.5005 8.00054C13.6634 8.00054 13.8219 8.05357 13.952 8.15162C14.0821 8.24967 14.1767 8.38741 14.2215 8.544L15.0345 11.39C15.2096 12.0029 15.538 12.5611 15.9887 13.0118C16.4394 13.4626 16.9976 13.791 17.6105 13.966L20.4565 14.779C20.6131 14.8239 20.7509 14.9185 20.8489 15.0486C20.947 15.1786 21 15.3371 21 15.5C21 15.6629 20.947 15.8214 20.8489 15.9514C20.7509 16.0815 20.6131 16.1761 20.4565 16.221L17.6105 17.034C16.9976 17.209 16.4394 17.5374 15.9887 17.9882C15.538 18.4389 15.2096 18.9971 15.0345 19.61L14.2215 22.456C14.1768 22.6127 14.0822 22.7505 13.9521 22.8487C13.822 22.9469 13.6635 23 13.5005 23Z"
              fill="currentColor"
            />
          </svg>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What can I help you with?"
            className="search-input"
            rows={1}
            style={{
              overflowY: 'hidden',
              minHeight: '64px',
              fontSize: '16px',
              lineHeight: '1.5'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className="animated-send-button"
          >
            <div id="moon" className="state">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingDots />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <SendIcon />
                  <span>Send</span>
                </div>
              )}
            </div>
            <div id="sun" className="state">
              <div className="flex items-center space-x-2">
                <SendIcon />
                <span>Send</span>
              </div>
            </div>
            <span className="lightRotation"></span>
            <span className="lightRotation2"></span>
            <span className="lightRotation3"></span>
            <span className="lightRotation4"></span>
          </button>
        </div>

        {/* Character count and tips */}
        <div className="flex justify-between items-center mt-4 px-2">
          <div className="text-xs text-slate-500">
            {message.length > 0 && (
              <span className={`transition-colors duration-200 ${message.length > 1000 ? 'text-orange-400' : 'text-slate-500'}`}>
                {message.length}/2000
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500">
            Press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">Shift+Enter</kbd> for new line
          </div>
        </div>
      </div>

      <style>{`
        .input-container {
          --icon-size: 28px;
          position: relative;
        }

        .sparkle-icon {
          position: absolute;
          width: var(--icon-size);
          top: 50%;
          left: 1rem;
          transform: translateY(-50%);
          overflow: visible;
          color: rgba(148, 163, 184, 0.6);
          z-index: 10;
          transition: color 0.3s ease;
        }

        .sparkle-icon path {
          transform-box: fill-box;
          transform-origin: center;
        }

        .input-container:is(:hover, :focus-within) .sparkle-icon {
          color: rgba(59, 130, 246, 0.8);
        }

        .input-container:is(:hover, :focus-within) .sparkle-icon path {
          animation: pop 0.5s var(--d);
        }

        .sparkle-icon path:nth-of-type(1) {
          --d: 0.24s;
          --r: 20deg;
          --s: 1.5;
        }
        .sparkle-icon path:nth-of-type(2) {
          --d: 0.12s;
          --r: 10deg;
          --s: 1.4;
        }
        .sparkle-icon path:nth-of-type(3) {
          --d: 0s;
          --r: 0deg;
          --s: 1.25;
        }

        @keyframes pop {
          50% {
            scale: var(--s, 1);
            rotate: var(--r, 0deg);
          }
        }

        .search-input {
          box-shadow:
            0 20px 25px -5px rgb(0 0 0 / 0.15),
            0 8px 10px -6px rgb(0 0 0 / 0.25);
          font-family: inherit;
          width: 100%;
          padding: 1rem 5rem 1rem calc(1rem + var(--icon-size) + 0.5rem);
          font-size: 1.025rem;
          background:
            linear-gradient(#23232a, #23232a) padding-box,
            linear-gradient(120deg, hsl(217, 91%, 60%), hsl(271, 91%, 65%)) border-box;
          border: 3px solid transparent;
          border-radius: 16px;
          outline: none;
          color: #f1f5f9;
          resize: none;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: rgba(148, 163, 184, 0.6);
        }

        .search-input:focus {
          background:
            linear-gradient(#2a2a32, #2a2a32) padding-box,
            linear-gradient(120deg, hsl(217, 91%, 70%), hsl(271, 91%, 75%)) border-box;
        }

        .animated-send-button {
          --sunGradient: linear-gradient(
            60deg,
            #3d3393 0%,
            #2b76b9 37%,
            #2cacd1 65%,
            #35eb93 100%
          );
          --moonGradient: linear-gradient(to top, #cc208e 0%, #6713d2 100%);
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 120px;
          height: 50px;
          color: white;
          font-size: 0.9em;
          font-weight: 600;
          text-transform: uppercase;
          border-radius: 12px;
          background-color: transparent;
          transition: 0.5s;
          overflow: hidden;
          border: none;
          cursor: pointer;
        }

        .animated-send-button:hover:not(:disabled) {
          box-shadow: -10px -10px 300px rgba(255, 255, 255, 0.3);
          transition: 0.2s;
        }

        .animated-send-button:hover:not(:disabled) span.lightRotation,
        .animated-send-button:hover:not(:disabled) span.lightRotation2,
        .animated-send-button:hover:not(:disabled) span.lightRotation3,
        .animated-send-button:hover:not(:disabled) span.lightRotation4 {
          background: var(--sunGradient);
        }

        .state {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.4s;
          border-radius: inherit;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        #sun {
          display: none;
          background-color: rgba(33, 33, 33, 0.9);
          opacity: 0.85;
        }

        #moon {
          background-color: rgba(33, 33, 33, 0.9);
          opacity: 0.85;
        }

        .animated-send-button:hover:not(:disabled) #sun {
          display: flex;
        }

        .animated-send-button:hover:not(:disabled) #moon {
          display: none;
        }

        .animated-send-button:hover:not(:disabled) .lightRotation {
          animation: 1s linear reverse infinite rotation413;
        }

        .animated-send-button:hover:not(:disabled) .lightRotation2 {
          animation: 2s linear infinite rotation413;
        }

        .animated-send-button:hover:not(:disabled) .lightRotation3 {
          animation: 10s linear reverse infinite rotation413;
        }

        .animated-send-button:hover:not(:disabled) .lightRotation4 {
          animation: 3s linear infinite rotation413;
        }

        .lightRotation {
          position: absolute;
          transition: 0.4s;
          z-index: -1;
          width: 50px;
          height: 400px;
          transform: rotate(50deg);
          border-radius: inherit;
          background: var(--moonGradient);
        }

        .lightRotation2 {
          position: absolute;
          transition: 0.4s;
          z-index: -1;
          width: 60px;
          height: 400px;
          transform: rotate(110deg);
          border-radius: inherit;
          background: var(--moonGradient);
        }

        .lightRotation3 {
          position: absolute;
          transition: 0.4s;
          z-index: -1;
          width: 35px;
          height: 220px;
          border-radius: inherit;
          background: var(--moonGradient);
        }

        .lightRotation4 {
          position: absolute;
          transition: 0.4s;
          z-index: -1;
          width: 20px;
          height: 180px;
          transform: rotate(100deg);
          border-radius: inherit;
          background: var(--moonGradient);
        }

        .animated-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .animated-send-button:disabled .state {
          border-color: rgba(100, 116, 139, 0.3);
          background-color: rgba(100, 116, 139, 0.2);
        }

        .animated-send-button:disabled .lightRotation,
        .animated-send-button:disabled .lightRotation2,
        .animated-send-button:disabled .lightRotation3,
        .animated-send-button:disabled .lightRotation4 {
          background: linear-gradient(to top, #64748b 0%, #475569 100%);
        }

        @keyframes rotation413 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInput;
