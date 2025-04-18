import React from 'react';
import PropTypes from 'prop-types';

const RefreshButton = ({ onRefresh }) => {
  return (
    <button
      onClick={onRefresh}
      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
    >
      Refresh
    </button>
  );
};

RefreshButton.propTypes = {
  onRefresh: PropTypes.func.isRequired,
};

export default RefreshButton;
