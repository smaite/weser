import { useEffect } from 'react';

/**
 * MobileViewportFix Component
 * 
 * Fixes mobile viewport issues that cause bottom navigation to be hidden
 * by mobile browser UI elements (address bar, etc.)
 */
const MobileViewportFix = () => {
  useEffect(() => {
    // Only run on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) return;

    const handleViewportChange = () => {
      // Set CSS custom property for actual viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Force recalculation of bottom navigation position
      const bottomNavs = document.querySelectorAll('.fixed.bottom-0');
      bottomNavs.forEach(nav => {
        nav.style.bottom = '0px';
        nav.style.position = 'fixed';
        nav.style.zIndex = '9999';
      });
    };

    // Set initial viewport height
    handleViewportChange();

    // Update on resize (when mobile browser UI shows/hides)
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', () => {
      // Delay to ensure proper calculation after orientation change
      setTimeout(handleViewportChange, 100);
    });

    // iOS specific fixes
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // Prevent zoom on input focus
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (input.style.fontSize === '' || parseInt(input.style.fontSize) < 16) {
          input.style.fontSize = '16px';
        }
      });

      // Fix iOS viewport unit issues
      const setIOSViewport = () => {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover'
          );
        }
      };
      setIOSViewport();
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default MobileViewportFix;
