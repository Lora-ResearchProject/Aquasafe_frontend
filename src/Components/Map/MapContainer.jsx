import React from 'react';
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Circle,
} from 'react-leaflet';
import PropTypes from 'prop-types';
import FlyToMarker from './FlyToMarker';
import MarkerIcon from './MarkerIcon';

const defaultCenter = [7.8731, 80.7718];

const MapContainer = ({
  locations,
  selectedLocation,
  setSelectedLocation,
  zones,
  hotspots,
}) => {
  return (
    <LeafletMap
      center={defaultCenter}
      zoom={8}
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />

      {/* Render Zones as Polygons */}
      {zones &&
        zones.map((zone, index) => {
          const coordinates = zone.boundary.map((coord) => [
            parseFloat(coord.lat),
            parseFloat(coord.lng),
          ]);

          // Assign colors based on zone type
          const zoneColors =
            zone.zoneType === 'danger'
              ? { border: 'red', fill: 'rgba(255, 0, 0, 0.5)' } // Red for danger zones
              : { border: 'blue', fill: 'rgba(0, 0, 255, 0.3)' }; // Green for normal zones

          return (
            <Polygon
              key={index}
              positions={coordinates}
              color={zoneColors.border} // Border color
              fillColor={zoneColors.fill} // Fill color
              weight={2}
              opacity={0.5}
            >
              <Popup>
                <strong>{zone.name}</strong> <br />
                {/* Type: {zone.zoneType} */}
              </Popup>
            </Polygon>
          );
        })}

      {/* Render Vessels as Markers */}
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={MarkerIcon(location.type)}
          eventHandlers={{
            click: () => setSelectedLocation(location),
          }}
        >
          <Popup>{location.name}</Popup>
        </Marker>
      ))}

      {/* Render Fishing Hotspots as Circles */}
      {hotspots &&
        hotspots.map((hotspot) => (
          <Circle
            key={hotspot.hotspotId}
            center={[hotspot.latitude, hotspot.longitude]}
            radius={1000} // Adjust the radius as needed
            color="red"
            fillColor="red"
            fillOpacity={0.2}
            eventHandlers={{
              click: () =>
                setSelectedLocation({
                  lat: hotspot.latitude,
                  lng: hotspot.longitude,
                }),
            }}
          >
            <Popup>
              <div>
                <p>
                  <strong>Hotspot ID:</strong> {hotspot.hotspotId}
                </p>
                {/* <p>
                  <strong>Vessels:</strong> {hotspot.vesselCount}
                </p>
                <p>
                  <strong>Available Slots:</strong> {hotspot.availableSlots}
                </p> */}
                <p>
                  <strong>Last Updated:</strong>{' '}
                  {new Date(hotspot.currentDateTime).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Circle>
        ))}

      {/* Fly to selected location if exists */}
      {selectedLocation && (
        <FlyToMarker position={[selectedLocation.lat, selectedLocation.lng]} />
      )}
    </LeafletMap>
  );
};

MapContainer.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  setSelectedLocation: PropTypes.func.isRequired,
  zones: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      zoneType: PropTypes.string.isRequired,
      boundary: PropTypes.arrayOf(
        PropTypes.shape({
          lat: PropTypes.string.isRequired,
          lng: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  hotspots: PropTypes.arrayOf(
    PropTypes.shape({
      hotspotId: PropTypes.string.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      currentDateTime: PropTypes.string.isRequired,
    })
  ).isRequired,
};

MapContainer.defaultProps = {
  selectedLocation: null,
};
export default MapContainer;
