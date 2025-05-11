import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import ResetPasswordPage from '../src/Pages/ResetPasswordPage';
import { resetPassword } from '../src/services/authService';

// Mock resetPassword service
vi.mock('../src/services/authService', () => ({
  resetPassword: vi.fn(),
}));

// Mock useNavigate and Link safely inside the mock block
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  const { default: PropTypes } = await vi.importActual('prop-types');

  const Link = ({ to, children }) => <a href={to}>{children}</a>;
  Link.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  return {
    ...actual,
    useParams: () => ({ resetToken: 'dummy-token' }),
    useNavigate: () => mockNavigate,
    Link,
  };
});

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the reset password form', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/dummy-token']}>
        <Routes>
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPasswordPage />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Reset Your Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/New Password/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirm Password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Reset Password/i })
    ).toBeInTheDocument();
  });

  it('shows error if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/New Password/i), {
      target: { value: 'abc123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: 'different123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    expect(
      await screen.findByText(/Passwords do not match/i)
    ).toBeInTheDocument();
  });

  it('shows success message and navigates after reset', async () => {
    resetPassword.mockResolvedValue({ message: 'Password reset successful!' });

    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/New Password/i), {
      target: { value: 'abc123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: 'abc123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Password reset successful/i)
      ).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      },
      { timeout: 6000 }
    );
  }, 7000);

  it('shows error message if reset fails', async () => {
    resetPassword.mockRejectedValue({ message: 'Reset failed. Try again.' });

    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/New Password/i), {
      target: { value: 'abc123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: 'abc123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    expect(await screen.findByText(/Reset failed/i)).toBeInTheDocument();
  });
});
