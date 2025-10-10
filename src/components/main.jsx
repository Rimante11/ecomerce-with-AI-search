import React from "react";
import "../styles/hero.css";

const Home = () => {
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
