export interface IModalProps<T> {
    showModal: boolean;
    buttonText?: string;
    modalClassSize?: 'modal-xl' | 'modal-lg' | 'modal-md' | 'modal-sm';
    showSaveButton?: boolean;
    showCloseButton?: boolean;
    showModalTitle?: boolean;
    modalTitle: string | null;
    onClose: () => void;
    onSave: () => void;
    
}

export interface IModalState<T> {
    showModal: boolean;
}
