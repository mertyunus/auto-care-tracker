import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UploadCloud, File, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useRecords } from '../hooks/useRecords';
import { useVehicles } from '../hooks/useVehicles';
import { useDropzone } from 'react-dropzone';
import { Timestamp } from 'firebase/firestore';

const recordSchema = z.object({
  date: z.string().min(1, 'Tarih zorunludur'),
  mileage: z.number().min(0, 'Kilometre 0 veya daha büyük olmalıdır'),
  category: z.string().min(1, 'Kategori seçimi zorunludur'),
  description: z.string().optional(),
  laborCost: z.number().min(0).default(0),
  partCost: z.number().min(0).default(0),
  serviceProvider: z.string().optional(),
  serviceType: z.string().min(1, 'Servis tipi seçimi zorunludur'),
});

export default function AddRecordModal({ isOpen, onClose, vehicleId, currentMileage }) {
  const { addRecord } = useRecords(vehicleId);
  const { updateVehicle } = useVehicles();
  const [files, setFiles] = useState([]);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      mileage: currentMileage || 0,
      laborCost: 0,
      partCost: 0,
      category: 'Periyodik Bakım',
      serviceType: 'Özel Servis'
    }
  });

  const laborCost = watch('laborCost');
  const partCost = watch('partCost');
  const totalCost = (Number(laborCost) || 0) + (Number(partCost) || 0);

  const onDrop = useCallback(acceptedFiles => {
    if (files.length + acceptedFiles.length > 5) {
      toast.error('En fazla 5 dosya yükleyebilirsiniz.');
      return;
    }
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      const recordData = {
        ...data,
        totalCost,
        date: Timestamp.fromDate(new Date(data.date))
      };
      
      await addRecord(recordData, files);
      
      // Update vehicle's current mileage if this record is higher
      if (data.mileage > currentMileage) {
        await updateVehicle(vehicleId, { currentMileage: data.mileage });
      }

      toast.success('Kayıt başarıyla eklendi');
      reset();
      setFiles([]);
      onClose();
    } catch (error) {
      toast.error('Kayıt eklenirken bir hata oluştu');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Yeni İşlem Kaydı Ekle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tarih</label>
              <input type="date" {...register('date')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kilometre</label>
              <input type="number" {...register('mileage', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
              {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <select {...register('category')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                <option value="Periyodik Bakım">Periyodik Bakım</option>
                <option value="Motor">Motor</option>
                <option value="Fren">Fren</option>
                <option value="Lastik">Lastik</option>
                <option value="Elektrik">Elektrik</option>
                <option value="Klima">Klima</option>
                <option value="Yürüyen Aksam">Yürüyen Aksam</option>
                <option value="Kaporta/Boya">Kaporta/Boya</option>
                <option value="Diğer">Diğer</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Servis Tipi</label>
              <select {...register('serviceType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                <option value="Yetkili Servis">Yetkili Servis</option>
                <option value="Özel Servis">Özel Servis</option>
                <option value="Kendim Yaptım">Kendim Yaptım</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Servis / Sağlayıcı Adı (İsteğe bağlı)</label>
            <input {...register('serviceProvider')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Açıklama / Yapılan İşlemler</label>
            <textarea {...register('description')} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700">İşçilik Tutarı (₺)</label>
              <input type="number" {...register('laborCost', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parça Tutarı (₺)</label>
              <input type="number" {...register('partCost', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Toplam Tutar</label>
              <div className="mt-1 block w-full rounded-md bg-gray-100 sm:text-sm p-2 border font-bold text-gray-900 text-right">
                {totalCost.toLocaleString('tr-TR')} ₺
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fotoğraflar / Belgeler (Max 5)</label>
            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Dosyaları buraya sürükleyin veya seçmek için tıklayın.</p>
            </div>
            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-100">
                    <div className="flex items-center">
                      <File className="w-4 h-4 mr-2" />
                      <span className="truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                    </div>
                    <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              İptal
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
