import React from 'react';
import { Modal, Button } from '../../../ui';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  loading?: boolean;
  itemCount?: number;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Excluir',
  loading = false,
  itemCount
}) => {
  const defaultTitle = itemCount && itemCount > 1 
    ? `Excluir ${itemCount} itens` 
    : 'Confirmar exclusão';
    
  const defaultMessage = itemCount && itemCount > 1
    ? `Tem certeza que deseja excluir ${itemCount} itens selecionados? Esta ação não pode ser desfeita.`
    : 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || defaultTitle}
      size="sm"
    >
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {message || defaultMessage}
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};