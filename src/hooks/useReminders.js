import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useReminders(vehicleId = null) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    let q;
    if (vehicleId) {
      q = query(
        collection(db, 'reminders'),
        where('userId', '==', currentUser.uid),
        where('vehicleId', '==', vehicleId)
      );
    } else {
      q = query(
        collection(db, 'reminders'),
        where('userId', '==', currentUser.uid)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reminderList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort in memory because Firestore requires compound indexes for where + orderBy
      reminderList.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.toDate() - b.dueDate.toDate();
      });
      setReminders(reminderList);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, vehicleId]);

  const addReminder = async (reminderData) => {
    if (!currentUser) throw new Error('Not authenticated');
    
    return addDoc(collection(db, 'reminders'), {
      ...reminderData,
      userId: currentUser.uid,
      isCompleted: false,
      createdAt: serverTimestamp()
    });
  };

  const deleteReminder = async (reminderId) => {
    if (!currentUser) throw new Error('Not authenticated');
    return deleteDoc(doc(db, 'reminders', reminderId));
  };

  const updateReminder = async (reminderId, data) => {
    if (!currentUser) throw new Error('Not authenticated');
    return updateDoc(doc(db, 'reminders', reminderId), data);
  };

  const markCompleted = async (reminderId, isCompleted) => {
    return updateReminder(reminderId, { isCompleted });
  }

  return { reminders, loading, addReminder, deleteReminder, updateReminder, markCompleted };
}
