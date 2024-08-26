import React from 'react';

interface ModalCuotasProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
}

const ModalAdvertencia: React.FC<ModalCuotasProps> = ({ isVisible, onClose, title }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1><strong>{title}</strong></h1>
                <div className='flex justify-center'>
                    <button
                        className="mt-4 bg-red-500 text-white p-2 rounded"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAdvertencia;