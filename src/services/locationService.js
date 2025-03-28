import axios from 'axios';
import { format } from 'date-fns';
import config from '../config/config';

const V_API_URL = config.baseUrl + '/api/tracker';
const GW_API_URL = config.baseUrl + '/api/gateway';
const VESSEL_AUTH_URL = config.baseUrl + '/api/vessel-auth';
const ROUTE_LOG_URL = config.baseUrl + '/api/route-log';
const FISHING_HOTSPOTS_URL = config.baseUrl + '/api/hotspots';

// Fetch latest vessel locations with vesselName included
export const fetchLatestVesselLocations = async () => {
  try {
    // Fetch the latest vessel locations
    const locationResponse = await axios.get(`${V_API_URL}/latestLocations`);

    if (!locationResponse || locationResponse.status !== 200) {
      throw new Error('Failed to fetch vessel locations');
    }

    // Fetch vessel details
    const vessels = await fetchVessels();

    // Map vessel id to vessel name
    const vesselMap = vessels.reduce((map, vessel) => {
      map[vessel.vesselId] = vessel.vesselName;
      return map;
    }, {});

    // Combine location data with vessel names
    const locationsWithNames = locationResponse.data.map((location) => {
      return {
        ...location,
        vesselName: vesselMap[location.vesselId] || 'Unknown Vessel', // Add vesselName
      };
    });

    return locationsWithNames; // Return the data with vessel names
  } catch (error) {
    console.error('Error fetching vessel locations:', error.message);
    throw new Error(`Error fetching vessel locations: ${error.message}`);
  }
};

// Fetch gateway locations
export const fetchLatestGateWayLocations = async () => {
  try {
    const response = await axios.get(`${GW_API_URL}/`);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching gateway locations:', error);
    throw error; // Rethrow error to handle it in the component
  }
};

// Fetch all vessels
export const fetchVessels = async () => {
  try {
    const response = await axios.get(`${VESSEL_AUTH_URL}/`);
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching vessels:', error);
    return [];
  }
};

// Fetch vessel locations by vesselId and date
export const fetchVesselLocations = async (vesselId, date) => {
  try {
    // Format the date before sending the request
    const formattedDate = format(new Date(date), 'yyyy-MM-dd');

    const response = await axios.get(
      `${ROUTE_LOG_URL}/locationsByDate?vesselId=${vesselId}&date=${formattedDate}`
    );

    if (response.data.status === 'success') {
      return { message: response.data.message, data: response.data.data };
    } else {
      console.log('No data found:', response.data.message);
      return { error: response.data.message, data: [] };
    }
  } catch (error) {
    console.error('Error fetching vessel locations:', error);

    // Extract error message from response if available
    const errorMessage =
      error.response?.data?.message ||
      'Failed to fetch data. Please try again.';

    return { error: errorMessage, data: [] };
  }
};

// Fetch fishing hotspots with optional query parameters
export const fetchAllFishingHotspots = async (queryParams = {}) => {
  try {
    const response = await axios.get(`${FISHING_HOTSPOTS_URL}/`, {
      params: queryParams, // Pass query parameters to the API
    });

    if (!response || response.status !== 200) {
      throw new Error('Failed to fetch fishing hotspots');
    }

    return response.data.data; // Return only the data array
  } catch (error) {
    console.error('Error fetching fishing hotspots:', error.message);
    throw new Error(`Error fetching fishing hotspots: ${error.message}`);
  }
};
