import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../src/Pages/Login';
import * as authService from '../src/services/authService';
import * as authUtils from '../src/utils/auth';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock login and getUserRole
vi.mock('../src/services/authService', () => ({
  login: vi.fn(),
}));
vi.mock('../src/utils/auth', () => ({
  getUserRole: vi.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<Login />, { wrapper: MemoryRouter });
    expect(screen.getByPlaceholderText(/Email/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('navigates to dashboard on successful login as user', async () => {
    authService.login.mockResolvedValueOnce({});
    authUtils.getUserRole.mockReturnValueOnce('user');

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/Email/), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        'user@example.com',
        'password123'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
        replace: true,
      });
    });
  });

  it('navigates to admin dashboard on successful login as admin', async () => {
    authService.login.mockResolvedValueOnce({});
    authUtils.getUserRole.mockReturnValueOnce('admin');

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/Email/), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/), {
      target: { value: 'adminpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard', {
        replace: true,
      });
    });
  });

  it('displays error message on failed login', async () => {
    authService.login.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/Email/), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/)).toBeInTheDocument();
    });
  });
});
