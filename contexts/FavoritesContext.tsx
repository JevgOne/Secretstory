"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: number[];
  addFavorite: (girlId: number) => void;
  removeFavorite: (girlId: number) => void;
  isFavorite: (girlId: number) => boolean;
  toggleFavorite: (girlId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch (e) {
          console.error('Error loading favorites:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = (girlId: number) => {
    setFavorites(prev => {
      if (!prev.includes(girlId)) {
        return [...prev, girlId];
      }
      return prev;
    });
  };

  const removeFavorite = (girlId: number) => {
    setFavorites(prev => prev.filter(id => id !== girlId));
  };

  const isFavorite = (girlId: number) => {
    return favorites.includes(girlId);
  };

  const toggleFavorite = (girlId: number) => {
    if (isFavorite(girlId)) {
      removeFavorite(girlId);
    } else {
      addFavorite(girlId);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
