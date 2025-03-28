import { baseURL } from '../config/config';

const API_BASE_URL = baseURL + '/api/gateway';

export const fetchGateways = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error('Failed to fetch gateways');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching gateways:', error);
    throw error;
  }
};

export const createGateway = async (gatewayData) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gatewayData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create gateway');
  }
  return response.json();
};

export const updateGateway = async (id, gatewayData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gatewayData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update gateway');
  }
  return response.json();
};

export const deleteGateway = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete gateway');
  }
  return true;
};
