import React from 'react';
import PropTypes from 'prop-types';

const MpZoneSelector = ({ zones, selectedZone, setSelectedZone, loading }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Zone:
      </label>
      {loading ? (
        <div className="text-gray-500 text-center py-2">Loading zones...</div>
      ) : (
        <select
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
        >
          <option value="all">Select a zone</option>
          {zones.map((zone) => (
            <option key={zone._id} value={zone._id}>
              {zone.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

MpZoneSelector.propTypes = {
  zones: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedZone: PropTypes.string.isRequired,
  setSelectedZone: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default MpZoneSelector;
