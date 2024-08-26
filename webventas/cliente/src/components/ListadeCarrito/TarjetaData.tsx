import { FaCreditCard, FaCcVisa, FaCcMastercard, FaCcJcb } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { SiAmericanexpress } from "react-icons/si";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useCardStore } from './useCardStore';
import {
    usePaymentInputs
} from 'react-payment-inputs';
import images from 'react-payment-inputs/images';

const TarjetaData = ({ onConfirm }: { onConfirm: () => void }) => {
    const [tarjetaNumero, setTarjetaNumero] = useState('');
    const [nombreTitular, setNombreTitular] = useState('');
    const [cvc, setCVC] = useState('');
    const setCardData = useCardStore((state) => state.setCardData);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const styleInput = "border rounded-lg h-[40px] w-full text-sm pl-2";

    const handleConfirm = () => {
        // Convierte la fecha seleccionada al formato "mes/año"
        const formattedDate = selectedDate
            ? `${selectedDate.toLocaleString('es-ES', { month: 'long' })}/${selectedDate.getFullYear()}`
            : '';

        const newData = [tarjetaNumero, nombreTitular, cvc, formattedDate];
        setCardData(newData);
        console.log("Datos de tarjeta", newData);
        onConfirm();
    }
    const {
        getCardNumberProps,
        getCardImageProps,
    } = usePaymentInputs();

    return (
        <div>
            <h2 className="font-bold text-base text-center">Proporciona más información</h2>
            <div className="flex flex-row justify-center">
                <IoShieldCheckmarkOutline className="mt-1" />
                <p>No ingreses información sensible es una pagina de prueba</p>
            </div>
            <div className="bg-gray-200 rounded-md pl-2 pt-3 pb-3">
                <div className="flex flex-row gap-3">
                    <FaCreditCard className="mt-1" />
                    <p className="font-bold  text-base">Añade una nueva tarjeta</p>
                    <FaCcVisa className="mt-1" />
                    <FaCcMastercard className="mt-1" />
                    <FaCcJcb className="mt-1" />
                    <SiAmericanexpress className="mt-1" />
                </div>
            </div>
            <div className="flex flex-col gap-3 mt-3 ">
                <div className="flex flex-row gap-3 justify-center">
                    <div className="flex flex-row">
                        <div className="border rounded-lg h-[40px] w-full text-sm pl-2 flex flex-row">
                            <svg className="mt-3 mr-1 rounded-md" {...getCardImageProps({ images: images as any })} />
                            <input {...getCardNumberProps({
                                onChange: (e: any) => setTarjetaNumero(e.target.value),
                            })} type="text" placeholder="Número de la tarjeta" />
                        </div>
                    </div>
                    <input className={styleInput} onChange={(e) => { setNombreTitular(e.target.value) }} type="text" placeholder="Nombre del titular" />
                </div>
                <div className="flex flex-row gap-3 justify-center">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        showMonthYearPicker
                        dateFormat="MM/yyyy"
                        placeholderText="Fecha de expiración"
                        className="border rounded-lg h-[40px] text-sm pl-2"
                    />
                    <input onChange={(e) => { setCVC(e.target.value) }} className={styleInput} type="text" placeholder="CVC" />
                </div>
                <div className="flex flex-col gap-3 mt-3 ">
                </div>
            </div>
            <div className="border-t flex justify-center mt-3  mb-3">
                <button onClick={handleConfirm} className="mt-3 w-[600px] rounded-full bg-green-500 text-white hover:scale-105 shadow-lg">Guardar y confirmar</button>
            </div>
        </div>
    )
}

export default TarjetaData
