import React, { useState } from 'react';
import { Plus, Package, ChevronRight, Trash2 } from 'lucide-react';
import { Location } from '../types';

interface HomeProps {
  locations: Location[];
  onAddLocation: (name: string, description: string) => void;
  onSelectLocation: (id: string) => void;
  onDeleteLocation: (id: string) => void;
}

export function Home({ locations, onAddLocation, onSelectLocation, onDeleteLocation }: HomeProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddLocation(newName.trim(), newDesc.trim());
      setNewName('');
      setNewDesc('');
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto w-full pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mi Trastero</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-3">Nueva Ubicación</h2>
          <input
            type="text"
            placeholder="Nombre (ej. Caja 1, Estantería A)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
            autoFocus
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!newName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {locations.length === 0 && !isAdding ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aún no tienes ubicaciones.</p>
            <p className="text-sm text-gray-400 mt-1">Añade una caja o estantería para empezar.</p>
          </div>
        ) : (
          locations.map(loc => (
            <div
              key={loc.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => onSelectLocation(loc.id)}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{loc.name}</h3>
                {loc.description && <p className="text-sm text-gray-500">{loc.description}</p>}
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  {loc.items.length} {loc.items.length === 1 ? 'artículo' : 'artículos'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('¿Estás seguro de eliminar esta ubicación y todo su contenido?')) {
                      onDeleteLocation(loc.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
