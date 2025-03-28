import React from 'react';
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import PropTypes from 'prop-types';
import FlyToMarker from '../Map/FlyToMarker';
import MarkerIcon from '../Map/MarkerIcon';

const defaultCenter = [6.7115, 79.9044];

const SosMapContainer = ({ sosdata }) => {
  return (
    <LeafletMap
      center={defaultCenter}
      zoom={12}
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />

      <Marker
        key={sosdata.vesselId}
        position={[sosdata.lat, sosdata.lng]}
        icon={MarkerIcon('vessel')}
      >
        <Popup>{sosdata.vesselId}</Popup>
      </Marker>

      {sosdata && <FlyToMarker position={[sosdata.lat, sosdata.lng]} />}
    </LeafletMap>
  );
};

SosMapContainer.propTypes = {
  sosdata: PropTypes.shape({
    vesselId: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

export default SosMapContainer;
