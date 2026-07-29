import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useVehicles } from '../hooks/useVehicles';
import AddVehicleModal from '../components/AddVehicleModal';
import { Car, Plus, ChevronRight, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { vehicles, loading } = useVehicles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, {currentUser.displayName || 'Sürücü'}</h1>
          <p className="text-gray-500 text-sm mt-1">Araçlarınızı ve durumlarını buradan yönetebilirsiniz.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 sm:mr-2" />
          <span className="hidden sm:inline">Yeni Araç Ekle</span>
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <Car className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Henüz hiç araç eklemediniz</h3>
          <p className="mt-2 text-gray-500">Kayıtlarınızı tutmaya başlamak için ilk aracınızı ekleyin.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Araç Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div 
              key={vehicle.id} 
              onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer overflow-hidden group"
            >
              <div className="h-32 bg-gray-200 flex items-center justify-center relative">
                {vehicle.imageUrl ? (
                  <img src={vehicle.imageUrl} alt={vehicle.model} className="w-full h-full object-cover" />
                ) : (
                  <Car className="w-16 h-16 text-gray-400" />
                )}
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs font-bold text-gray-700 uppercase">
                  {vehicle.plate}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {vehicle.year} {vehicle.nickname && `• ${vehicle.nickname}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4 mt-2">
                  <div className="text-gray-600">
                    <span className="font-medium text-gray-900">{vehicle.currentMileage?.toLocaleString('tr-TR')}</span> km
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddVehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
