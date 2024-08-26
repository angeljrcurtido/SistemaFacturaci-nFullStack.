import { useEffect, useState } from 'react';
import axios from 'axios';
import InputText from '../Productos/InputText'

const HistorialCompras = () => {
    const [data, setData] = useState([]);
    const [detalle, setDetalle] = useState(null);
    const [facturaNumero, setFacturaNumero] = useState('');
    const [fechaInicio, setFechaInicio] = useState(''); // Nuevo estado para la fecha de inicio
    const [fechaFinal, setFechaFinal] = useState(''); // Nuevo estado para la fecha final

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:3001/compras');
            console.log(result.data)
            setData(result.data);
        };
        fetchData();
    }, []);

    const handleDetalleClick = (item) => {
        console.log(item);
        setDetalle(item);
    };
    
    const handleDeleteCompra = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/compras/${id}`);
            const result = await axios.get('http://localhost:3001/compras');
            setData(result.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1 className="text-center font-bold border-b">HISTORIAL COMPRAS</h1>
            <div className='flex gap-6 border-b'>
            <InputText 
                    type="text"
                    value={facturaNumero}
                    onChange={e => setFacturaNumero(e.target.value)}
                    placeholder="Buscar por número de factura" id={''} label={''}            />
            <InputText 
                    type="date"
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                    placeholder="Fecha de inicio" id={''} label={''}            /> {/* Campo de entrada para la fecha de inicio */}
            <InputText 
                    type="date"
                    value={fechaFinal}
                    onChange={e => setFechaFinal(e.target.value)}
                    placeholder="Fecha final" id={''} label={''}            /> {/* Campo de entrada para la fecha final */}
            </div>
            <div className='overflow-x-auto max-h-80'>
                <table className='table-auto border w-full'>
                    <thead>
                        <tr className='bg-gray-800 text-white'>
                            <th>Proveedor</th>
                            <th>FacturaNumero</th>
                            <th>Fecha</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody className='text-center '>
                        {data.filter(item => {
                            const fecha = new Date(item.fecha);
                            return (item.facturaNumero && item.facturaNumero.includes(facturaNumero)) && 
                                (!fechaInicio || fecha >= new Date(fechaInicio)) && 
                                (!fechaFinal || fecha <= new Date(fechaFinal));
                        }).map((item, index) => (
                            <tr key={index}>
                                <td>{item.proveedor}</td>
                                <td>{item.facturaNumero}</td>
                                <td>{new Date(item.fecha).toLocaleDateString()}</td>
                                <td>
                                    <button type="button" onClick={() => handleDetalleClick(item)}>Detalles</button>
                                    <button type="button" onClick={()=>handleDeleteCompra(item._id)} >Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {detalle && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75" onClick={() => setDetalle(null)}>
                    <div className="bg-white p-6 rounded-lg shadow-lg" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Detalle de la factura: {detalle.facturaNumero}</h2>
                        <p>Proveedor: {detalle.proveedor}</p>
                        <table className='table-auto border w-full'>
                            <thead>
                                <tr className='bg-gray-800 text-white'>
                                    <th className="border-r">Producto</th>
                                    <th className="border-r">Cantidad</th>
                                    <th className="border-r">Precio de compra</th>
                                </tr>
                            </thead>
                            <tbody className='text-center border '>
                                {detalle.producto.map((prod, index) => (
                                    <tr key={index}>
                                        <td className="border">{prod.nombreProducto}</td>
                                        <td className="border">{prod.cantidad}</td>
                                        <td className="border">{prod.precioCompra}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p>Precio total de compra: Gs. {detalle.precioCompraTotal.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p>Telefono: {detalle.Telefono}</p>
                        <p>Direccion: {detalle.Direccion}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistorialCompras;