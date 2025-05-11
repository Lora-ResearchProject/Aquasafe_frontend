import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { vi } from 'vitest';
import App from '../src/App';

vi.mock('../src/Components/auth/ProtectedRoute', () => ({
  default: ({ children }) => children,
}));
vi.mock('../src/Components/auth/PublicRoute', () => ({
  default: ({ children }) => children,
}));

describe('App Routing', () => {
  it('renders login page on / route', () => {
    render(
      <StrictMode>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </StrictMode>
    );

    expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
  });

  it('renders forgot password page on /forgot-password route', () => {
    render(
      <StrictMode>
        <MemoryRouter initialEntries={['/forgot-password']}>
          <App />
        </MemoryRouter>
      </StrictMode>
    );

    expect(screen.getByText(/Forgot Your Password\?/i)).toBeInTheDocument();
  });

  it('renders admin dashboard page on /admin-dashboard route', () => {
    render(
      <StrictMode>
        <MemoryRouter initialEntries={['/admin-dashboard']}>
          <App />
        </MemoryRouter>
      </StrictMode>
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
});
