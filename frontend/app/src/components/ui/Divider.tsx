import React from 'react';

interface DividerProps {
  text?: string;
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ text, className = '' }) => {
  return (
    <div className={`flex items-center w-full my-4 ${className}`}>
      <hr className="flex-grow border-t border-gray-300" />
      {text && <span className="mx-3 text-gray-500 text-sm whitespace-nowrap">{text}</span>}
      {text && <hr className="flex-grow border-t border-gray-300" />}
    </div>
  );
};

export default Divider;
