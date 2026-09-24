import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({ isOpen, onClose, title, children, className = '', hideHeader = false }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    if (typeof dialog.showModal === 'function') {
      try {
        dialog.showModal();
      } catch {
        // Fallback si ya está abierto o entorno de prueba
      }
    }
    document.body.style.overflow = 'hidden';

    return () => {
      if (typeof dialog.close === 'function') {
        try {
          dialog.close();
        } catch {
          // Fallback si ya está cerrado
        }
      }
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`sonar-modal ${className}`}
      aria-label={title}
      aria-modal="true"
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
    >
      {!hideHeader && (
        <header className="sonar-modal__header">
          <h3>{title}</h3>
          <button type="button" onClick={onClose} aria-label="Cerrar modal">×</button>
        </header>
      )}
      {children}
    </dialog>,
    document.body
  );
};

export default Modal;
