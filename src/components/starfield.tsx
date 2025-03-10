import React, { useEffect, useRef } from 'react';
import './starfield.css';

const Starfield: React.FC = () => {
  const starfieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const starfield = starfieldRef.current;
    if (!starfield) return;

    // Number of stars
    const numStars = 100;

    // Create stars
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');

      // Randomize star position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      // Randomize animation duration and delay

      const moveDuration = 30; 
      const moveDelay = 0; 
      star.style.setProperty('--move-duration', `${moveDuration}s`);
      star.style.setProperty('--move-delay', `-${moveDelay}s`);

      const twinkleDuration = 1 + Math.random()*5; // Between 1 and 3 seconds
      const twinkleDelay = Math.random() * 3; // Up to 3 seconds delay
      star.style.setProperty('--twinkle-duration', `${twinkleDuration}s`);
      star.style.setProperty('--twinkle-delay', `-${twinkleDelay}s`);

      // Randomize movement direction
      const angle = Math.random() * 360; // Random angle in degrees
      const distance = 120; // Random distance to move
      star.style.setProperty('--angle', `${angle}deg`);
      star.style.setProperty('--distance', `${distance}px`);

      starfield.appendChild(star);
    }

    // Cleanup function to remove stars when the component unmounts
    return () => {
      while (starfield.firstChild) {
        starfield.removeChild(starfield.firstChild);
      }
    };
  }, []);

  return <div ref={starfieldRef} className="starfield"></div>;
};

export default Starfield;