import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useReminders } from '../hooks/useReminders';
import { Timestamp } from 'firebase/firestore';

const reminderSchema = z.object({
  type: z.string().min(1, 'Tip seçimi zorunludur'),
  title: z.string().min(1, 'Başlık zorunludur'),
  dueDate: z.string().min(1, 'Tarih zorunludur'),
  dueMileage: z.number().optional(),
  notes: z.string().optional()
});

export default function AddReminderModal({ isOpen, onClose, vehicleId }) {
  const { addReminder } = useReminders(vehicleId);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      type: 'Bakım'
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      const reminderData = {
        ...data,
        vehicleId,
        dueDate: Timestamp.fromDate(new Date(data.dueDate))
      };
      
      await addReminder(reminderData);
      toast.success('Hatırlatma başarıyla eklendi');
      reset();
      onClose();
    } catch (error) {
      toast.error('Hatırlatma eklenirken bir hata oluştu');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Yeni Hatırlatma Ekle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hatırlatma Tipi</label>
            <select {...register('type')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
              <option value="Bakım">Bakım</option>
              <option value="Sigorta">Sigorta</option>
              <option value="Muayene">Muayene</option>
              <option value="Lastik">Lastik</option>
              <option value="Özel">Özel</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Başlık</label>
            <input {...register('title')} placeholder="Örn: Yıllık Periyodik Bakım" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hedef Tarih</label>
              <input type="date" {...register('dueDate')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
              {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hedef Kilometre (İsteğe bağlı)</label>
              <input type="number" {...register('dueMileage', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notlar (İsteğe bağlı)</label>
            <textarea {...register('notes')} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
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
