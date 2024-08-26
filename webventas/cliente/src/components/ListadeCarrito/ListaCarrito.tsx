import { useCartStore } from '../Productos/useCartStore.ts';
import Product1 from '../../assets/imagenauricular.png'
import ProcesarPago from './ProcesarPago.tsx';
import { useState } from 'react';
const ListaCarrito = () => {
    const { items, increaseQuantity, decreaseQuantity} = useCartStore();
    console.log("Datos de estado global", items);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Calcular el total
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const handleOutsideClick = (e: any) => {
        if (e.target.id === 'modal-background') {
            setIsModalOpen(false);
        }
    };
    return (
        <>
            <div className=''>
                <div className="mt-3 mb-3 ml-4 flex flex-wrap gap-9">
                    {items.map((item) => (
                        <div key={item.id} className='flex flex-col'>
                            <img className='w-[150px] h-[150px] border-2 rounded-lg' src={Product1} alt="imagen" />
                            <h2 className="text-xs font-bold text-center">{item.name}</h2>
                            <p className="text-xs text-center">Gs. {(item.price * item.quantity).toLocaleString("es")}</p>
                            <div className="flex flex-row gap-1 justify-center">
                                <button
                                    className="bg-blue-300 text-xs"
                                    onClick={() => increaseQuantity(item.id)}
                                >
                                    +
                                </button>
                                <p>{item.quantity}</p>
                                <button
                                    className="bg-blue-300 text-xs"
                                    onClick={() => decreaseQuantity(item.id)}
                                >
                                    -
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <h2 className="text-center text-lg md:text-xl lg:text-2xl font-semibold text-blue-600 border-t">
                    Total: <span className="font-bold text-blue-800">Gs. {total.toLocaleString("es")}</span>
                </h2>
                <div className='flex flex-row justify-center gap-9 mb-4 mt-4'>
                    <button onClick={() => setIsModalOpen(true)} className='bg-blue-500 text-white hover:scale-105 shadow-lg '>Pagar en linea</button>
                    <button className='bg-green-500 text-white hover:scale-105 shadow-lg'>Solicitar atención por Whatsapp</button>
                </div>
            </div>
            {isModalOpen && (
                <div
                    id="modal-background"
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
                    onClick={handleOutsideClick}
                >
                    <div className="bg-white p-4 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <ProcesarPago />
                    </div>
                </div>
            )}
            
        </>
    );
}

export default ListaCarrito;
