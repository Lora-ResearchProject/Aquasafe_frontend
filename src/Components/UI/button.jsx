import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({ children, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${className} px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired, // children can be any renderable content (string, number, JSX, etc.)
  onClick: PropTypes.func.isRequired, // onClick should be a function
  disabled: PropTypes.bool, // disabled is a boolean, defaults to false if not provided
  className: PropTypes.string, // className is a string
};

Button.defaultProps = {
  disabled: false, // Default value for disabled is false
  className: '', // Default empty string for className
};

export default Button;
