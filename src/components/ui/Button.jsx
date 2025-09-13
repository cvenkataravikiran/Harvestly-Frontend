import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'success':
        return 'btn-success';
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      case 'info':
        return 'btn-info';
      case 'light':
        return 'btn-light';
      case 'dark':
        return 'btn-dark';
      case 'outline':
        return 'btn-outline-primary';
      case 'outline-primary':
        return 'btn-outline-primary';
      case 'outline-secondary':
        return 'btn-outline-secondary';
      case 'outline-success':
        return 'btn-outline-success';
      case 'outline-danger':
        return 'btn-outline-danger';
      case 'outline-warning':
        return 'btn-outline-warning';
      case 'outline-info':
        return 'btn-outline-info';
      case 'outline-light':
        return 'btn-outline-light';
      case 'outline-dark':
        return 'btn-outline-dark';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      case 'xl':
        return 'btn-lg px-4 py-3 fs-5';
      default:
        return '';
    }
  };

  const buttonClasses = `btn ${getVariantClass()} ${getSizeClass()} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 