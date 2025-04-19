import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import FishingHotspotsPage from '../src/Pages/FishingHotspotsPage';

vi.mock('react-leaflet', async () => {
  const PropTypes = (await vi.importActual('prop-types')).default;

  const MapContainer = ({ children }) => (
    <div data-testid="map">{children}</div>
  );
  const TileLayer = () => <div data-testid="tile-layer" />;
  const Marker = ({ children, position }) => (
    <div data-testid="marker">
      Marker at {position[0]}, {position[1]}
      {children}
    </div>
  );
  const Popup = ({ children }) => <div data-testid="popup">{children}</div>;

  MapContainer.propTypes = {
    children: PropTypes.node.isRequired,
  };
  Marker.propTypes = {
    position: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
  };
  Popup.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap: () => ({ flyTo: vi.fn() }),
  };
});

// Mock FlyToMarker
vi.mock('../src/Components/Map/FlyToMarker', () => ({
  __esModule: true,
  default: ({ position }) => (
    <div data-testid="fly-to-marker">Flying to {position.join(', ')}</div>
  ),
}));

vi.mock('../src/services/locationService', () => {
  const mockHotspots = [
    {
      hotspotId: 'H1',
      latitude: 7.9,
      longitude: 80.7,
      vesselCount: 5,
      availableSlots: 3,
      currentDateTime: new Date().toISOString(),
    },
    {
      hotspotId: 'H2',
      latitude: 7.5,
      longitude: 80.2,
      vesselCount: 2,
      availableSlots: 1,
      currentDateTime: new Date().toISOString(),
    },
  ];

  return {
    fetchAllFishingHotspots: vi.fn().mockResolvedValue(mockHotspots),
  };
});

describe('FishingHotspotsPage', () => {
  it('renders loading state initially', () => {
    render(<FishingHotspotsPage />);
    expect(screen.getByText(/Loading locations/i)).toBeInTheDocument();
  });

  it('renders hotspots in sidebar and map markers', async () => {
    render(<FishingHotspotsPage />);

    await waitFor(() => {
      const cards = screen
        .getAllByText(/Hotspot ID:/i)
        .filter((el) =>
          el.closest('.border')?.className.includes('cursor-pointer')
        );
      expect(cards).toHaveLength(2);
    });

    expect(screen.getAllByTestId('marker')).toHaveLength(2);
  });

  it('shows error state if fetch fails', async () => {
    const { fetchAllFishingHotspots } = await import(
      '../src/services/locationService'
    );
    fetchAllFishingHotspots.mockRejectedValueOnce(new Error('API error'));

    render(<FishingHotspotsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Error: API error/i)).toBeInTheDocument();
    });
  });
});
