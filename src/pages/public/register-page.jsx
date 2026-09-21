import React from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import RegisterForm from '../../features/auth/components/register-form';

export const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#231123] text-[#FAF5F8]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
