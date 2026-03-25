import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Location, Item } from './types';

const STORAGE_KEY = 'trastero_inventory_v1';

export function useInventory() {
  const [locations, setLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  }, [locations]);

  const addLocation = (name: string, description: string = '') => {
    const newLoc: Location = { id: uuidv4(), name, description, items: [] };
    setLocations([...locations, newLoc]);
    return newLoc;
  };

  const updateLocation = (id: string, updates: Partial<Location>) => {
    setLocations(locations.map(loc => loc.id === id ? { ...loc, ...updates } : loc));
  };

  const deleteLocation = (id: string) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  const addItem = (locationId: string, name: string, quantity: number = 1, description: string = '') => {
    setLocations(locations.map(loc => {
      if (loc.id === locationId) {
        return {
          ...loc,
          items: [...loc.items, { id: uuidv4(), name, quantity, description }]
        };
      }
      return loc;
    }));
  };

  const updateItem = (locationId: string, itemId: string, updates: Partial<Item>) => {
    setLocations(locations.map(loc => {
      if (loc.id === locationId) {
        return {
          ...loc,
          items: loc.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
        };
      }
      return loc;
    }));
  };

  const deleteItem = (locationId: string, itemId: string) => {
    setLocations(locations.map(loc => {
      if (loc.id === locationId) {
        return {
          ...loc,
          items: loc.items.filter(item => item.id !== itemId)
        };
      }
      return loc;
    }));
  };

  return {
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    addItem,
    updateItem,
    deleteItem
  };
}
