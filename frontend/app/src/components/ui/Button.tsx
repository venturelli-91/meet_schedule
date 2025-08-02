import { Button } from 'flowbite-react';
import React from 'react';

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  onClick?: () => void;
}

function CustomButton({ children, onClick, ...props }: CustomButtonProps) {
  return (
    <Button
      className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
        overflow-hidden text-sm font-medium 
        text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 
        group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white 
        focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
      onClick={onClick}
      {...props}
    >
      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
        {children}
      </span>
    </Button>
  );
}

export default CustomButton;
