import PropTypes from 'prop-types';

export const Select = ({
  children,
  onValueChange,
  disabled,
  value,
  className = '',
}) => (
  <div className={`relative ${className}`}>
    <select
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      value={value}
      className="w-full p-3 border rounded-md bg-white focus:outline-none focus:ring"
    >
      {children}
    </select>
  </div>
);

Select.propTypes = {
  children: PropTypes.node.isRequired, // Ensures that children are provided and can be any valid React nodes
  onValueChange: PropTypes.func.isRequired, // Ensures onValueChange is a required function
  disabled: PropTypes.bool, // Ensures disabled is a boolean (optional)
  value: PropTypes.string.isRequired, // Ensures value is a string
  className: PropTypes.string, // Ensures className is a string (optional)
};

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

SelectItem.propTypes = {
  value: PropTypes.string.isRequired, // Ensures value is a string
  children: PropTypes.node.isRequired, // Ensures children are provided (could be any valid React node)
};

export default Select;
