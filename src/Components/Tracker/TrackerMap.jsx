import React from 'react';
import PropTypes from 'prop-types';
import MapContainer from '../Map/MapContainer';
import Spinner from '../UI/Spinner'; // Adjust the import path as needed

const TrackerMap = ({
  vesselData,
  gatewayData,
  zoneData,
  hotspotData,
  selectedLocation,
  setSelectedLocation,
}) => {
  const isLoading =
    vesselData.loading ||
    gatewayData.loading ||
    zoneData.loading ||
    hotspotData.loading;

  return (
    <div className="w-3/4 relative -z-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <Spinner />
        </div>
      )}
      <MapContainer
        locations={[...vesselData.locations, ...gatewayData.locations]}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        zones={zoneData.zones}
        hotspots={hotspotData.hotspots}
      />
    </div>
  );
};

TrackerMap.propTypes = {
  vesselData: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    locations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  gatewayData: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    locations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  zoneData: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    zones: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        boundary: PropTypes.arrayOf(
          PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
  hotspotData: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    hotspots: PropTypes.arrayOf(
      PropTypes.shape({
        hotspotId: PropTypes.string.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        currentDateTime: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  selectedLocation: PropTypes.shape({
    id: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  setSelectedLocation: PropTypes.func.isRequired,
};

TrackerMap.defaultProps = {
  selectedLocation: null,
};

export default TrackerMap;
