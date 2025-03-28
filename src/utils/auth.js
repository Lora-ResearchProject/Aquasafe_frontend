import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem('authToken');

export const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Decode the token and check its expiration
export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token); // Decode the token to get expiration time
    if (Date.now() >= exp * 1000) {
      return true; // Token is expired
    }
    return false; // Token is still valid
  } catch (error) {
    console.error(error);
    return true; // If decoding fails, treat as expired
  }
};

// Modified isAuthenticated function to check expiration
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
};

// Get user role from token
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const { role } = jwtDecode(token); // Decode the token to get the role
    return role;
  } catch (error) {
    console.error(error);
    return null;
  }
};
