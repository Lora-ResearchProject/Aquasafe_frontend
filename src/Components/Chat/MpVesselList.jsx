import React from 'react';
import PropTypes from 'prop-types';

const MpVesselList = ({ vessels, loading }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Vessels to Receive Message:
      </label>
      {loading ? (
        <div className="text-gray-500 text-center py-2">Loading vessels...</div>
      ) : vessels.length === 0 ? (
        <div className="text-gray-500 text-center py-2">
          No vessels available.
        </div>
      ) : (
        <ul className="max-h-48 overflow-y-auto border rounded-lg p-2">
          {vessels.map((vessel) => (
            <li key={vessel.vesselId} className="text-sm text-gray-700">
              {vessel.vesselName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

MpVesselList.propTypes = {
  vessels: PropTypes.arrayOf(
    PropTypes.shape({
      vesselId: PropTypes.string.isRequired,
      vesselName: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};
export default MpVesselList;
