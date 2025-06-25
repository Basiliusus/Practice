import React from 'react';

interface ConfirmationModalProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title = 'Подтверждение',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Да',
  cancelText = 'Нет',
}) => {
  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>{confirmText}</button>
          <button className="cancel-btn" onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 