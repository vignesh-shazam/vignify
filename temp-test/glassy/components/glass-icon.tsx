import React from 'react';

interface GlassIconProps {
  icon: React.ReactNode;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export function GlassIcon({ 
  icon, 
  label, 
  size = 'md', 
  onClick,
  className = '' 
}: GlassIconProps) {
  const sizes = {
    sm: 'p-3 w-12 h-12',
    md: 'p-4 w-16 h-16',
    lg: 'p-6 w-20 h-20',
  };

  return (
    <div 
      className={`glass-icon ${sizes[size]} ${className}`}
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {icon}
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
