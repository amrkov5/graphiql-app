import React from 'react';
import styles from './modal.module.css';

interface ModalProps {
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button className={styles.btn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;