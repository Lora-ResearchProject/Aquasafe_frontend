import { useState, useEffect } from 'react';
import Section_01 from '../Components/dashboard/Section_01';
import Section_02 from '../Components/dashboard/Section_02';
import Section_03 from '../Components/dashboard/Section_03';
import Section_04 from '../Components/dashboard/Section_04';

import {
  fetchLatestVesselLocations,
  fetchVessels,
} from '../services/locationService';
import { fetchSOSData } from '../services/sosService';
import { fetchLatestChats } from '../services/chatService';
import { fetchGateways } from '../services/gatewayService';
import { listenEvent, removeListener } from '../services/socket';

const MAX_Active_ALERTS = 4;
const MAX_LATEST_CHATS = 4;
const MAX_LATEST_VESSEL_LOCATIONS = 4;

const Dashboard = () => {
  const [vesselData, setVesselData] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [latestChats, setLatestChats] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [vesselLocations, setVesselLocations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    vessels: null,
    sos: null,
    chats: null,
    gateways: null,
    locations: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const results = await Promise.allSettled([
        fetchVessels(),
        fetchSOSData(),
        fetchLatestChats(),
        fetchGateways(),
        fetchLatestVesselLocations(),
      ]);

      setLoading(false);

      // Process vessel data first (needed for lookup dictionary)
      let vesselMap = {};
      if (results[0].status === 'fulfilled') {
        const vessels = results[0].value;
        setVesselData(vessels);
        vesselMap = vessels.reduce((acc, vessel) => {
          acc[vessel.vesselId] = vessel.vesselName;
          return acc;
        }, {});
      } else {
        setErrors((prev) => ({ ...prev, vessels: results[0].reason.message }));
      }

      // Process SOS alerts with vessel name lookup
      if (results[1].status === 'fulfilled') {
        const sosData = results[1].value
          .filter((sos) => sos.sosStatus === 'active')
          .map((sos) => ({
            ...sos,
            vesselName: vesselMap[sos.vesselId] || 'Unknown Vessel',
          }))
          .reverse();

        setSosAlerts(sosData);
      } else {
        setErrors((prev) => ({ ...prev, sos: results[1].reason.message }));
      }

      // Process latest chats with vessel name lookup
      if (results[2].status === 'fulfilled') {
        const chatData = results[2].value.map((chat) => ({
          ...chat,
          vesselName: vesselMap[chat.vesselId] || 'Unknown Vessel',
        }));

        setLatestChats(chatData);
      } else {
        setErrors((prev) => ({ ...prev, chats: results[2].reason.message }));
      }

      // Process active gateways
      if (results[3].status === 'fulfilled') {
        const gateways = results[3].value;
        setGateways(gateways);
      } else {
        setErrors((prev) => ({ ...prev, gateways: results[3].reason.message }));
      }

      // Process vessel locations with vessel name lookup
      if (results[4].status === 'fulfilled') {
        const locationData = results[4].value.map((location) => ({
          ...location,
          vesselName: vesselMap[location.vesselId] || 'Unknown Vessel',
        }));

        setVesselLocations(locationData);
      } else {
        setErrors((prev) => ({
          ...prev,
          locations: results[4].reason.message,
        }));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Listen for real-time SOS updates
    listenEvent('sos_created', (newSOS) => {
      setSosAlerts((prev) => [
        {
          ...newSOS,
          vesselName:
            vesselData.find((v) => v.vesselId === newSOS.vesselId)
              ?.vesselName || 'Unknown Vessel',
        },
        ...prev,
      ]);
    });

    // Listen for new chat events and fetch the latest chats
    listenEvent('new_chat', async () => {
      try {
        const chatData = await fetchLatestChats();
        setLatestChats(
          chatData.map((chat) => ({
            ...chat,
            vesselName:
              vesselData.find((v) => v.vesselId === chat.vesselId)
                ?.vesselName || 'Unknown Vessel',
          }))
        );
      } catch (error) {
        console.error('Error fetching latest chats:', error);
      }
    });

    // Cleanup WebSocket listeners when component unmounts
    return () => {
      removeListener('sos_created');
      removeListener('new_chat');
    };
  }, [vesselData]); // Re-run effect when vesselData updates

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-8 p-6 h-full">
      <Section_01
        vesselCount={vesselData.length}
        chatCount={latestChats.length}
        gatwayData={gateways}
        loading={loading}
        error={errors.gateways}
      />
      <Section_02
        vesselData={vesselLocations.slice(0, MAX_LATEST_VESSEL_LOCATIONS)}
        vesselCount={vesselLocations.length}
        loading={loading}
        error={errors.locations}
      />

      <Section_03
        sosData={sosAlerts.slice(0, MAX_Active_ALERTS)}
        sosCount={sosAlerts.length}
        loading={loading}
        error={errors.sos}
      />
      <Section_04
        chatData={latestChats.slice(0, MAX_LATEST_CHATS)}
        chatCount={latestChats.length}
        loading={loading}
        error={errors.chats}
      />
    </div>
  );
};

export default Dashboard;
