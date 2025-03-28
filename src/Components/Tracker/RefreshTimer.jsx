import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const RefreshTimer = ({ refreshInterval, lastRefreshed, refreshTrigger }) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(
      0,
      Math.ceil((lastRefreshed + refreshInterval - Date.now()) / 1000)
    )
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(
        Math.max(
          0,
          Math.ceil((lastRefreshed + refreshInterval - Date.now()) / 1000)
        )
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [lastRefreshed, refreshTrigger, refreshInterval]);

  return (
    <div className="text-sm text-gray-600">
      Refreshing in: <strong>{timeLeft}s</strong>
    </div>
  );
};

RefreshTimer.propTypes = {
  refreshInterval: PropTypes.number.isRequired,
  lastRefreshed: PropTypes.number.isRequired,
  refreshTrigger: PropTypes.any.isRequired, // The trigger to re-run the effect (e.g., a boolean or any value)
};

export default RefreshTimer;
