import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({ isOpen, onClose, title, children, className = '', hideHeader = false }) => {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return createPortal(
    <dialog ref={dialogRef} className={`sonar-modal ${className}`} aria-label={title} aria-modal="true"
      onCancel={event => { event.preventDefault(); onClose(); }}>
      {!hideHeader && <header className="sonar-modal__header"><h3>{title}</h3><button type="button" onClick={onClose} aria-label="Cerrar modal">×</button></header>}
      {children}
    </dialog>, document.body,
  );
};
export default Modal;
