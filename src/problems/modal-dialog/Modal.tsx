import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    // Only listen while open, and always tear it down. The named handler is
    // what makes removal possible — you can't remove an inline arrow function.
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Rendered into <body>, so no ancestor's overflow, transform or z-index can
  // clip it. The component still *lives* where it was written — props, state
  // and context flow normally; only the DOM placement changes.
  return createPortal(
    <div
      className="modal-overlay"
      onClick={(e) => {
        // Close only if the click landed on the overlay ITSELF, rather than on
        // a child that bubbled up to it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content" role="dialog">
        <h2 className="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body,
  );
}
