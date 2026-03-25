import { useState } from 'react';
import { useInventory } from './store';
import { BottomNav } from './components/BottomNav';
import { Home } from './components/Home';
import { Scanner } from './components/Scanner';
import { LocationDetail } from './components/LocationDetail';
import { InventoryList } from './components/InventoryList';
import { PrintView } from './components/PrintView';

type Tab = 'home' | 'scanner' | 'list' | 'print';

export default function App() {
  const {
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    addItem,
    updateItem,
    deleteItem
  } = useInventory();

  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const handleScan = (data: string) => {
    const loc = locations.find(l => l.id === data);
    if (loc) {
      setSelectedLocationId(data);
      setCurrentTab('home');
    } else {
      alert('Código no reconocido o ubicación eliminada.');
    }
  };

  const selectedLocation = selectedLocationId ? locations.find(l => l.id === selectedLocationId) : null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <main className="w-full h-full overflow-y-auto">
        {currentTab === 'home' && !selectedLocation && (
          <Home
            locations={locations}
            onAddLocation={addLocation}
            onSelectLocation={setSelectedLocationId}
            onDeleteLocation={deleteLocation}
          />
        )}

        {currentTab === 'home' && selectedLocation && (
          <LocationDetail
            location={selectedLocation}
            onBack={() => setSelectedLocationId(null)}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
          />
        )}

        {currentTab === 'scanner' && (
          <div className="pt-8">
            <Scanner onScan={handleScan} />
          </div>
        )}

        {currentTab === 'list' && (
          <InventoryList
            locations={locations}
            onSelectLocation={(id) => {
              setSelectedLocationId(id);
              setCurrentTab('home');
            }}
          />
        )}

        {currentTab === 'print' && (
          <PrintView locations={locations} />
        )}
      </main>

      <BottomNav
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'home') {
            setSelectedLocationId(null);
          }
        }}
      />
    </div>
  );
}
