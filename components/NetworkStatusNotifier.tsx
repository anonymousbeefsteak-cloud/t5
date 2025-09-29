// FIX: Import React to use React.FC type.
import React, { useEffect } from 'react';
import useNetworkStatus from '../hooks/useNetworkStatus';
import { useToast } from '../hooks/useToast';

const NetworkStatusNotifier: React.FC = () => {
  const isOnline = useNetworkStatus();
  const { addToast } = useToast();

  useEffect(() => {
    if (!isOnline) {
      addToast("You are offline. Please check your connection.", 'error', 0); // Persist until online
    } else {
      // You might want to clear the offline message if you have a way to identify it
      // For now, let's show a "back online" message
      // Note: this will show on initial load as well.
      // addToast("You are back online!", 'success');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]); // addToast is stable and not needed in deps

  return null; // This component does not render anything
};

export default NetworkStatusNotifier;