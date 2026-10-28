import React from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GlassButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: GlassButtonProps) {
  const variants = {
    primary: 'rgba(139, 44, 255, 0.3)',
    secondary: 'rgba(23, 109, 255, 0.3)',
    accent: 'rgba(240, 0, 232, 0.3)',
  };

  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`glass-button ${sizes[size]} ${className}`}
      style={{
        background: variants[variant],
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '12px',
        color: '#ffffff',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      }}
    >
      {children}
    </button>
  );
}
