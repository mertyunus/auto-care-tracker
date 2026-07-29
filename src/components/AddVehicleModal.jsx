import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useVehicles } from '../hooks/useVehicles';

const vehicleSchema = z.object({
  brand: z.string().min(1, 'Marka zorunludur'),
  model: z.string().min(1, 'Model zorunludur'),
  year: z.number().min(1900, 'Geçerli bir yıl girin').max(new Date().getFullYear() + 1),
  plate: z.string().min(1, 'Plaka zorunludur'),
  fuelType: z.enum(['benzin', 'dizel', 'lpg', 'elektrik', 'hibrit']),
  nickname: z.string().optional(),
  currentMileage: z.number().min(0, 'Kilometre 0 veya daha büyük olmalıdır')
});

export default function AddVehicleModal({ isOpen, onClose }) {
  const { addVehicle } = useVehicles();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(vehicleSchema)
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      await addVehicle(data);
      toast.success('Araç başarıyla eklendi');
      reset();
      onClose();
    } catch (error) {
      toast.error('Araç eklenirken bir hata oluştu');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Yeni Araç Ekle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Marka</label>
              <input {...register('brand')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Model</label>
              <input {...register('model')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
              {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Yıl</label>
              <input type="number" {...register('year', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plaka</label>
              <input {...register('plate')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
              {errors.plate && <p className="text-red-500 text-xs mt-1">{errors.plate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Yakıt Tipi</label>
              <select {...register('fuelType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                <option value="benzin">Benzin</option>
                <option value="dizel">Dizel</option>
                <option value="lpg">LPG</option>
                <option value="elektrik">Elektrik</option>
                <option value="hibrit">Hibrit</option>
              </select>
              {errors.fuelType && <p className="text-red-500 text-xs mt-1">{errors.fuelType.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Güncel Kilometre</label>
              <input type="number" {...register('currentMileage', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
              {errors.currentMileage && <p className="text-red-500 text-xs mt-1">{errors.currentMileage.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Takma Ad (İsteğe bağlı)</label>
            <input {...register('nickname')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="Örn: Mavişim" />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              İptal
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              {isSubmitting ? 'Ekleniyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
