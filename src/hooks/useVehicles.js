import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'users', currentUser.uid, 'vehicles'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vehicleList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVehicles(vehicleList);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const addVehicle = async (vehicleData) => {
    if (!currentUser) throw new Error('Not authenticated');
    
    return addDoc(collection(db, 'users', currentUser.uid, 'vehicles'), {
      ...vehicleData,
      currentMileage: Number(vehicleData.currentMileage) || 0,
      createdAt: serverTimestamp()
    });
  };

  const deleteVehicle = async (vehicleId) => {
    if (!currentUser) throw new Error('Not authenticated');
    return deleteDoc(doc(db, 'users', currentUser.uid, 'vehicles', vehicleId));
  };

  const updateVehicle = async (vehicleId, data) => {
    if (!currentUser) throw new Error('Not authenticated');
    return updateDoc(doc(db, 'users', currentUser.uid, 'vehicles', vehicleId), data);
  };

  return { vehicles, loading, addVehicle, deleteVehicle, updateVehicle };
}
