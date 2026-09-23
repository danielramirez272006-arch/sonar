import React, { useState } from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import Toast from '../../shared/components/ui/toast';

const API_ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/v1/albums',
    title: 'Obtener Catálogo de Álbumes',
    description: 'Devuelve la lista paginada de álbumes indexados con calificaciones, géneros y enlaces Deezer.',
    sampleResponse: {
      status: 'success',
      total: 1420,
      page: 1,
      data: [
        {
          id: 14880659,
          title: 'In Rainbows',
          artist: 'Radiohead',
          year: 2007,
          genre: 'Art Rock',
          rating: 4.8,
          reviewsCount: 24812,
          cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg'
        }
      ]
    }
  },
  {
    method: 'GET',
    path: '/api/v1/reviews',
    title: 'Obtener Reseñas Recientes',
    description: 'Recupera las críticas aprobadas de la comunidad con análisis de IA y puntuaciones.',
    sampleResponse: {
      status: 'success',
      total: 840,
      data: [
        {
          id: 'rev-101',
          albumId: 14880659,
          userId: 'user_482',
          rating: 5,
          text: 'Una experiencia sónica impecable con producción analógica inigualable.',
          createdAt: '2026-09-20T14:32:00Z',
          aiModeration: { status: 'approved', confidence: 0.99 }
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v1/reviews',
    title: 'Crear Nueva Crítica',
    description: 'Permite a los clientes autenticados publicar una reseña con calificación y texto.',
    sampleRequest: {
      albumId: 10709540,
      rating: 4.5,
      content: 'Líneas de bajo excepcionales y masterización espacial.',
    },
    sampleResponse: {
      status: 'created',
      reviewId: 'rev-992',
      message: 'Reseña enviada exitosamente para indexación.'
    }
  }
];

export const DeveloperApiPage = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0]);
  const [activeTab, setActiveTab] = useState('response'); // 'response' | 'curl' | 'js'
  const [toastMessage, setToastMessage] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToastMessage('Código copiado al portapapeles');
  };

  const getCurlSnippet = (ep) => {
    if (ep.method === 'GET') {
      return `curl -X GET "https://api.sonar.audio${ep.path}" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Accept: application/json"`;
    }
    return `curl -X POST "https://api.sonar.audio${ep.path}" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(ep.sampleRequest, null, 2)}'`;
  };

  const getJsSnippet = (ep) => {
    if (ep.method === 'GET') {
      return `const response = await fetch("https://api.sonar.audio${ep.path}", {\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Accept": "application/json"\n  }\n});\nconst data = await response.json();\nconsole.log(data);`;
    }
    return `const response = await fetch("https://api.sonar.audio${ep.path}", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify(${JSON.stringify(ep.sampleRequest, null, 2)})\n});\nconst data = await response.json();`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onClose={() => setToastMessage(null)}
        />
      )}

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <header className="border-b border-[#e6d5e2] dark:border-white/10 pb-8 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-black text-[#5c1d5e] dark:text-pink-300">
              SONAR DEV HUB & DOCUMENTACIÓN REST
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#231123] dark:text-white">
            API para Desarrolladores
          </h1>
          <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] max-w-2xl mt-2 font-medium">
            Integra el catálogo analógico de Sonar, calificaciones audiófilas y metadatos discográficos en tus propias aplicaciones, widgets y bots.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lista de Endpoints */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h2 className="text-xs uppercase tracking-wider font-extrabold text-[#5c1d5e] dark:text-pink-300 mb-2">
              Endpoints Disponibles
            </h2>
            {API_ENDPOINTS.map((ep) => (
              <button
                key={ep.path + ep.method}
                type="button"
                onClick={() => setSelectedEndpoint(ep)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method
                    ? 'bg-white dark:bg-[#4B2840] border-[#B80C09] shadow-md ring-1 ring-[#B80C09]/20'
                    : 'bg-white/60 dark:bg-[#231123] border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      ep.method === 'GET'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#231123] dark:text-white">
                    {ep.path}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#231123] dark:text-white mb-1">
                  {ep.title}
                </h4>
                <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] line-clamp-2">
                  {ep.description}
                </p>
              </button>
            ))}

            {/* Tarjeta de Clave de API */}
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#4B2840] to-[#231123] text-white border border-white/10">
              <span className="text-xs uppercase tracking-wider font-bold text-pink-300 block mb-1">
                Autenticación
              </span>
              <p className="text-xs text-white/80 leading-relaxed mb-3">
                Todas las solicitudes requieren un encabezado de autorización Bearer Token.
              </p>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 font-mono text-[11px] text-pink-200">
                <span className="truncate">sonar_live_pk_8f49a2...</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('sonar_live_pk_8f49a201c89e')}
                  className="hover:text-white transition-colors cursor-pointer ml-2"
                  title="Copiar token de prueba"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
              </div>
            </div>
          </div>

          {/* Consola Interactiva / Code Inspector */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#1e131f] text-gray-100 border border-white/10 shadow-2xl flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      selectedEndpoint.method === 'GET'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    {selectedEndpoint.path}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('response')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === 'response' ? 'bg-[#B80C09] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    JSON Response
                  </button>
                  <button
                    onClick={() => setActiveTab('curl')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === 'curl' ? 'bg-[#B80C09] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setActiveTab('js')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === 'js' ? 'bg-[#B80C09] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    JavaScript
                  </button>
                </div>
              </div>

              <div className="flex-1 relative overflow-x-auto font-mono text-xs leading-relaxed text-emerald-300 p-4 rounded-2xl bg-black/50 border border-white/5">
                <button
                  onClick={() => {
                    const content =
                      activeTab === 'response'
                        ? JSON.stringify(selectedEndpoint.sampleResponse, null, 2)
                        : activeTab === 'curl'
                        ? getCurlSnippet(selectedEndpoint)
                        : getJsSnippet(selectedEndpoint);
                    copyToClipboard(content);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Copiar código"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>

                <pre>
                  {activeTab === 'response' && JSON.stringify(selectedEndpoint.sampleResponse, null, 2)}
                  {activeTab === 'curl' && getCurlSnippet(selectedEndpoint)}
                  {activeTab === 'js' && getJsSnippet(selectedEndpoint)}
                </pre>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>Status: <strong className="text-emerald-400 font-mono">200 OK</strong></span>
                <span>Content-Type: <strong className="text-gray-200 font-mono">application/json; charset=utf-8</strong></span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DeveloperApiPage;
