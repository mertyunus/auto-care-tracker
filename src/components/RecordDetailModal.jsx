import React from 'react';
import { X, Image as ImageIcon, Calendar, Wrench, Download, Car, Info } from 'lucide-react';

export default function RecordDetailModal({ isOpen, onClose, record }) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">İşlem Detayı</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Tarih</p>
                  <p className="font-medium">{record.date?.toDate().toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Car className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Kilometre</p>
                  <p className="font-medium">{record.mileage?.toLocaleString('tr-TR')} km</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Wrench className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Kategori & Servis Tipi</p>
                  <p className="font-medium">{record.category} - {record.serviceType}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col justify-center">
              <p className="text-sm text-gray-500 mb-1">Maliyet Özeti</p>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-gray-600">İşçilik:</span>
                <span className="font-medium">{record.laborCost?.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex justify-between items-end mb-2 border-b border-gray-200 pb-2">
                <span className="text-sm text-gray-600">Parça:</span>
                <span className="font-medium">{record.partCost?.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex justify-between items-end mt-2">
                <span className="font-bold text-gray-900">Toplam:</span>
                <span className="text-xl font-bold text-blue-600">{record.totalCost?.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-start text-gray-700">
              <Info className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Açıklama / Yapılan İşlemler</p>
                <p className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">{record.description || 'Açıklama girilmemiş.'}</p>
              </div>
            </div>
            {record.serviceProvider && (
              <p className="mt-3 text-sm text-gray-600 ml-8">
                <span className="font-medium">Servis Sağlayıcı:</span> {record.serviceProvider}
              </p>
            )}
          </div>

          {record.photos && record.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center mb-3">
                <ImageIcon className="w-4 h-4 mr-2" />
                Eklenen Dosyalar ve Fotoğraflar
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {record.photos.map((photo, index) => (
                  <div key={index} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img src={photo} alt={`Kayıt ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a href={photo} target="_blank" rel="noreferrer" className="bg-white/90 p-2 rounded-full text-gray-900 hover:text-blue-600 transition-colors" title="Büyük Halini Gör / İndir">
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
