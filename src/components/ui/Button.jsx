import React from 'react';

export default function Button({ children, onClick, variant = 'primary', type = 'button', className = '', disabled = false }) {
  const baseStyle = "px-6 py-3 font-bold text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded-none"; // rounded-none para ese toque brutalista/limpio
  
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800",
    secondary: "bg-zinc-100 text-black hover:bg-zinc-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-black text-black hover:bg-black hover:text-white"
  };

  return (
    <button type={type} className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}