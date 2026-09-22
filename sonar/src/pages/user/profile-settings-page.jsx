import React, { useState } from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import Toast from '../../shared/components/ui/toast';
import EditProfileForm from '../../features/profile/components/edit-profile-form';
import { useAuth } from '../../shared/context/auth-context';
import { useRouter } from '../../shared/routing/app-router';

export const ProfileSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter?.();
  const [toastMessage, setToastMessage] = useState(null);

  const handleSave = (formData) => {
    updateUser(formData);
    setToastMessage('¡Perfil y preferencias musicales actualizados con éxito!');
    setTimeout(() => {
      if (router?.navigate) {
        router.navigate('usuario');
      } else {
        window.location.hash = '#usuario';
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full flex flex-col gap-6">
        <div className="border-b border-[#e6d5e2] dark:border-white/10 pb-4">
          <span className="text-xs uppercase tracking-widest text-[#B80C09] font-extrabold">
            CONFIGURACIÓN
          </span>
          <h1 className="text-3xl font-black text-[#231123] dark:text-white tracking-tight mt-1">
            Personalizar Perfil & Preferencias
          </h1>
          <p className="text-sm text-[#5c435a] dark:text-[#B89CB0] mt-1">
            Ajusta tu biografía, avatar y géneros preferidos para calibrar tus recomendaciones acústicas en Sonar.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-md">
          <EditProfileForm initialData={user || {}} onSave={handleSave} />
        </div>
      </main>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProfileSettingsPage;
