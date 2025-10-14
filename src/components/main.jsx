import React, { useEffect, useRef, useState } from "react";
import "../styles/hero.css";

const Home = () => {
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const scrollToProducts = () => {
    const element = document.getElementById('shop-by-category');
    if (element) {
      // Calculate the target position with offset for navbar
      const navbarHeight = 80;
      const elementTop = element.offsetTop - navbarHeight;
      
      // Use browser's native smooth scroll for fastest response
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();

    // Try to play video on mobile with user interaction
    const handleUserInteraction = () => {
      if (videoRef.current && isMobile) {
        videoRef.current.play().catch(error => {
          console.log("Video autoplay failed:", error);
          setVideoError(true);
        });
      }
    };

    // Add event listeners for user interaction
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [isMobile]);

  return (
    <>
      <div className="hero-fullscreen">
        <div className="video-container">
          {!videoError ? (
            <video
              ref={videoRef}
              className="hero-video"
              src="/assets/images/bedtimenew.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/assets/images/placeholder.png"
              onError={() => setVideoError(true)}
              onLoadedData={() => {
                if (videoRef.current && isMobile) {
                  videoRef.current.play().catch(() => {
                    console.log("Video play failed even after loading");
                  });
                }
              }}
            />
          ) : (
            <div 
              className="hero-video hero-fallback-image"
              style={{
                background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/assets/images/placeholder.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          )}
          <div className="hero-overlay">
            <div className="container">
              <h5 className="hero-title">Your cozy a rrivals</h5>
              <p className="hero-subtitle">
                Wrap yourself in comfort — where style meets softness.
              </p>
              <button 
                className="hero-button" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToProducts();
                }}
              >
                Discover Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
