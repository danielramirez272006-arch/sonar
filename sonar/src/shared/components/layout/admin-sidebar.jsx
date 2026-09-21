import React from 'react';

export const AdminSidebar = ({ activeTab = 'dashboard', onSelectTab = () => {} }) => {
  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: '◫' },
    { id: 'moderacion', label: 'Moderación', icon: '≋' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'settings', label: 'Configuración', icon: '⚙' },
  ];

  return (
    <aside className="w-full md:w-64 flex flex-col gap-2 p-4 bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 rounded-3xl">
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
        Consola de Administración
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => onSelectTab(link.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all cursor-pointer ${
              activeTab === link.id
                ? 'bg-[#B80C09] text-white shadow-xs'
                : 'text-[#231123] dark:text-[#FAF5F8] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
