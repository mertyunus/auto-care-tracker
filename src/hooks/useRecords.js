import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useRecords(vehicleId) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || !vehicleId) return;

    const q = query(
      collection(db, 'users', currentUser.uid, 'vehicles', vehicleId, 'records'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recordList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecords(recordList);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, vehicleId]);

  const addRecord = async (recordData, files = []) => {
    if (!currentUser || !vehicleId) throw new Error('Not authenticated');
    
    // Upload files to Cloudinary if any
    const photoUrls = [];
    if (files.length > 0) {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary ayarları eksik. Lütfen .env dosyanızı kontrol edin.');
      }

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        if (data.secure_url) {
          photoUrls.push(data.secure_url);
        } else {
          throw new Error('Fotoğraf yüklenemedi: ' + (data.error?.message || 'Bilinmeyen hata'));
        }
      }
    }

    // Add record to Firestore
    return addDoc(collection(db, 'users', currentUser.uid, 'vehicles', vehicleId, 'records'), {
      ...recordData,
      photos: photoUrls,
      createdAt: serverTimestamp()
    });
  };

  const deleteRecord = async (recordId) => {
    if (!currentUser || !vehicleId) throw new Error('Not authenticated');
    return deleteDoc(doc(db, 'users', currentUser.uid, 'vehicles', vehicleId, 'records', recordId));
  };

  const updateRecord = async (recordId, data) => {
    if (!currentUser || !vehicleId) throw new Error('Not authenticated');
    return updateDoc(doc(db, 'users', currentUser.uid, 'vehicles', vehicleId, 'records', recordId), data);
  };

  return { records, loading, addRecord, deleteRecord, updateRecord };
}
