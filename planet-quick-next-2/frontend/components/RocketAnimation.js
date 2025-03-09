import React from 'react';

const RocketAnimation = ({ message = "Way to Planet Quick!" }) => {
  return (
    <div className="rocket-animation-container">
      <span className="rocket">🚀</span>
      <div className="chemtrail">{message}</div>
      <style jsx>{`
        .rocket-animation-container {
          position: fixed;
          top: 50%;
          left: 0;
          width: 100%;
          height: 50px;
          z-index: 2000;
          pointer-events: none;
        }

        .rocket {
          position: absolute;
          font-size: 40px;
          animation: flyAcross 3s linear forwards;
        }

        @keyframes flyAcross {
          0% { transform: translateX(-50px) rotate(45deg); }
          100% { transform: translateX(100vw) rotate(45deg); }
        }

        .chemtrail {
          position: absolute;
          top: 50%;
          left: 50px;
          color: #FF4500;
          font-family: 'STIX Two Text', serif;
          font-size: 12px;
          white-space: nowrap;
          animation: trail 3s linear forwards;
        }

        @keyframes trail {
          0% {
            transform: translateX(0);
            opacity: 1;
            font-size: 12px;
          }
          50% {
            font-size: 24px;
            opacity: 0.7;
          }
          100% {
            transform: translateX(200px);
            font-size: 36px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RocketAnimation;