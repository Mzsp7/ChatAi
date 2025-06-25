
/**
 * Loading Dots Component
 *
 * A sophisticated 3D animated loading indicator featuring a rotating cube
 * with gradient colors and glow effects. Provides visual feedback during
 * AI response generation and other loading states.
 *
 * Key Features:
 * - 3D CSS transforms and perspective
 * - Continuous rotation animation
 * - Gradient color transitions (blue to purple)
 * - Glow effects and shadows
 * - Accessibility support with screen reader text
 * - Smooth 60fps animation performance
 *
 * Design Elements:
 * - 24px cube with 4 faces
 * - CSS custom properties for face positioning
 * - Blur effects and box shadows for depth
 * - Professional Apple-inspired color scheme
 */

import React from 'react';

/**
 * LoadingDots Component
 *
 * Renders a 3D animated cube that rotates continuously to indicate loading state.
 * Uses advanced CSS transforms and animations for smooth visual feedback.
 *
 * @returns JSX element representing the loading animation
 */
const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      {/* Screen reader accessibility text */}
      <span className="sr-only">Loading...</span>

      {/* Main 3D cube container */}
      <div className="cube-loader">
        {/* Top face of the cube with glow effect */}
        <div className="cube-top"></div>

        {/* Wrapper for the 4 side faces */}
        <div className="cube-wrapper">
          {/* 4 cube faces positioned using CSS custom properties */}
          <span style={{'--i': 0} as React.CSSProperties} className="cube-span"></span>
          <span style={{'--i': 1} as React.CSSProperties} className="cube-span"></span>
          <span style={{'--i': 2} as React.CSSProperties} className="cube-span"></span>
          <span style={{'--i': 3} as React.CSSProperties} className="cube-span"></span>
        </div>
      </div>

      {/* 3D Cube Animation Styles */}
      <style jsx>{`
        /* Main cube container with 3D perspective and rotation */
        .cube-loader {
          position: relative;
          width: 24px;
          height: 24px;
          transform-style: preserve-3d;  /* Enable 3D transforms for children */
          transform: rotateX(-30deg);    /* Initial tilt for better 3D view */
          animation: animate 4s linear infinite;  /* Continuous rotation */
        }

        /* Keyframe animation for smooth 360-degree rotation */
        @keyframes animate {
          0% {
            transform: rotateX(-30deg) rotateY(0);      /* Start position */
          }
          100% {
            transform: rotateX(-30deg) rotateY(360deg); /* Full rotation */
          }
        }

        /* Container for the 4 side faces of the cube */
        .cube-loader .cube-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;  /* Maintain 3D context */
        }

        /* Individual cube faces with gradient backgrounds */
        .cube-loader .cube-wrapper .cube-span {
          position: absolute;
          width: 100%;
          height: 100%;
          /* Position each face using CSS custom property --i (0,1,2,3) */
          /* Each face rotated 90deg apart and translated forward */
          transform: rotateY(calc(90deg * var(--i))) translateZ(12px);

          /* Beautiful gradient from blue to purple with smooth transitions */
          background: linear-gradient(
            to bottom,
            hsl(217, 91%, 60%) 0%,   /* Blue start */
            hsl(217, 91%, 65%) 10%,
            hsl(217, 91%, 70%) 20%,
            hsl(271, 91%, 65%) 30%,  /* Transition to purple */
            hsl(271, 91%, 70%) 40%,
            hsl(271, 91%, 75%) 50%,  /* Purple middle */
            hsl(217, 91%, 75%) 60%,  /* Back to blue */
            hsl(217, 91%, 80%) 70%,
            hsl(271, 91%, 80%) 80%,  /* Purple again */
            hsl(271, 91%, 85%) 90%,
            hsl(217, 91%, 85%) 100%  /* Blue end */
          );
        }

        /* Top face of the cube */
        .cube-top {
          position: absolute;
          width: 24px;
          height: 24px;
          background: hsl(217, 91%, 60%);  /* Solid blue color */
          transform: rotateX(90deg) translateZ(12px);  /* Positioned as top face */
          transform-style: preserve-3d;
        }

        /* Glow effect underneath the cube using pseudo-element */
        .cube-top::before {
          content: '';
          position: absolute;
          width: 24px;
          height: 24px;
          background: hsl(271, 91%, 65%);  /* Purple glow */
          transform: translateZ(-28px);    /* Positioned below cube */
          filter: blur(4px);               /* Blur for glow effect */

          /* Multiple box shadows for enhanced glow */
          box-shadow:
            0 0 4px rgba(59, 130, 246, 0.5),   /* Blue inner glow */
            0 0 8px rgba(139, 92, 246, 0.3),   /* Purple middle glow */
            0 0 12px rgba(59, 130, 246, 0.2);  /* Blue outer glow */
        }
      `}</style>
    </div>
  );
};

export default LoadingDots;
