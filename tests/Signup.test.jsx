import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { vi } from 'vitest';
import Signup from '../src/Pages/SignupPage';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock axios
vi.mock('axios');

describe('Signup Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the signup form', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    expect(
      screen.getByRole('heading', { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it('shows error if fields are empty', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(
      await screen.findByText(/please fill in all fields/i)
    ).toBeInTheDocument();
  });

  it('submits form successfully and navigates to login', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/register'),
        {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        }
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message if signup fails', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'User already exists' } },
    });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/user already exists/i)).toBeInTheDocument();
  });
});
