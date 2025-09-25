import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page when navigating between routes.
 * This fixes the issue where React Router maintains scroll position across navigation,
 * making it behave like traditional PHP page navigation where each page starts from the top.
 * 
 * Usage: Place this component inside Router but outside Routes in App.js
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route/pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Options: 'instant' (immediate) or 'smooth' (animated)
    });

    // Alternative method if above doesn't work in some browsers:
    // document.documentElement.scrollTop = 0;
    // document.body.scrollTop = 0;
  }, [pathname]);

  // This component doesn't render anything, it just handles the scroll behavior
  return null;
};

export default ScrollToTop;
