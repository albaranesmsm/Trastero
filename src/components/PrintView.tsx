import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Printer, CheckSquare, Square } from 'lucide-react';
import { Location } from '../types';

interface PrintViewProps {
  locations: Location[];
}

export function PrintView({ locations }: PrintViewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(locations.map(l => l.id)));

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const selectAll = () => setSelectedIds(new Set(locations.map(l => l.id)));
  const deselectAll = () => setSelectedIds(new Set());

  const handlePrint = () => {
    window.print();
  };

  const selectedLocations = locations.filter(loc => selectedIds.has(loc.id));

  return (
    <div className="p-4 max-w-md mx-auto w-full pb-24 print:max-w-none print:p-0 print:m-0">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Imprimir Etiquetas</h1>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 text-sm">
            <button onClick={selectAll} className="text-blue-600 hover:underline">Todos</button>
            <span className="text-gray-300">|</span>
            <button onClick={deselectAll} className="text-blue-600 hover:underline">Ninguno</button>
          </div>
          <button
            onClick={handlePrint}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            <Printer className="w-5 h-5" />
            Imprimir ({selectedIds.size})
          </button>
        </div>

        <div className="space-y-2 mb-8">
          {locations.map(loc => (
            <div 
              key={loc.id}
              onClick={() => toggleSelection(loc.id)}
              className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              {selectedIds.has(loc.id) ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
              <span className="font-medium">{loc.name}</span>
            </div>
          ))}
          {locations.length === 0 && (
            <p className="text-gray-500 text-center py-4">No hay ubicaciones para imprimir.</p>
          )}
        </div>
      </div>

      {/* Print Layout */}
      <div className="hidden print:grid print:grid-cols-3 print:gap-4 print:w-full">
        {selectedLocations.map(loc => (
          <div key={loc.id} className="border-2 border-dashed border-gray-400 p-4 flex flex-col items-center justify-center text-center break-inside-avoid">
            <h2 className="text-xl font-bold mb-2">{loc.name}</h2>
            <div className="bg-white p-2">
              <QRCode value={loc.id} size={120} />
            </div>
            <p className="text-xs text-gray-500 mt-2 font-mono">{loc.id.slice(0, 8)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
