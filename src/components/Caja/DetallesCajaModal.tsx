import React from 'react';
import Modal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  caja: {
    _id: string;
    estado: string;
    situacionCaja: string;
    fechaApertura: string;
    montoInicial: number;
    moneda: number;
    billete: number;
    cheque: number;
    tarjeta: number;
    gastos: number;
    ingresos: number;
    fechaCierre?: string;
    montoFinal?: number;
  } | null;
}

const DetallesCajaModal: React.FC<ModalProps> = ({ isOpen, onClose, caja }) => {
  if (!caja) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false} className="flex items-center justify-center mt-20">
      <div className="p-4 w-full max-w-md bg-white rounded-lg shadow-md">
        <h2 className="font-extrabold text-2xl mb-6 text-center text-gray-700 border-b-2 border-gray-300 pb-3">📋 Detalles de la Caja</h2>
        <div className="space-y-2 text-lg">
          <p className="flex items-center"><span className="font-semibold">🔒 Estado:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold 
            ${caja.estado === 'abierto' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {caja.estado}
            </span>
          </p>
          <p className="flex items-center"><span className="font-semibold">🏦 Situación:</span>
            <span className="ml-2">{caja.situacionCaja}</span>
          </p>
          <p className="flex items-center"><span className="font-semibold">📅 Fecha de Apertura:</span>
            <span className="ml-2">{new Date(caja.fechaApertura).toLocaleString()}</span>
          </p>
          <p className="flex items-center"><span className="font-semibold">💰 Monto Inicial:</span>
            <span className="ml-2">Gs. {caja.montoInicial}</span>
          </p>
          <p className="flex items-center"><span className="font-semibold">💵 Moneda:</span>
            <span className="ml-2">Gs. {caja.moneda}</span>
          </p>
          <p className="flex items-center"><span className="font-semibold">💳 Billete:</span>
            <span className="ml-2">Gs. {caja.billete}</span>
          </p>
          <p className="flex items-center"><span className="font-semibold">🏦 Cheque:</span>
            <span className="ml-2">Gs. {caja.cheque}</span>
          </p>
          <p className="flex items-center"><span className="font-semibold">💳 Tarjeta:</span>
            <span className="ml-2">Gs. {caja.tarjeta}</span>
          </p>
          <p className="flex items-center"><span className="font-semibold">🧾 Gastos:</span>
            <span className="ml-2">Gs. {caja.gastos}</span>
          </p>
      
            <p className="flex items-center"><span className="font-semibold">📅 Fecha de Cierre:</span>
              <span className="ml-2">{caja.fechaCierre ? new Date(caja.fechaCierre).toLocaleString() : " "}</span>
            </p>
       
          <p className="flex items-center"><span className="font-semibold">💰 Monto Final:</span>
            <span className="ml-2">Gs.{caja.montoFinal}</span>
          </p>
        </div>
        <div className='flex justify-center'>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </Modal>
  );
};

export default DetallesCajaModal;
