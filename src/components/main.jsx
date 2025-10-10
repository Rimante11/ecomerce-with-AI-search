import React from "react";
import "../styles/hero.css";

const Home = () => {
  const scrollToProducts = () => {
    const element = document.getElementById('shop-by-category');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <div className="hero-fullscreen">
        <div className="video-container">
          <video
            className="hero-video"
            src="./assets/images/bedtimenew.mp4"
            autoPlay
            muted
            loop
          />
          <div className="hero-overlay">
            <div className="container">
              <h5 className="hero-title">Your Cozy Arrivals</h5>
              <p className="hero-subtitle">
                Wrap yourself in comfort — where style meets softness.
              </p>
              <button className="hero-button" onClick={scrollToProducts}>
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
