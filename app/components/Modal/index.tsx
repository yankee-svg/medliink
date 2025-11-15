import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from "react";

interface ModalProps {
  className?: string;
  children: React.ReactNode;
}

export interface ModalRef {
  showModal: () => void;
  closeModal: () => void;
}

const Modal = forwardRef<ModalRef, ModalProps>(
  ({ className, children }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const showModal = () => {
      setIsOpen(true);
    };

    const closeModal = () => {
      setIsOpen(false);
    };

    useImperativeHandle(ref, () => ({
      showModal,
      closeModal,
    }));

    return (
      <dialog
        id={`modal_${ref}`}
        className={`modal ${isOpen ? 'modal-open' : ''} ${className}`}
        open={isOpen}
      >
        <div className="neu-card max-w-lg mx-auto my-auto">
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={closeModal}
              className="neu-pressed absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-base-content hover:neu-raised transition-all duration-200"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </form>
          <div className="mt-4">
            {children}
          </div>
        </div>
      </dialog>
    );
  }
);

Modal.displayName = "Modal";

export default Modal;
