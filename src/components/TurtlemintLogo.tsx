import React from 'react';

interface TurtlemintLogoProps {
  className?: string;
}

export const TurtlemintLogo: React.FC<TurtlemintLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* Exact Turtlemint branding matching the uploaded image */}
      <div className="flex items-center">
        <span className="font-extrabold text-[#00A86B] tracking-[-0.04em] text-2xl sm:text-3xl font-sans lowercase">
          turtlemint
        </span>
        {/* Turtlemint mint leaf symbol on top right */}
        <div className="relative -top-2.5 ml-1 w-6 h-6 flex items-center justify-center">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
            {/* Dark green quadrant/leaf */}
            <path
              d="M4 22C4 12.0589 12.0589 4 22 4H32V14C32 23.9411 23.9411 32 14 32H4V22Z"
              fill="#018052"
            />
            {/* Bright mint leaf top-right */}
            <path
              d="M22 4C27.5228 4 32 8.47715 32 14H22V4Z"
              fill="#00D68F"
            />
            {/* Mint highlight */}
            <path
              d="M22 14C22 19.5228 17.5228 24 12 24V14H22Z"
              fill="#00E599"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
