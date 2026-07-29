import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { UserCircle, Mail, Key } from 'lucide-react';

export default function Profile() {
  const { currentUser, updateUserProfile, resetPassword } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return toast.error('Ad Soyad boş bırakılamaz.');

    try {
      setIsUpdating(true);
      await updateUserProfile({ displayName });
      toast.success('Profiliniz başarıyla güncellendi.');
    } catch (error) {
      toast.error('Güncelleme başarısız: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsResetting(true);
      await resetPassword(currentUser.email);
      toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    } catch (error) {
      toast.error('Bağlantı gönderilemedi: ' + error.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profilim</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <UserCircle className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentUser?.displayName}</h2>
              <p className="text-gray-500 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profil Bilgileri</h3>
            <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          </div>

          <div className="border-t border-gray-100 pt-8 mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Güvenlik</h3>
            <div className="flex items-center justify-between max-w-md p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Key className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Hesap Şifresi</p>
                  <p className="text-xs text-gray-500">Şifrenizi sıfırlamak için bağlantı alın</p>
                </div>
              </div>
              <button
                onClick={handleResetPassword}
                disabled={isResetting}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
              >
                {isResetting ? 'Bekleyin...' : 'Sıfırla'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
