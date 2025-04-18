import React from 'react';
import PropTypes from 'prop-types';
import icon from '../../assets/icons/chatdp.png';
import MessagePopup from './MessagePopup';

const VesselList = ({
  vessels,
  latestChats,
  error,
  loading,
  onSelect,
  onNewChatClick,
}) => {
  const vesselsWithChats = vessels.map((vessel) => {
    const hasChat = latestChats.some(
      (chat) => chat.vesselId === vessel.vesselId
    );
    const latestChat = latestChats.find(
      (chat) => chat.vesselId === vessel.vesselId
    );
    return { ...vessel, hasChat, latestChat };
  });

  // Parse date and time from a timestamp
  const parseDateTime = (dateTime) => {
    if (!dateTime) return { date: '', time: '' };
    const dateObj = new Date(dateTime);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    return { date, time };
  };

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={onNewChatClick}
        >
          New Chat
        </button>
        <MessagePopup />
      </div>
      {/* Loading Spinner */}
      {loading && (
        <div className="flex flex-col items-center mt-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-700">Chats loading, please wait...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-center mt-20">
          Failed to load chats. Please try again.
        </div>
      )}

      {/* No Messages */}
      {!loading && !error && vessels.length === 0 && (
        <p className="text-gray-500 text-center mt-20">
          No messages available.
        </p>
      )}

      {!loading && !error && vessels.length > 0 && (
        <ul>
          {vesselsWithChats.map((vessel) => {
            const { date, time } = parseDateTime(vessel.latestChat?.dateTime);
            return (
              <li
                key={vessel.vesselId}
                className="bg-white p-3 rounded-lg mb-2 shadow-md flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(vessel)}
              >
                {/* Profile Image */}
                <img
                  src={icon}
                  alt="Chat"
                  className="w-12 h-12 rounded-full mr-4"
                />

                {/* Vessel Details */}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-blue-600">
                    {vessel.vesselName}
                  </h2>
                  {vessel.hasChat && (
                    <p className="text-gray-600 text-sm truncate">
                      {vessel.latestChat?.message}
                    </p>
                  )}
                </div>

                {/* Date & Time */}
                {vessel.hasChat && (
                  <div className="text-xs text-gray-500 text-end">
                    {date} <br />
                    {time}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

VesselList.propTypes = {
  vessels: PropTypes.arrayOf(
    PropTypes.shape({
      vesselId: PropTypes.string.isRequired,
      vesselName: PropTypes.string.isRequired,
    })
  ).isRequired,
  latestChats: PropTypes.arrayOf(
    PropTypes.shape({
      vesselId: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      dateTime: PropTypes.string,
    })
  ).isRequired,
  error: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onNewChatClick: PropTypes.func.isRequired,
};

export default VesselList;
