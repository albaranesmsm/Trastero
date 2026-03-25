import { useState } from 'react';
import { Search, MapPin, Package } from 'lucide-react';
import { Location } from '../types';

interface InventoryListProps {
  locations: Location[];
  onSelectLocation: (id: string) => void;
}

export function InventoryList({ locations, onSelectLocation }: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Flatten items for searching
  const allItems = locations.flatMap(loc => 
    loc.items.map(item => ({
      ...item,
      locationId: loc.id,
      locationName: loc.name
    }))
  );

  const filteredItems = allItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.locationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-md mx-auto w-full pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Todo el Inventario</h1>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar artículos o ubicaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
        />
      </div>

      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No se encontraron resultados.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => onSelectLocation(item.locationId)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded-md">
                    {item.quantity}x
                  </span>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                </div>
              </div>
              {item.description && <p className="text-sm text-gray-500 mb-2">{item.description}</p>}
              <div className="flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-50 inline-flex px-2 py-1 rounded-md">
                <MapPin className="w-3 h-3" />
                {item.locationName}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
