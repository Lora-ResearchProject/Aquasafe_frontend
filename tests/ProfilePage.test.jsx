import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ProfilePage from '../src/Pages/ProfilePage';

// Mock child components
vi.mock('../src/Components/Profile/UserDetails', () => ({
  default: ({ user }) => (
    <div>
      <p>UserDetails Component</p>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
  ),
}));

vi.mock('../src/Components/Profile/ChangePassword', () => ({
  default: () => <p>ChangePassword Component</p>,
}));

// Mock service functions
vi.mock('../src/services/authService', async () => {
  return {
    fetchUserDetails: vi.fn().mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
    }),
    updateUserDetails: vi.fn(),
    changePassword: vi.fn(),
  };
});

describe('ProfilePage', () => {
  it('renders loading state initially', () => {
    render(<ProfilePage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders user details after data is fetched', async () => {
    render(<ProfilePage />);

    await waitFor(() =>
      expect(screen.getByText(/UserDetails Component/i)).toBeInTheDocument()
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('ChangePassword Component')).toBeInTheDocument();
  });
});
