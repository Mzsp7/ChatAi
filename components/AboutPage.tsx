/**
 * About Page Component
 *
 * A sophisticated about page featuring advanced 3D animations, parallax effects,
 * and Apple-inspired design. Showcases team information, technologies used,
 * and design concepts with interactive visual effects.
 *
 * Key Features:
 * - 3D parallax mouse tracking effects
 * - Animated team member cards with gradient avatars
 * - Technology showcase with hover animations
 * - Design concept explanations
 * - Glassmorphism and depth effects
 * - Smooth transitions and micro-interactions
 *
 * Animation Features:
 * - Mouse-following 3D transforms
 * - Perspective-based card rotations
 * - Floating animations for visual elements
 * - Gradient background animations
 * - Professional Apple-inspired aesthetics
 */

import React, { useEffect, useRef } from 'react';

// ============================================================================
// CONFIGURATION DATA
// ============================================================================

/**
 * Team member information with roles and visual styling
 * Each member has initials for avatar generation and unique gradient colors
 */
const TEAM_MEMBERS = [
  { name: 'Muhammad Zaid Patil', role: 'Frontend Developer | UI/UX Designer', initials: 'MZSP', color: 'from-blue-500 to-purple-600' },
  { name: 'Sumit Patil', role: 'Full Stack Developer | AI Enthusiast', initials: 'SP', color: 'from-green-500 to-teal-600' },
  { name: 'Kanak Khavate', role: 'Website Tester | Quality Assurance', initials: 'KK', color: 'from-orange-500 to-red-600' },
  { name: 'Micah Munigetti', role: 'Website Tester | Quality Assurance', initials: 'MM', color: 'from-pink-500 to-rose-600' },
];

/**
 * Technologies and frameworks used in the project
 * Displayed as animated badges in the tech stack section
 */
const TECHNOLOGIES = [
  'React',
  'TypeScript',
  'Vite',
  'Tailwind CSS',
  'Google Gemini API',
  'Modern CSS',
];

// ============================================================================
// MAIN ABOUT PAGE COMPONENT
// ============================================================================

/**
 * AboutPage Component
 *
 * Renders an interactive about page with advanced 3D effects and animations.
 * Features mouse-tracking parallax effects and sophisticated visual design.
 *
 * @returns JSX element representing the about page
 */
