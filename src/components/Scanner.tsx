import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, AlertCircle } from 'lucide-react';

export function Scanner({ onScan }: { onScan: (data: string) => void }) {
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (scannerRef.current?.isScanning) {
              scanner.stop().then(() => onScan(decodedText)).catch(console.error);
            }
          },
          () => {
            // Ignore normal scanning errors
          }
        );
        setIsScanning(true);
      } catch (err) {
        console.error(err);
        setError("No se pudo acceder a la cámara. Asegúrate de dar permisos.");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <Camera className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Escanear Código</h2>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 p-4 mb-4 text-red-700 bg-red-100 rounded-lg w-full">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="w-full overflow-hidden rounded-2xl shadow-lg bg-gray-100 border-4 border-white relative">
        <div id="reader" className="w-full min-h-[300px]"></div>
        {!isScanning && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-gray-500 animate-pulse">Iniciando cámara...</p>
          </div>
        )}
      </div>
      
      <p className="mt-6 text-sm text-gray-500 text-center px-4">
        Apunta la cámara al código QR de la caja o estantería para ver su contenido.
      </p>
    </div>
  );
}
