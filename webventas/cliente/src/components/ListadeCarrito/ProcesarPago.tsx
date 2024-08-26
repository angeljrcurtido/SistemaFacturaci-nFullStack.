import { FaCreditCard } from "react-icons/fa";
import Product1 from '../../assets/imagenauricular.png'
import { useCartStore } from '../Productos/useCartStore.ts';
import { FaCcVisa, FaCcMastercard, FaCcJcb } from "react-icons/fa6";
import { CiTrash } from "react-icons/ci";
import CountrySelector from "./CountrySelector.tsx";
import { SiAmericanexpress } from "react-icons/si";
import { IoIosAdd, IoMdRemove } from "react-icons/io";
import { useAddressStore } from './useAddressStore';
import { useCardStore } from "./useCardStore.tsx";
import { FcDisclaimer } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

import TarjetaData from "./TarjetaData.tsx";
const ProcesarPago = () => {
    const navigate = useNavigate();
    const { items, increaseQuantity, decreaseQuantity, removeItem } = useCartStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenCard, setIsModalOpenCard] = useState(false);
    console.log("Datos de estado global", items);
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const constdelivery = 0;
    const handleOutsideClick = (e: any) => {
        if (e.target.id === 'modal-background') {
            setIsModalOpen(false);
        }
    };
    const handleOutsideClick1 = (e: any) => {
        if (e.target.id === 'modal-background') {
            setIsModalOpenCard(false);
        }
    };
    const handleConfirm = () => {
        // Aquí puedes agregar cualquier otra lógica que quieras ejecutar cuando se confirme la dirección
        setIsModalOpen(false);
    };
    const handleConfirm1 = () => {
        // Aquí puedes agregar cualquier otra lógica que quieras ejecutar cuando se confirme la dirección
        setIsModalOpenCard(false);
    };
    // Función para formatear el número de la tarjeta
    const formatCardNumber = (number: any) => {
        // Asegúrate de que sea una cadena y remueve los espacios para aplicar el formato correctamente
        const cleanNumber = number.replace(/\s+/g, '');
        return cleanNumber.replace(/\d(?=\d{4})/g, '*');
    };
    // Accede a los valores del estado global
    const { contactName, address, phone } = useAddressStore((state) => ({
        contactName: state.contactName,
        address: state.address,
        phone: state.phone
    }));
    const { cardNumber } = useCardStore();
    console.log("Datos de dirección", contactName, address, phone);
    
    return (
        <>
            <div className="flex flex-row gap-3">
                <div>
                    <div className="border-2 rounded-md flex flex-col gap-1 pl-4">
                        <p className="font-bold text-xl">Dirección de Entrega</p>
                        <div>
                            <p><span className="font-bold">Contacto:</span>{contactName}</p>
                            <div className="flex flex-row gap-3">
                                <p><span className="font-bold">Dirección:</span>{address}</p>
                                <p><span className="font-bold">Telefono:</span>{phone}</p>
                            </div>
                        </div>
                        <div className="flex text-start">
                            <div className="flex-flex-row">
                                <button onClick={() => setIsModalOpen(true)} className="text-blue-500 text-lg p-0 bg-white focus:ring-white border-none hover:border-none">+ </button><span className="text-blue-500 text-lg">Añadir nueva dirección</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-2 rounded-md flex flex-col gap-1 pl-4 mt-4 ">
                        <p className="font-bold text-xl">Métodos de pago</p>
                        <div>
                            <div className="flex flex-row gap-3">
                                <input onClick={() => setIsModalOpenCard(true)} type="checkbox" />
                                <FaCreditCard className="mt-2" />
                                <p className="font-bold text-xl">Añade una nueva tarjeta</p>
                            </div>
                            <div className="flex flex-row gap-3">
                                <FaCreditCard className="mt-1" />
                                <div>{formatCardNumber(cardNumber)}</div>
                            </div>
                            <div className="flex flex-row gap-1">
                                <FaCcVisa />
                                <FaCcMastercard />
                                <FaCcJcb />
                                <SiAmericanexpress />
                            </div>
                        </div>
                    </div>
                    <div >
                        <p className="text-center font-bold text-xl mt-3">Detalles del producto</p>
                        <div className="max-h-[300px] overflow-y-auto">
                        {items.map((item) => (
                            <div key={item.id} className='flex flex-row border-2 mb-3 mt-3 ml-3 mr-3 rounded-lg'>
                                <img className='w-[150px] h-[150px] ml-3' src={Product1} alt="imagen" />
                                <div className="flex flex-col justify-center">
                                    <h2 className="text-xs font-bold text-center self-center ml-3 mr-3">{item.name}</h2>
                                    <p className="text-base text-center self-center ml-3 mr-3 font-bold">Gs. {(item.price * item.quantity).toLocaleString("es")}</p>
                                </div>
                                <div className="flex-grow" /> {/* Espaciador para empujar los botones al final */}
                                <div className="flex flex-row gap-1 justify-end items-center ml-auto mr-3">
                                    <button
                                        className="bg-blue-300 text-xs"
                                        onClick={() => increaseQuantity(item.id)}
                                    >
                                        <IoIosAdd />
                                    </button>
                                    <p>{item.quantity}</p>
                                    <button
                                        className="bg-blue-300 text-xs"
                                        onClick={() => decreaseQuantity(item.id)}
                                    >
                                        <IoMdRemove />
                                    </button>
                                    <button
                                        className="bg-blue-300 text-xs"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <CiTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-9">
                    <div className="border-2 rounded-md flex flex-col pl-4 h-[170px] w-[350px] pr-3">
                        <p className="font-bold text-xl">Resumen</p>
                        <div className="flex flex-row justify-between">
                            <p className="mr-2">Subtotal</p>
                            <p className="text-base font-bold">Gs. {(total).toLocaleString("es")}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="mr-2">Gastos de envío</p>
                            <p className="text-base font-bold"> Gs. {constdelivery}</p>
                        </div>
                        <div className="flex flex-row border-t justify-between ">
                            <p className="mr-2 font-bold text-xl">Total</p>
                            <p className="text-base font-bold">Gs. {(total + constdelivery).toLocaleString("es")}</p>
                        </div>
                        <button className="rounded-full bg-blue-400 text-white hover:scale-105 mb-3 mt-3"  onClick={()=>navigate (`/paysave`)}>Realizar pago</button>
                    </div>
                    <div className="border-2 rounded-md flex flex-col pl-4 h-[170px] w-[350px] pr-3 justify-center">
                        <div className="flex flex-row justify-center">
                            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                            <p className="font-bold text-xl text-center">SisVentas</p>
                        </div>
                        <div className="flex flex-row justify-center mt-1">
                            <FcDisclaimer className="text-2xl" />
                            <p className="font-bold text-xl text-center">Disclaimer</p>
                        </div>
                        <p className=" text-sm text-center">Este es un sistema de pruebas con datos ficticios</p>
                        <p className=" text-sm text-center">No subir ni escribir datos sensibles</p>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div
                    id="modal-background"
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
                    onClick={handleOutsideClick}
                >
                    <div className="bg-white p-4 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <CountrySelector onConfirm={handleConfirm} />
                    </div>
                </div>
            )}
            {isModalOpenCard && (
                <div
                    id="modal-background"
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
                    onClick={handleOutsideClick1}
                >
                    <div className="bg-white p-4 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <TarjetaData onConfirm={handleConfirm1} />
                    </div>
                </div>
            )}
            
        </>
    )
}

export default ProcesarPago