const AboutPage: React.FC = () => {
  // ============================================================================
  // REFS FOR 3D ANIMATION TARGETS
  // ============================================================================

  /** Reference to main container for mouse tracking bounds */
  const containerRef = useRef<HTMLDivElement>(null);

  /** Reference to team section for 3D transform effects */
  const teamSectionRef = useRef<HTMLDivElement>(null);

  /** Reference to design section for 3D transform effects */
  const designSectionRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // 3D MOUSE TRACKING EFFECTS
  // ============================================================================

  /**
   * Set up mouse tracking for 3D parallax effects
   *
   * Creates subtle 3D rotations based on mouse position relative to the page center.
   * Uses perspective transforms to create depth and visual interest.
   */
  useEffect(() => {
    /**
     * Handle mouse movement for 3D effects
     *
     * Calculates mouse position relative to container center and applies
     * proportional 3D transforms to create parallax effects.
     *
     * @param e - Mouse event containing cursor coordinates
     */
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      // Calculate container center point
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate mouse offset from center
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Apply subtle 3D parallax to team section
      if (teamSectionRef.current) {
        // Convert mouse position to rotation angles (limited range for subtlety)
        const rotateX = (mouseY / window.innerHeight) * 2;  // Max 2 degrees
        const rotateY = (mouseX / window.innerWidth) * 2;   // Max 2 degrees

        // Apply 3D transform with perspective
        teamSectionRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
      }

      if (designSectionRef.current) {
        const rotateX = (mouseY / window.innerHeight) * -1;
        const rotateY = (mouseX / window.innerWidth) * -1;
        designSectionRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
      }
    };

    const handleMouseLeave = () => {
      if (teamSectionRef.current) {
        teamSectionRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      }
      if (designSectionRef.current) {
        designSectionRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      }
    };

    // Individual card tilt effects
    const handleCardMouseMove = (e: MouseEvent, card: HTMLElement) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / rect.height) * -10;
      const rotateY = (mouseX / rect.width) * 10;

      card.style.setProperty('--rotation-x', `${rotateX}deg`);
      card.style.setProperty('--rotation-y', `${rotateY}deg`);
      card.style.setProperty('--translate-z', '20px');
    };

    const handleCardMouseLeave = (card: HTMLElement) => {
      card.style.setProperty('--rotation-x', '0deg');
      card.style.setProperty('--rotation-y', '0deg');
      card.style.setProperty('--translate-z', '0px');
    };

    const setupCardListeners = () => {
      const teamCards = document.querySelectorAll('.team-card');
      const designCards = document.querySelectorAll('.design-card');

      [...teamCards, ...designCards].forEach((card) => {
        const htmlCard = card as HTMLElement;

        const mouseMoveHandler = (e: MouseEvent) => handleCardMouseMove(e, htmlCard);
        const mouseLeaveHandler = () => handleCardMouseLeave(htmlCard);

        htmlCard.addEventListener('mousemove', mouseMoveHandler);
        htmlCard.addEventListener('mouseleave', mouseLeaveHandler);

        // Store handlers for cleanup
        (htmlCard as any)._mouseMoveHandler = mouseMoveHandler;
        (htmlCard as any)._mouseLeaveHandler = mouseLeaveHandler;
      });
    };

    const cleanupCardListeners = () => {
      const teamCards = document.querySelectorAll('.team-card');
      const designCards = document.querySelectorAll('.design-card');

      [...teamCards, ...designCards].forEach((card) => {
        const htmlCard = card as HTMLElement;
        if ((htmlCard as any)._mouseMoveHandler) {
          htmlCard.removeEventListener('mousemove', (htmlCard as any)._mouseMoveHandler);
          htmlCard.removeEventListener('mouseleave', (htmlCard as any)._mouseLeaveHandler);
        }
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Setup card listeners after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(setupCardListeners, 100);

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      clearTimeout(timeoutId);
      cleanupCardListeners();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] px-4 py-16 text-white perspective-container"
    >
      <div className="max-w-7xl mx-auto transform-3d">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-thin tracking-tight mb-6 text-white">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Passionate individuals crafting exceptional digital experiences with precision and innovation.
          </p>
        </div>

        {/* Team Members Grid with 3D Effects */}
        <div
          ref={teamSectionRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 transform-3d transition-transform duration-500 ease-out"
        >
          {TEAM_MEMBERS.map((member, index) => (
            <div
              key={member.name}
              className="group relative animate-slide-up-3d team-card"
              style={{
                animationDelay: `${index * 100}ms`,
                '--rotation-x': '0deg',
                '--rotation-y': '0deg',
                '--translate-z': '0px'
              } as React.CSSProperties}
            >
              {/* 3D Card Container */}
              <div className="relative card-3d bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-700 hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] overflow-hidden">

                {/* Enhanced glow effect with 3D depth */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/[0.03] via-transparent to-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700 glow-3d"></div>

                {/* Floating Avatar with 3D transform */}
                <div className="relative mb-6 flex justify-center avatar-container">
                  <div className="relative transform-3d">
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 avatar-3d`}>
                      <span className="text-white text-lg font-medium tracking-wide relative z-10">
                        {member.initials}
                      </span>
                      {/* 3D depth layer */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-black/20 to-transparent transform translate-z-[-4px]"></div>
                    </div>
                    {/* Enhanced ring effect with 3D */}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-500 ring-3d"></div>
                    {/* Floating particles */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute top-2 right-2 w-1 h-1 bg-white/40 rounded-full animate-float-particle-1"></div>
                      <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white/30 rounded-full animate-float-particle-2"></div>
                    </div>
                  </div>
                </div>

                {/* Content with subtle 3D layering */}
                <div className="text-center space-y-3 relative z-10 content-3d">
                  <h3 className="text-xl font-medium text-white group-hover:text-white transition-colors duration-300 tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {member.role}
                  </p>
                </div>

                {/* Enhanced bottom accent with 3D depth */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 accent-3d"></div>

                {/* 3D depth layers */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent transform translate-z-[-2px] opacity-50"></div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-black/[0.02] transform translate-z-[-4px] opacity-30"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Application Info Section */}
        <div className="relative animate-slide-up" style={{ animationDelay: '400ms' }}>
          {/* Background blur effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-white/[0.02] backdrop-blur-3xl rounded-3xl"></div>

          <div className="relative bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-3xl p-12 border border-white/[0.08]">
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-thin tracking-tight text-white mb-4">
                About This Application
              </h2>
              <p className="text-gray-400 text-lg font-light max-w-4xl mx-auto leading-relaxed">
                Engineered with precision and built for performance. This AI chat interface represents the perfect harmony of cutting-edge technology and intuitive design.
              </p>

              {/* Technology Stack */}
              <div className="pt-8">
                <h3 className="text-lg font-light text-gray-300 mb-6 tracking-wide">
                  POWERED BY
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {TECHNOLOGIES.map((tech, index) => (
                    <div
                      key={tech}
                      className="group relative animate-bounce-in"
                      style={{ animationDelay: `${600 + index * 50}ms` }}
                    >
                      <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/[0.08] hover:border-white/[0.16] transition-all duration-500 hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] hover:scale-105">
                        <span className="text-white text-sm font-light tracking-wide">
                          {tech}
                        </span>
                      </div>
                      {/* Subtle glow on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/[0.1] to-purple-500/[0.1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom tagline */}
              <div className="pt-8 border-t border-white/[0.08]">
                <p className="text-gray-500 text-sm font-light tracking-wide">
                  Crafted with attention to detail • Built for the future
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Design Philosophy Section with 3D Effects */}
        <div
          ref={designSectionRef}
          className="relative animate-slide-up-3d mt-16 transform-3d transition-transform duration-500 ease-out"
          style={{ animationDelay: '600ms' }}
        >
          <div className="relative bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-3xl p-12 border border-white/[0.08] section-3d">
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-thin tracking-tight text-white mb-4 title-3d">
                Design Philosophy
              </h2>
              <p className="text-gray-400 text-lg font-light max-w-4xl mx-auto leading-relaxed mb-12">
                Our design draws inspiration from the finest digital experiences, combining minimalism with functionality.
              </p>

              {/* Design Ideas Grid with Advanced 3D */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 design-grid-3d">
                <div className="group relative animate-bounce-in-3d design-card" style={{ animationDelay: '800ms' }}>
                  <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-700 hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] card-tilt">
                    <div className="text-center space-y-4 relative z-10">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 icon-3d group-hover:animate-icon-float">
                        <span className="text-2xl relative z-10">🍎</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-2xl transform translate-z-[-2px]"></div>
                      </div>
                      <h3 className="text-xl font-medium text-white">Apple Aesthetic</h3>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">
                        Clean typography, glassmorphism effects, and subtle animations inspired by Apple's design language
                      </p>
                    </div>
                    {/* 3D depth layers */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.01] to-transparent transform translate-z-[-1px]"></div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-black/[0.01] transform translate-z-[-3px]"></div>
                  </div>
                </div>

                <div className="group relative animate-bounce-in-3d design-card" style={{ animationDelay: '900ms' }}>
                  <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-700 hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] card-tilt">
                    <div className="text-center space-y-4 relative z-10">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 icon-3d group-hover:animate-icon-float">
                        <span className="text-2xl relative z-10">✨</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-2xl transform translate-z-[-2px]"></div>
                      </div>
                      <h3 className="text-xl font-medium text-white">Micro-interactions</h3>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">
                        Delightful hover effects, smooth transitions, and animated elements that respond to user interaction
                      </p>
                    </div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.01] to-transparent transform translate-z-[-1px]"></div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-black/[0.01] transform translate-z-[-3px]"></div>
                  </div>
                </div>

                <div className="group relative animate-bounce-in-3d design-card" style={{ animationDelay: '1000ms' }}>
                  <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-700 hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] card-tilt">
                    <div className="text-center space-y-4 relative z-10">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 icon-3d group-hover:animate-icon-float">
                        <span className="text-2xl relative z-10">🎨</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-2xl transform translate-z-[-2px]"></div>
                      </div>
                      <h3 className="text-xl font-medium text-white">Modern UI</h3>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">
                        Contemporary design patterns with grid backgrounds, gradient borders, and sophisticated color schemes
                      </p>
                    </div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.01] to-transparent transform translate-z-[-1px]"></div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-black/[0.01] transform translate-z-[-3px]"></div>
                  </div>
                </div>

                <div className="group relative animate-bounce-in-3d design-card" style={{ animationDelay: '1100ms' }}>
                  <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-700 hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] card-tilt">
                    <div className="text-center space-y-4 relative z-10">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 icon-3d group-hover:animate-icon-float">
                        <span className="text-2xl relative z-10">🔮</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-2xl transform translate-z-[-2px]"></div>
                      </div>
                      <h3 className="text-xl font-medium text-white">3D Elements</h3>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">
                        Three-dimensional loading animations and depth effects that add visual interest and engagement
                      </p>
                    </div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.01] to-transparent transform translate-z-[-1px]"></div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-black/[0.01] transform translate-z-[-3px]"></div>
                  </div>
                </div>

                <div className="group relative animate-bounce-in-3d design-card" style={{ animationDelay: '1200ms' }}>
                  <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-700 hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] card-tilt">
                    <div className="text-center space-y-4 relative z-10">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 icon-3d group-hover:animate-icon-float">
                        <span className="text-2xl relative z-10">⚡</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-pink-600/20 rounded-2xl transform translate-z-[-2px]"></div>
                      </div>
                      <h3 className="text-xl font-medium text-white">Performance</h3>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">
                        Optimized animations and efficient rendering for smooth performance across all devices
                      </p>
                    </div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.01] to-transparent transform translate-z-[-1px]"></div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-black/[0.01] transform translate-z-[-3px]"></div>
                  </div>
                </div>

                <div className="group relative animate-bounce-in-3d design-card" style={{ animationDelay: '1300ms' }}>
                  <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-700 hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] card-tilt">
                    <div className="text-center space-y-4 relative z-10">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 icon-3d group-hover:animate-icon-float">
                        <span className="text-2xl relative z-10">🌟</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-indigo-600/20 rounded-2xl transform translate-z-[-2px]"></div>
                      </div>
                      <h3 className="text-xl font-medium text-white">User Experience</h3>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">
                        Intuitive interface design focused on accessibility, usability, and delightful user interactions
                      </p>
                    </div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.01] to-transparent transform translate-z-[-1px]"></div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-black/[0.01] transform translate-z-[-3px]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* 3D Perspective and Transform Setup */
        .perspective-container {
          perspective: 1000px;
          perspective-origin: center center;
        }

        .transform-3d {
          transform-style: preserve-3d;
        }

        /* Enhanced 3D Animations */
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px) translateZ(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateZ(0);
          }
        }

        @keyframes slide-up-3d {
          from {
            opacity: 0;
            transform: translateY(60px) translateZ(-40px) rotateX(15deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateZ(0) rotateX(0deg) scale(1);
          }
        }

        @keyframes bounce-in-3d {
          0% {
            opacity: 0;
            transform: translateY(40px) translateZ(-30px) rotateX(20deg) scale(0.7);
          }
          50% {
            transform: translateY(-10px) translateZ(10px) rotateX(-5deg) scale(1.05);
          }
          70% {
            transform: translateY(5px) translateZ(-5px) rotateX(2deg) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateZ(0) rotateX(0deg) scale(1);
          }
        }

        @keyframes float-particle-1 {
          0%, 100% {
            transform: translateY(0) translateZ(0) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-15px) translateZ(10px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes float-particle-2 {
          0%, 100% {
            transform: translateY(0) translateZ(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) translateZ(8px) rotate(-180deg);
            opacity: 0.6;
          }
        }

        @keyframes icon-float {
          0%, 100% {
            transform: translateY(0) translateZ(0) rotateY(0deg);
          }
          50% {
            transform: translateY(-8px) translateZ(12px) rotateY(180deg);
          }
        }

        /* 3D Animation Classes */
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .animate-slide-up-3d {
          animation: slide-up-3d 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .animate-bounce-in-3d {
          animation: bounce-in-3d 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .animate-float-particle-1 {
          animation: float-particle-1 3s ease-in-out infinite;
        }

        .animate-float-particle-2 {
          animation: float-particle-2 4s ease-in-out infinite;
        }

        .animate-icon-float {
          animation: icon-float 2s ease-in-out infinite;
        }

        /* 3D Card Effects */
        .team-card {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .team-card:hover {
          transform:
            perspective(1000px)
            rotateX(var(--rotation-x, 0deg))
            rotateY(var(--rotation-y, 0deg))
            translateZ(var(--translate-z, 20px))
            scale(1.02);
        }

        .card-3d {
          transform-style: preserve-3d;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        .team-card:hover .card-3d {
          transform: translateZ(10px);
          box-shadow:
            0 30px 60px -12px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 0 40px rgba(59, 130, 246, 0.1);
        }

        .avatar-3d {
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .team-card:hover .avatar-3d {
          transform: translateZ(15px) rotateY(5deg);
        }

        /* Design Philosophy 3D Effects */
        .design-card {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-tilt {
          transform-style: preserve-3d;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        .design-card:hover .card-tilt {
          transform:
            perspective(1000px)
            rotateX(-5deg)
            rotateY(5deg)
            translateZ(20px)
            scale(1.02);
          box-shadow:
            0 35px 70px -15px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 0 30px rgba(139, 92, 246, 0.15);
        }

        .icon-3d {
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .design-card:hover .icon-3d {
          transform: translateZ(10px) rotateX(10deg);
        }

        /* Enhanced Glow Effects */
        .glow-3d {
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .team-card:hover .glow-3d {
          background: radial-gradient(
            circle at center,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(139, 92, 246, 0.05) 50%,
            transparent 100%
          );
          transform: translateZ(-5px) scale(1.1);
        }

        /* Accessibility - Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .team-card,
          .design-card,
          .card-3d,
          .card-tilt,
          .avatar-3d,
          .icon-3d {
            transform: none !important;
            transition: opacity 0.3s ease !important;
          }

          .animate-slide-up-3d,
          .animate-bounce-in-3d,
          .animate-float-particle-1,
          .animate-float-particle-2,
          .animate-icon-float {
            animation: fade-in 0.5s ease forwards !important;
          }
        }

        /* Apple-style backdrop blur support */
        @supports (backdrop-filter: blur(20px)) {
          .backdrop-blur-xl {
            backdrop-filter: blur(20px);
          }
          .backdrop-blur-3xl {
            backdrop-filter: blur(64px);
          }
        }

        /* Enhanced shadow for cards */
        .shadow-3xl {
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        /* Hardware acceleration for smooth performance */
        .team-card,
        .design-card,
        .card-3d,
        .card-tilt,
        .avatar-3d,
        .icon-3d {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-origin: center center;
        }
      `}</style>
    </div>
  );
};

export default AboutPage; 