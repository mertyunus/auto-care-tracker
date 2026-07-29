import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehicles } from '../hooks/useVehicles';
import { useRecords } from '../hooks/useRecords';
import { useReminders } from '../hooks/useReminders';
import AddRecordModal from '../components/AddRecordModal';
import AddReminderModal from '../components/AddReminderModal';
import RecordDetailModal from '../components/RecordDetailModal';
import { generateVehiclePDF } from '../utils/pdfGenerator';
import { Car, Wrench, PieChart, Bell, ArrowLeft, Download, Image as ImageIcon, CheckCircle, Circle } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658', '#d0ed57', '#a4de6c'];

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, loading: vehicleLoading } = useVehicles();
  const { records, loading: recordsLoading } = useRecords(id);
  const { reminders, loading: remindersLoading, markCompleted } = useReminders(id);
  const [activeTab, setActiveTab] = useState('records');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const vehicle = vehicles.find(v => v.id === id);

  const costData = useMemo(() => {
    if (!records) return [];
    const categoryTotals = {};
    records.forEach(record => {
      categoryTotals[record.category] = (categoryTotals[record.category] || 0) + (record.totalCost || 0);
    });
    return Object.keys(categoryTotals)
      .filter(key => categoryTotals[key] > 0)
      .map(key => ({ name: key, value: categoryTotals[key] }));
  }, [records]);

  if (vehicleLoading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Araç bulunamadı.</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">Ana sayfaya dön</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate('/')} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h1>
          <p className="text-sm text-gray-500">{vehicle.plate} • {vehicle.currentMileage?.toLocaleString('tr-TR')} km</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('records')}
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Wrench className="w-5 h-5 mx-auto mb-1" />
              İşlem Geçmişi
            </button>
            <button
              onClick={() => setActiveTab('costs')}
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'costs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PieChart className="w-5 h-5 mx-auto mb-1" />
              Masraf Özeti
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reminders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell className="w-5 h-5 mx-auto mb-1" />
              Hatırlatmalar
            </button>
          </nav>
        </div>
        
        <div className="p-4 sm:p-6">
          {activeTab === 'records' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Servis ve İşlem Kayıtları</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => generateVehiclePDF(vehicle, records, costData)}
                    className="flex items-center text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">PDF İndir</span>
                  </button>
                  <button
                    onClick={() => setIsRecordModalOpen(true)}
                    className="flex items-center text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Yeni Kayıt
                  </button>
                </div>
              </div>

              {recordsLoading ? (
                <div className="py-8 text-center"><div className="animate-spin inline-block rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
              ) : records.length === 0 ? (
                <div className="text-center py-12">
                  <Wrench className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz kayıt yok</h3>
                  <p className="mt-1 text-sm text-gray-500">Bu araca ait hiçbir işlem kaydı bulunamadı.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {records.map(record => (
                    <div 
                      key={record.id} 
                      onClick={() => setSelectedRecord(record)}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                              {record.category}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {record.date?.toDate().toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{record.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                            <span className="flex items-center"><Car className="w-4 h-4 mr-1"/> {record.mileage?.toLocaleString('tr-TR')} km</span>
                            {record.serviceProvider && <span>Servis: {record.serviceProvider}</span>}
                            {record.photos?.length > 0 && (
                              <span className="flex items-center"><ImageIcon className="w-4 h-4 mr-1 text-blue-500" /> {record.photos.length} Fotoğraf</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 text-right">
                          <div className="text-lg font-bold text-gray-900">{record.totalCost?.toLocaleString('tr-TR')} ₺</div>
                          <div className="text-xs text-gray-500">İşçilik: {record.laborCost} ₺ | Parça: {record.partCost} ₺</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'costs' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Masraf Dağılımı</h2>
              {costData.length === 0 ? (
                <div className="text-center py-12">
                  <PieChart className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Görüntülenecek masraf verisi yok.</p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={costData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {costData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString('tr-TR')} ₺`} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reminders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Hatırlatmalar</h2>
                <button
                  onClick={() => setIsReminderModalOpen(true)}
                  className="flex items-center text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yeni Hatırlatma
                </button>
              </div>
              
              {remindersLoading ? (
                <div className="py-8 text-center"><div className="animate-spin inline-block rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
              ) : reminders.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Kayıtlı bir hatırlatma bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reminders.map(reminder => (
                    <div key={reminder.id} className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${reminder.isCompleted ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-blue-100 hover:border-blue-300'}`}>
                      <div className="flex items-center">
                        <button onClick={() => markCompleted(reminder.id, !reminder.isCompleted)} className="mr-4 text-blue-600 hover:text-blue-800 focus:outline-none">
                          {reminder.isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                        </button>
                        <div>
                          <h4 className={`text-md font-bold ${reminder.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{reminder.title}</h4>
                          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-3">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{reminder.type}</span>
                            <span>{reminder.dueDate?.toDate().toLocaleDateString('tr-TR')}</span>
                            {reminder.dueMileage && <span>{reminder.dueMileage.toLocaleString('tr-TR')} km</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AddRecordModal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} vehicleId={id} currentMileage={vehicle.currentMileage} />
      <AddReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} vehicleId={id} />
      <RecordDetailModal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} record={selectedRecord} />
    </div>
  );
}
