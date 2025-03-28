import { useMap } from 'react-leaflet';
import PropTypes from 'prop-types';

const FlyToMarker = ({ position }) => {
  const map = useMap();
  if (position) {
    map.flyTo(position, 10, { duration: 1.5 });
  }
  return null;
};

FlyToMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default FlyToMarker;
