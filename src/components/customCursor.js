'use client'

import { useState, useEffect } from 'react';

const CustomCursor = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoveringOn, setHoveringOn] = useState(null);

  useEffect(() => {

    const handleMouseMove = (event) => {
      setIsHovering(true);
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseOver = (event) => {
      setIsHovering(true);

      if (event.target.closest('.linkLight')){
        setHoveringOn("cursorLinkLight");
      } else if (event.target.closest('.link')){
        setHoveringOn("cursorLink");
      } else if (event.target.closest('a')){
        setHoveringOn("cursorLink");
      } else if (event.target.closest('.cursorLight')){
        setHoveringOn("cursorLight");
      } else {
        setHoveringOn(null);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    document.addEventListener('mousemove', handleMouseMove);

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div
      className={`${isHovering ? 'customCursor' : ''} ${hoveringOn ? `${hoveringOn}` : ''}`}
      style={{
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
      }}
    />
  );
};

export default CustomCursor;