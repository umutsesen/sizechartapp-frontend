import React from 'react';
import PropTypes from 'prop-types';


const Button = ({ children, className, onClick, ...props }) => {
  return (
    <button 
      className={`button ${className}`} 
      onClick={onClick} 
      {...props}
    >
      {children}
    </button>
  );
}

// Defining prop types for better documentation and validation
Button.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

// Default props
Button.defaultProps = {
  className: '',
  onClick: () => {}
};

export default Button;
