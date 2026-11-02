// Custom React hook — fetches properties from Firestore in real-time
import { useState, useEffect } from 'react';
import { subscribeProperties, getAllProperties } from '../firebase/propertyService';

export function useProperties(filters = {}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    setLoading(true);
    // Real-time listener
    const unsubscribe = subscribeProperties(
      (data) => {
        setProperties(data);
        setLoading(false);
      },
      filters
    );
    return () => unsubscribe(); // Cleanup on unmount
  }, [filters.category, filters.type]);

  return { properties, loading, error };
}

// Hook for featured properties only
export function useFeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeProperties(
      (data) => {
        setProperties(data.filter((p) => p.featured));
        setLoading(false);
      },
      {}
    );
    return () => unsubscribe();
  }, []);

  return { properties, loading };
}

