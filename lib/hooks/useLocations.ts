import { useState, useEffect } from 'react';

export interface Location {
  id: number;
  name: string;
  display_name: string;
  address?: string;
  postal_code?: string;
  city: string;
  district?: string;
  coordinates?: string;
  phone?: string;
  email?: string;
  description?: string;
  opening_hours?: string;
  is_active: number;
  is_primary: number;
  created_at: string;
  updated_at: string;
}

export function useLocations(activeOnly: boolean = true) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, [activeOnly]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const url = activeOnly
        ? '/api/admin/locations?active=true'
        : '/api/admin/locations';

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setLocations(data.locations);
        setError(null);
      } else {
        setError(data.error || 'Chyba při načítání poboček');
      }
    } catch (err: any) {
      setError(err.message || 'Chyba při načítání poboček');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get primary location
  const primaryLocation = locations.find(loc => loc.is_primary === 1);

  // Get location names only
  const locationNames = locations.map(loc => loc.display_name);

  // Get location by name
  const getLocationByName = (name: string) => {
    return locations.find(loc =>
      loc.name === name || loc.display_name === name
    );
  };

  return {
    locations,
    loading,
    error,
    primaryLocation,
    locationNames,
    getLocationByName,
    refetch: fetchLocations
  };
}
