import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ChatPage from '../src/Pages/ChatPage';

// Mock components
vi.mock('../src/Components/Chat/VesselList', () => ({
  default: ({ onNewChatClick }) => (
    <div>
      <p>VesselList Component</p>
      <button onClick={onNewChatClick}>New Chat</button>
    </div>
  ),
}));

vi.mock('../src/Components/Chat/ChatWindow', () => ({
  default: ({ vessel, onBack }) => (
    <div>
      <p>ChatWindow for {vessel.vesselName}</p>
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

// Mock service functions
vi.mock('../src/services/locationService', () => ({
  fetchVessels: vi.fn().mockResolvedValue([
    { vesselId: 1, vesselName: 'Vessel A' },
    { vesselId: 2, vesselName: 'Vessel B' },
  ]),
}));

vi.mock('../src/services/chatService', () => ({
  fetchLatestChats: vi
    .fn()
    .mockResolvedValue([
      { vesselId: 1, message: 'Last message from Vessel A' },
    ]),
}));

vi.mock('../src/services/socket', () => ({
  listenEvent: vi.fn(),
  removeListener: vi.fn(),
}));

describe('ChatPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders VesselList with data after loading', async () => {
    render(<ChatPage />);

    await waitFor(() => {
      expect(screen.getByText(/VesselList Component/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /New Chat/i })
      ).toBeInTheDocument();
    });
  });

  it('opens and closes new chat popup', async () => {
    render(<ChatPage />);

    // Wait for vessels to load
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Chat/i }));
    });

    // Vessel B should be available for new chat (not in latestChats)
    expect(
      screen.getByRole('heading', { name: /New Chat/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Vessel B')).toBeInTheDocument();

    // Close popup
    fireEvent.click(screen.getByText(/Cancel/i));
    await waitFor(() => {
      expect(screen.queryByText('Vessel B')).not.toBeInTheDocument();
    });
  });

  it('switches to ChatWindow when a vessel is selected', async () => {
    render(<ChatPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /New Chat/i }));
    });

    fireEvent.click(screen.getByText('Vessel B'));

    await waitFor(() => {
      expect(screen.getByText(/ChatWindow for Vessel B/i)).toBeInTheDocument();
    });

    // Go back
    fireEvent.click(screen.getByText(/Back/i));
    expect(screen.getByText(/VesselList Component/i)).toBeInTheDocument();
  });
});
