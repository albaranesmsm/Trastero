import React, { useState } from 'react';
import { ArrowLeft, Plus, PackageOpen, Edit2, Trash2, Save, X } from 'lucide-react';
import { Location, Item } from '../types';

interface LocationDetailProps {
  location: Location;
  onBack: () => void;
  onAddItem: (locId: string, name: string, qty: number, desc: string) => void;
  onUpdateItem: (locId: string, itemId: string, updates: Partial<Item>) => void;
  onDeleteItem: (locId: string, itemId: string) => void;
}

export function LocationDetail({ location, onBack, onAddItem, onUpdateItem, onDeleteItem }: LocationDetailProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [itemDesc, setItemDesc] = useState('');

  const resetForm = () => {
    setItemName('');
    setItemQty(1);
    setItemDesc('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (item: Item) => {
    setItemName(item.name);
    setItemQty(item.quantity);
    setItemDesc(item.description || '');
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    if (editingId) {
      onUpdateItem(location.id, editingId, {
        name: itemName.trim(),
        quantity: itemQty,
        description: itemDesc.trim()
      });
    } else {
      onAddItem(location.id, itemName.trim(), itemQty, itemDesc.trim());
    }
    resetForm();
  };

  return (
    <div className="p-4 max-w-md mx-auto w-full pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{location.name}</h1>
          {location.description && <p className="text-sm text-gray-500">{location.description}</p>}
        </div>
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3 mb-6 bg-blue-50 text-blue-700 font-medium rounded-xl border border-blue-200 flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Añadir Artículo
        </button>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 mb-6">
          <h2 className="text-lg font-semibold mb-3">{editingId ? 'Editar Artículo' : 'Nuevo Artículo'}</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                autoFocus
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setItemQty(Math.max(1, itemQty - 1))} className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-medium">-</button>
                <input
                  type="number"
                  min="1"
                  value={itemQty}
                  onChange={(e) => setItemQty(parseInt(e.target.value) || 1)}
                  className="w-20 p-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button type="button" onClick={() => setItemQty(itemQty + 1)} className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-medium">+</button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Descripción (opcional)</label>
              <input
                type="text"
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
            <button
              type="submit"
              disabled={!itemName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
            >
              <Save className="w-4 h-4" /> Guardar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {location.items.length === 0 && !isAdding ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <PackageOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Esta ubicación está vacía.</p>
          </div>
        ) : (
          location.items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-md min-w-[2rem] text-center">
                    {item.quantity}x
                  </span>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                </div>
                {item.description && <p className="text-sm text-gray-500 mt-1 ml-10">{item.description}</p>}
              </div>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar este artículo?')) {
                      onDeleteItem(location.id, item.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
