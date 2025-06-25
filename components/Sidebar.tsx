/**
 * Sidebar Navigation Component
 *
 * A collapsible sidebar navigation component that provides access to main
 * application features. Features Apple-inspired design with glassmorphism
 * effects, smooth animations, and responsive behavior.
 *
 * Key Features:
 * - Collapsible design for space efficiency
 * - Smooth animations and hover effects
 * - Gradient backgrounds and 3D visual effects
 * - Responsive navigation buttons
 * - Clean, modern Apple-inspired aesthetic
 *
 * Navigation Options:
 * - Home: Return to main chat interface
 * - New Chat: Start a fresh conversation
 * - About: View application information
 */

import React from 'react';

/**
 * Props interface for the Sidebar component
 */
interface SidebarProps {
  /** Callback function to navigate to home page */
  onHome: () => void;
  /** Callback function to start a new chat */
  onNewChat: () => void;
  /** Callback function to navigate to about page */
  onAbout: () => void;
  /** Boolean indicating if sidebar is in collapsed state */
  collapsed: boolean;
  /** Callback function to toggle sidebar collapsed state */
  onToggle: () => void;
}

// ============================================================================
// ICON COMPONENTS
// ============================================================================

/**
 * Home icon component using Heroicons
 * Represents the home/main page navigation option
 */
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

/**
 * Chat icon component using Heroicons
 * Represents the new chat/conversation option
 */
const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

/**
 * About/Information icon component using Heroicons
 * Represents the about page navigation option
 */
const AboutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);





// ============================================================================
// MAIN SIDEBAR COMPONENT
// ============================================================================

/**
 * Main Sidebar Component
 *
 * Renders a responsive sidebar with navigation options and smooth animations.
 * Supports both collapsed and expanded states with appropriate visual feedback.
 *
 * @param props - Component props including navigation handlers and state
 * @returns JSX element representing the sidebar navigation
 */
const Sidebar: React.FC<SidebarProps> = ({ onHome, onNewChat, onAbout, collapsed, onToggle }) => {
  return (
    <aside className={`h-full ${collapsed ? 'w-16' : 'w-56'} bg-[#18181b] text-slate-100 flex flex-col py-6 px-3 border-r border-[#23232a] transition-all duration-300`}>

      {/* Collapse/Expand toggle button */}
      <button
        className="mb-8 flex items-center justify-center w-8 h-8 rounded hover:bg-[#23232a] transition-colors self-end"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {/* Dynamic arrow icons based on collapsed state */}
        {collapsed ? (
          <span className="text-2xl">»</span>
        ) : (
          <span className="text-2xl">«</span>
        )}
      </button>

      {/* App title - hidden when collapsed */}
      <div className={`mb-8 flex items-center justify-center ${collapsed ? 'hidden' : ''}`}>
        <span className="text-xl font-bold tracking-wide">ChatAi</span>
      </div>
      {/* Navigation menu with animated buttons */}
      <nav className="flex flex-col gap-2">

        {/* Home navigation button with blue gradient hover effect */}
        <button
          className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border-blue-500/20 border border-transparent transition-all duration-300 text-left"
          onClick={onHome}
        >
          {/* Icon with color transition on hover */}
          <div className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300">
            <HomeIcon />
          </div>
          {/* Label text - hidden when collapsed */}
          {!collapsed && <span className="text-sm font-medium group-hover:text-white transition-colors duration-300">Home</span>}
        </button>

        {/* New Chat button with green gradient hover effect */}
        <button
          className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 hover:border-green-500/20 border border-transparent transition-all duration-300 text-left"
          onClick={onNewChat}
        >
          {/* Icon with color transition on hover */}
          <div className="text-slate-400 group-hover:text-green-400 transition-colors duration-300">
            <ChatIcon />
          </div>
          {/* Label text - hidden when collapsed */}
          {!collapsed && <span className="text-sm font-medium group-hover:text-white transition-colors duration-300">New Chat</span>}
        </button>

        {/* About button with purple gradient hover effect and top margin for spacing */}
        <button
          className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:border-purple-500/20 border border-transparent transition-all duration-300 text-left mt-8"
          onClick={onAbout}
        >
          {/* Icon with color transition on hover */}
          <div className="text-slate-400 group-hover:text-purple-400 transition-colors duration-300">
            <AboutIcon />
          </div>
          {/* Label text - hidden when collapsed */}
          {!collapsed && <span className="text-sm font-medium group-hover:text-white transition-colors duration-300">About</span>}
        </button>

      </nav>

      {/* Spacer to push content to top and bottom */}
      <div className="flex-grow" />
    </aside>
  );
};

export default Sidebar; 