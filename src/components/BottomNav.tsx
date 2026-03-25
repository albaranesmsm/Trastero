import { Home, Camera, List, Printer } from 'lucide-react';

type Tab = 'home' | 'scanner' | 'list' | 'print';

interface BottomNavProps {
  currentTab: Tab;
  onChangeTab: (tab: Tab) => void;
}

export function BottomNav({ currentTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'scanner', icon: Camera, label: 'Escanear' },
    { id: 'list', icon: List, label: 'Inventario' },
    { id: 'print', icon: Printer, label: 'Etiquetas' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-2 sm:pb-0 print:hidden z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => onChangeTab(id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-blue-50' : ''}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
