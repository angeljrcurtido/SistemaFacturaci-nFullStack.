import { useState, useEffect } from 'react';
import axios from 'axios';
import {BlobProvider } from '@react-pdf/renderer';
import TicketPDF from '../Ventas/TicketPdf';
import { IoArrowUndoSharp, IoArrowRedo } from "react-icons/io5";

const HistorialVentas = () => {
    const [showModalDetalles, setShowModalDetalles] = useState(false);
    const [showModalTicket, setShowModalTicket] = useState(false);
    const [detalleVenta, setDetalleVenta] = useState(null);
    const [ventas, setVentas] = useState([]);
    const [ventaRealizada, setVentaRealizada] = useState(null);
    const [filteredVentas, setFilteredVentas] = useState([]);
    const [numeroFacturaFilter, setNumeroFacturaFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ventasPerPage = 5;

    const StyleInput = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 

    useEffect(() => {
        // Función para obtener las ventas
        const fetchVentas = async () => {
            try {
                const response = await axios.get('http://localhost:3001/ventas');
                setVentas(response.data);
            } catch (error) {
                console.error('Error al obtener las ventas:', error);
            }
        };

        fetchVentas();
    }, []);

    // Función para abrir el modal y mostrar los detalles de la venta
    const openModal = (venta) => {
        setDetalleVenta(venta);
        setShowModalDetalles(true);
    };

    // Función para cerrar el modal

    // Función para anular una venta
    const anularVenta = async (id) => {
        try {
            await axios.put(`http://localhost:3001/ventas/anular/${id}`);
            // Actualizar el estado de la venta en el frontend
            setVentas(ventas.map((venta) =>
                venta._id === id ? { ...venta, estado: 'anulado' } : venta
            ));
        } catch (error) {
            console.error('Error al anular la venta:', error);
        }
    };
    const printDocument = (blob) => {
        const url = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        iframe.onload = function () {
            iframe.contentWindow.print();
        }
    }

    // Función para filtrar las ventas
    useEffect(() => {
        let filtered = ventas;

        if (numeroFacturaFilter) {
            filtered = filtered.filter(venta => venta.numeroFactura === numeroFacturaFilter);
        }

        if (estadoFilter) {
            filtered = filtered.filter(venta => venta.estado === estadoFilter);
        }

        if (startDate && endDate) {
            filtered = filtered.filter(venta => {
                const ventaDate = new Date(venta.fechaVenta);
                return ventaDate >= new Date(startDate) && ventaDate <= new Date(endDate);
            });
        }

        setFilteredVentas(filtered);
    }, [ventas, numeroFacturaFilter, estadoFilter, startDate, endDate]);
    // Función para abrir el modal de ticket y establecer la venta que se va a imprimir
const openModalTicket = (venta) => {
    setVentaRealizada(venta);
    setShowModalTicket(true);
};
    // Divide las ventas en páginas
    const indexOfLastVenta = currentPage * ventasPerPage;
    const indexOfFirstVenta = indexOfLastVenta - ventasPerPage;
    const currentVentas = filteredVentas.slice(indexOfFirstVenta, indexOfLastVenta);


    return (
        <div>
            <h1 className="font-bold text-center border-b">HISTORIAL VENTAS</h1>
            {/* Filtros */}
            <div className=" flex gap-4 mt-4 mb-4 ml-2">
                <div>
                    <input
                    className={StyleInput}
                        type="text"
                        placeholder="Número de Factura"
                        value={numeroFacturaFilter}
                        onChange={(e) => setNumeroFacturaFilter(e.target.value)}
                    />
                </div>
                <div>
                    <select
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        value={estadoFilter}
                        onChange={(e) => setEstadoFilter(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="activo">Activo</option>
                        <option value="anulado">Anulado</option>
                    </select>
                </div>
                <div className='flex gap-4'>
                    <input
                    className={StyleInput}
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                    className={StyleInput}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>
            {/* Fin de los filtros */}
    
            {/* Tabla de ventas */}
            <table className='table-auto border w-full'>
                <thead>
                    <tr className='bg-gray-800 text-white'>
                        <th className="border-r">Número de Factura</th>
                        <th className="border-r">Fecha de Venta</th>
                        <th className="border-r">Comercial</th>
                        <th className="border-r">Total</th>
                        <th className="border-r">Estado</th>
                        <th className="border-r">Acciones</th>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {currentVentas.map((venta) => (
                        <tr key={venta._id}>
                            <td className="border">{venta.numeroFactura}</td>
                            <td className="border">{new Date(venta.fechaVenta).toLocaleString()}</td>
                            <td className="border">{venta.comercial}</td>
                            <td className="border">Gs.{(venta.PrecioVentaTotal).toLocaleString('es-PY')}</td>
                            <td className="border">{venta.estado}</td>
                            <td className="border">
                                <button className='mr-4 mt-2 mb-2' onClick={() => openModal(venta)}>Detalles</button>
                                <button onClick={() => anularVenta(venta._id)} disabled={venta.estado === 'anulado'}>Anular</button>
                                <button type="button" className="ml-3" onClick={() => openModalTicket(venta)}>Imprimir Ticket</button> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    
            {/* Paginación */}
            <div className="flex justify-center">
                <button type='button' className='shadow-xl mt-2 mr-2  hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    <IoArrowUndoSharp />
                </button>
                <span className='font-bold text-xl mt-3'>{currentPage}</span>
                <button type='button' className='shadow-xl mt-2 ml-2  hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(filteredVentas.length / ventasPerPage)}>
                    <IoArrowRedo />
                </button>
            </div>
    
            {/* Modal para mostrar los detalles de la venta */}
            {showModalDetalles && detalleVenta && (
                <div className="modal-background" onClick={() => setShowModalDetalles(false)}>
                    <div className="modal-content"onClick={e => e.stopPropagation()}>
                        <h2 className="font-bold text-center">Detalles de la Venta</h2>
                        <p>Número de Factura: {detalleVenta.numeroFactura}</p>
                        <p>Fecha de Venta: {new Date(detalleVenta.fechaVenta).toLocaleString()}</p>
                        <p>Total: Gs. {detalleVenta.PrecioVentaTotal}</p>
                        <p>Estado: {detalleVenta.estado}</p>
                        <h3 className ="text-center font-bold">Productos:</h3>
                        <table className='table-auto border w-full'>
                            <thead>
                                <tr className='bg-gray-800 text-white'>
                                    <th className="border-r">Producto</th>
                                    <th className="border-r">Cantidad</th>
                                    <th className="border-r">Precio</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {detalleVenta.productos.map((producto) => (
                                    <tr key={producto._id}>
                                        <td className="border">{producto.nombreProducto}</td>
                                        <td className="border">{producto.cantidad}</td>
                                        <td className="border">Gs. {producto.precioVenta}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className ="text-center font-bold">Total: {detalleVenta.PrecioVentaTotal}</p>
                        <p>Iva 10%: {detalleVenta.Iva10.toFixed(2)}</p>
                        <p>Iva 5%: {detalleVenta.Iva5.toFixed(2)}</p>
                    </div>
                </div>
            )}
              {
                showModalTicket && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Ticket de Compra</h2>
                            <div style={{ width: '100%', height: '100%' }}>
                                <BlobProvider document={<TicketPDF venta={ventaRealizada} />}>
                                    {({ blob, url, loading, error }) => {
                                        if (blob) {
                                            return (
                                                <div>
                                                    <iframe src={url} style={{ width: '100%', height: '100%' }} />
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            className="bg-green-500 text-white p-1 rounded mt-4"
                                                            onClick={() => printDocument(blob)}
                                                        >
                                                            Imprimir
                                                        </button>
                                                        <button
                                                            className="bg-green-500 text-white p-1 rounded mt-4"
                                                            onClick={() => setShowModalTicket(false)}
                                                        >
                                                            Cerrar
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        } else if (loading) {
                                            return <div>Cargando...</div>;
                                        } else if (error) {
                                            return <div>Error al generar el PDF</div>;
                                        }
                                    }}
                                </BlobProvider>
                            </div>

                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default HistorialVentas;