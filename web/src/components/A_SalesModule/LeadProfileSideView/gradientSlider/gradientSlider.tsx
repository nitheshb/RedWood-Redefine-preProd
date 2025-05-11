import { useState,useEffect, useRef } from 'react';

export default function GradientSlider( {opstr, setopstr}) {
  const [value, setValue] = useState(50);
  const [labelPosition, setLabelPosition] = useState(50);
  const sliderRef = useRef(null);
  const handleChange = (event) => {
    setopstr(event.target.value);
    updateLabelPosition(event.target.value);
  };
  const updateLabelPosition = (val) => {
    if (sliderRef.current) {
      const sliderWidth = sliderRef.current.offsetWidth;
      const percent = (val - sliderRef.current.min) / (sliderRef.current.max - sliderRef.current.min);
      const thumbWidth = 20; // Width of the thumb in pixels

      // Calculate position accounting for the thumb width to center it
      const pixelPosition = percent * (sliderWidth - thumbWidth) + (thumbWidth / 2);
      const percentPosition = (pixelPosition / sliderWidth) * 100;

      setLabelPosition(percentPosition);
    }
  };
  useEffect(() => {
    updateLabelPosition(opstr);
    const handleResize = () => updateLabelPosition(opstr);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [opstr]);
  return (
    <div className="flex flex-col items-center  rounded-lg">
      <style jsx>{`
        /* Slider container */
        .slider-container {
          margin: 20px 0;
          padding-top: 24px; /* Space for the floating label */
          position: relative;
        }

        /* Slider track */
        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 5px;
          background: #e2e8f0; /* Light gray track */
          outline: none;
          position: relative;
        }

        /* Slider track fill with gradient */
        .slider::before {
          content: "";
          position: absolute;
          height: 100%;
          width: ${opstr}%;
          left: 0;
          top: 0;
          border-radius: 5px;
          // background: linear-gradient(210deg, #AEECF6 0%, #94B5ED 100%),
          //             linear-gradient(226deg, #08E3FF 0%, #5799F7 100%);
          background: linear-gradient(245deg, #AEECF6 0%, #94B5ED 100%);
          background-blend-mode: overlay;
          z-index: 1;
        }

        /* Slider thumb */
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(210deg, #08E3FF 0%, #5799F7 100%);
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          position: relative;
          z-index: 2;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(210deg, #08E3FF 0%, #5799F7 100%);
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          position: relative;
          z-index: 2;
          border: none;
        }

        /* Floating value label */
        .value-label {
          position: absolute;
          top: 0;
          left: ${labelPosition}%;
          transform: translateX(-50%);
          background: linear-gradient(210deg, #08E3FF 0%, #5799F7 100%);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          z-index: 3;
          user-select: none;
          transition: left 0.1s ease-out;
        }

        /* Arrow pointing down from label to thumb */
        .value-label::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #5799F7;
        }
      `}</style>
      <div className="slider-container w-full">
        <div className="value-label">{opstr}</div>
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="100"
          value={opstr}
          className="slider"
          onChange={handleChange}
        />
      </div>


    </div>
  );
}