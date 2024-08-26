import { FaCheckDouble } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
const PaySave = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className='flex flex-row justify-center border-2 rounded-lg'>
                <div className='flex flex-col'>
                    <div className="flex flex-row justify-center">
                        <FaCheckDouble className="mt-2 mr-1" />
                        <p className="font-bold text-xl text-center" >Pago procesado</p>
                    </div>
                    <div className="border rounded-lg p-4 mt-4 drop-shadow-2xl">
                    <p>Gracias por probar el sistema</p>
                    <p>Le recordamos que todos los datos son ficticios</p>
                    <p>Probar las veces que desee</p>
                    </div>
                    <button onClick={()=>navigate (`/`)} className="rounded-full bg-green-500 text-white hover:scale-105 mb-3 mt-3">Volver al inicio</button>
                </div>
            </div>
        </div>
    )
}

export default PaySave
