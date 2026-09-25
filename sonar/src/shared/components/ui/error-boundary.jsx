import React from 'react';

/**
 * ErrorBoundary - Capturador de excepciones en el árbol de renderizado de React.
 * Evita que errores no controlados en componentes desmonte la aplicación
 * o dejen la pantalla en blanco ("White Screen of Death").
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[SONAR ErrorBoundary] Error capturado en el árbol de componentes:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      try {
        this.props.onReset();
      } catch (e) {
        console.warn('Error en onReset:', e);
      }
    }
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#explore';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ error: this.state.error, reset: this.handleReset })
          : this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[380px] w-full flex flex-col items-center justify-center p-6 sm:p-10 my-4 bg-sonar-surface/90 border border-red-500/20 rounded-2xl backdrop-blur-md shadow-2xl text-center"
        >
          {/* Icono de señal acústica interrumpida */}
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-5 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <span className="material-symbols-outlined text-3xl animate-pulse">
              signal_disconnected
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-sonar-text mb-2 tracking-tight">
            Interferencia acústica momentánea
          </h2>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mb-6 leading-relaxed">
            Esta sección experimentó una anomalía imprevista. La señal se ha aislado para proteger tu experiencia de escucha.
          </p>

          <div className="flex flex-wrap gap-3 justify-center items-center">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-sonar-primary hover:bg-sonar-primary-hover text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Reconectar señal
            </button>

            <button
              onClick={this.handleGoHome}
              className="px-5 py-2.5 bg-gray-200 dark:bg-sonar-base/80 hover:bg-gray-300 dark:hover:bg-sonar-base text-gray-800 dark:text-sonar-text text-sm font-semibold rounded-xl border border-gray-300 dark:border-white/10 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">home</span>
              Ir al Inicio
            </button>
          </div>

          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <details className="mt-6 text-left max-w-xl w-full p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-red-300/90 font-mono overflow-auto max-h-48">
              <summary className="cursor-pointer text-gray-400 hover:text-white font-sans font-medium mb-2">
                Detalles técnicos para desarrolladores
              </summary>
              <p className="font-bold text-red-400 mb-1">{this.state.error.toString()}</p>
              <pre className="whitespace-pre-wrap text-[11px] text-gray-400">
                {this.state.errorInfo?.componentStack || this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
