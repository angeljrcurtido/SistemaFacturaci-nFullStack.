import React, { useState, useEffect } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import Button from '../Productos/Button';
import ModalAdvertencia from './ModalAdvertencia';
import TicketPDF from './TicketPdf';
import axios from 'axios';

interface Producto {
    _id: string;
    nombreProducto: string;
    precioVenta: number;
    precioCompra: number;
    stockActual: number;
    Iva: string;
    codigoBarra?: string;
}

interface ProductoSeleccionado {
    producto: Producto;
    cantidad: number;
}

const Ventas: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
    const [showModalProductos, setShowModalProductos] = useState(false);
    const [showModalCobranza, setShowModalCobranza] = useState(false);
    const [showModalAdvertencia, setShowModalAdvertencia] = useState(false);
    const [showModalAlerta, setShowModalAlerta] = useState(false);
    const [clientes, setClientes] = useState([]);
    // Agregar estado para las cajas abiertas
    const [cajasAbiertas, setCajasAbiertas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [title, setTitle] = useState('');
    const [ventaRealizada, setVentaRealizada] = useState(null);
    const [showModalTicket, setShowModalTicket] = useState(false);
    const [dineroCliente, setDineroCliente] = useState<number>(0);
    const [codigoBarra, setCodigoBarra] = useState('');
    const [ventaData, setVentaData] = useState({
        numeroTimbrado: '',
        cliente: '',
        rucempresa: '',
        ruccliente: '',
        comercial: '',
        telefono: '',
        direccion: '',
        estado: 'activo'
    });

    useEffect(() => {
        axios.get('http://localhost:3001/caja/abiertas')
            .then(response => {
                setCajasAbiertas(response.data);
            })
            .catch(error => {
                console.error('Error fetching cajas abiertas:', error);
            });
    }, []);

    // Verificar si hay una caja abierta para el día actual
    const hayCajaAbiertaHoy = cajasAbiertas.some(caja => {
        const fechaApertura = new Date(caja.fechaApertura);
        const hoy = new Date();
        return fechaApertura.getDate() === hoy.getDate() &&
            fechaApertura.getMonth() === hoy.getMonth() &&
            fechaApertura.getFullYear() === hoy.getFullYear();
    });

    useEffect(() => {
        axios.get('http://localhost:3001/productos')
            .then(response => {
                setProductos(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching productos:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/datos-empresa/ultimo')
            .then(response => {
                const { Timbrado, Comercial, Ruc, Direccion, Telefono } = response.data;
                setVentaData(prevData => ({
                    ...prevData,
                    numeroTimbrado: Timbrado,
                    comercial: Comercial,
                    rucempresa: Ruc,
                    direccion: Direccion,
                    telefono: Telefono
                }));
            })
            .catch(error => {
                console.error('Error fetching datos empresa:', error);
            });
    }, []);

    useEffect(() => {
        const fetchClientes = async () => {
            const response = await axios.get('http://localhost:3001/datos-cliente/');
            setClientes(response.data);
        };

        fetchClientes();
    }, []);

    const handleSelectProducto = (producto: Producto) => {
        const existingProduct = productosSeleccionados.find(p => p.producto._id === producto._id);
        if (existingProduct) {
            setProductosSeleccionados(
                productosSeleccionados.map(p =>
                    p.producto._id === producto._id ? { ...p, cantidad: p.cantidad + 1 } : p
                )
            );
        } else {
            setProductosSeleccionados([...productosSeleccionados, { producto, cantidad: 1 }]);
        }
    };

    const handleRemoveProducto = (productoId: string) => {
        setProductosSeleccionados(productosSeleccionados.filter(p => p.producto._id !== productoId));
    };

    const handleCantidadChange = (productoId: string, cantidad: number) => {
        setProductosSeleccionados(
            productosSeleccionados.map(p =>
                p.producto._id === productoId ? { ...p, cantidad } : p
            )
        );
    };

    const calcularTotalVenta = () => {
        return productosSeleccionados.reduce((total, p) => total + p.cantidad * p.producto.precioVenta, 0);
    };

    const calcularIVA = () => {
        let iva10 = 0;
        let iva5 = 0;

        productosSeleccionados.forEach(p => {
            if (p.producto.Iva === '10%') {
                iva10 += (p.producto.precioVenta * p.cantidad) / 11;
            } else if (p.producto.Iva === '5%') {
                iva5 += (p.producto.precioVenta * p.cantidad) / 21;
            }
        });

        return { iva10, iva5 };
    };

    const handleSubmitVenta = async () => {
        setShowModalCobranza(true);
    };

    const handleConfirmarVenta = async () => {
        try {
            if (!ventaData.cliente) {
                setTitle('Favor seleccione un cliente');
                setShowModalAdvertencia(true);
                return;
            }
            const venta = {
                ...ventaData,
                productos: productosSeleccionados.map(p => ({
                    producto: p.producto._id,
                    cantidad: p.cantidad
                }))
            };

            const response = await axios.post('http://localhost:3001/ventas', venta);
            console.log('Venta creada:', response.data);
            // Guarda los detalles de la venta y muestra el modal de ticket
            setVentaRealizada(response.data);
            setShowModalTicket(true);
            // Reset form
            setVentaData(prevVentaData => ({
                ...prevVentaData,
                cliente: '',
                ruccliente: '',
                estado: 'activo',
            }));
            setProductosSeleccionados([]);
            setShowModalCobranza(false);
            setDineroCliente(0);
        } catch (error) {
            console.error('Error creating venta:', error);
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

    const buscarProductoPorCodigoBarra = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/productos/codigo-barra/${codigoBarra}`);
            const producto = response.data;

            if (producto) {
                handleSelectProducto(producto);
                setCodigoBarra(''); // Reset the input field
            } else {
                setShowModalAlerta(true);
            }
        } catch (error) {
            setShowModalAlerta(true);
        }
    };
    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            buscarProductoPorCodigoBarra();
        }
    };


    const totalVenta = calcularTotalVenta();
    const { iva10, iva5 } = calcularIVA();
    const vuelto = dineroCliente - totalVenta;

    const filteredProducts = productos.filter(producto =>
        producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        hayCajaAbiertaHoy ? (
            <div className="p-6">
                <h1 className='font-bold text-center border-b'>VENTAS</h1>
                <div className="grid grid-cols-2 justify-center">
                    <div className="mb-4 mr-20 ml-20">
                        <label className="block mb-2">Número Timbrado</label>
                        <input
                            type="text"
                            placeholder='22121321'
                            className="w-full p-2 border rounded"
                            value={ventaData.numeroTimbrado}
                            readOnly
                        />
                    </div>
                    <div className="mb-4 mr-20 ml-20">
                        <label className="block mb-2">Cliente</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={ventaData.cliente}
                            onChange={e => {
                                const clienteSeleccionado = clientes.find(cliente => cliente.nombreCliente === e.target.value);
                                setVentaData({ ...ventaData, cliente: e.target.value, ruccliente: clienteSeleccionado ? clienteSeleccionado.rucCliente : '' });
                            }}
                        >
                            <option value="">Seleccione un cliente</option>
                            {clientes.map(cliente => (
                                <option key={cliente._id} value={cliente.nombreCliente}>
                                    {cliente.nombreCliente}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 mr-20 ml-20">
                        <label className="block mb-2">RUC EMPRESA</label>
                        <input
                            type="text"
                            placeholder='RUCEMPRESA'
                            className="w-full p-2 border rounded"
                            value={ventaData.rucempresa}
                            readOnly
                        />
                    </div>
                    <div className="mb-4 mr-20 ml-20">
                        <label className="block mb-2">Comercial</label>
                        <input
                            type="text"
                            placeholder="Libreria Ejemplo"
                            className="w-full p-2 border rounded"
                            value={ventaData.comercial}
                            readOnly
                        />
                    </div>

                </div>
                <div className='flex justify-center'>
                    <Button
                        className="border-gray-300"
                        onClick={() => setShowModalProductos(true)}
                    >
                        Seleccionar Productos
                    </Button>
                </div>

                <div className="flex justify-center mt-4">
                    <input
                        type="text"
                        placeholder="Buscar por código de barra"
                        className="p-2 border rounded"
                        value={codigoBarra}
                        onChange={(e) => setCodigoBarra(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className="ml-2 bg-blue-500 text-white p-2 rounded"
                        onClick={buscarProductoPorCodigoBarra}
                    >
                        Buscar
                    </button>
                </div>
                <select>
                    <option value=""></option>
                </select>
                {showModalProductos && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold mb-4 border-b">Seleccionar Productos</h2>
                            <input
                                type="text"
                                placeholder="Buscar producto por nombre"
                                className="p-2 border rounded mb-4"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="overflow-y-auto max-h-64 border border-gray-300">
                                {filteredProducts.map(producto => (
                                    <div key={producto._id} className="mb-2 ">
                                        <div className="flex justify-between items-center ">
                                            <span>{producto.nombreProducto} - Gs.{producto.precioVenta}</span>
                                            <button
                                                className="bg-green-500 text-white p-1 rounded"
                                                onClick={() => handleSelectProducto(producto)}
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="mt-4 bg-red-500 text-white p-2 rounded"
                                onClick={() => setShowModalProductos(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
                {
                    showModalAlerta && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold mb-4">Alerta</h2>
                                <p>El código de barra no existe. Pruebe con otro producto.</p>
                                <button
                                    className="mt-4 bg-red-500 text-white p-2 rounded"
                                    onClick={() => setShowModalAlerta(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )
                }

                <h2 className="text-xl font-bold mt-6 mb-4 text-center">Productos Seleccionados</h2>
                <div className="overflow-x-auto max-h-60">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Producto</th>
                                <th className="px-4 py-2">Precio Unitario</th>
                                <th className="px-4 py-2">Iva</th>
                                <th className="px-4 py-2">Cantidad</th>
                                <th className="px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosSeleccionados.map(p => (
                                <tr key={p.producto._id}>
                                    <td className="border px-4 py-2">{p.producto.nombreProducto}</td>
                                    <td className="border px-4 py-2">Gs.{p.producto.precioVenta}</td>
                                    <td className="border px-4 py-2 font-bold">IVA{p.producto.Iva}</td>
                                    <td className="border px-4 py-2 w-[10%] ">
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full p-2 border rounded text-center"
                                            value={p.cantidad}
                                            onChange={e => handleCantidadChange(p.producto._id, parseInt(e.target.value))}
                                        />
                                    </td>
                                    <td className="border pt-3 pb-3 flex justify-center align-middle items-center">
                                        <button
                                            className="bg-red-500 text-white p-1 rounded"
                                            onClick={() => handleRemoveProducto(p.producto._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-between">
                    <h3 className="text-xl font-bold">Total: Gs.{totalVenta.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    <h3 className="text-xl font-bold">IVA 10%: Gs.{iva10.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    <h3 className="text-xl font-bold">IVA 5%: Gs.{iva5.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                </div>
                <div className='flex justify-center'>
                    <button
                        className="mt-6 border-gray-300"
                        onClick={handleSubmitVenta}
                    >
                        Crear Venta
                    </button>
                </div>

                {
                    showModalCobranza && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold mb-4">Cobranza</h2>
                                <div className="mb-4">
                                    <label className="block mb-2">Precio Venta</label>
                                    <div className="p-2 border rounded">Gs.{totalVenta.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Dinero del Cliente</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={dineroCliente.toLocaleString('es')}
                                        onChange={e => setDineroCliente(parseFloat(e.target.value.replace(/\D/g, '')))}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Vuelto / Cambio</label>
                                    <div className="p-2 border rounded">Gs.{vuelto.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                </div>
                                <button
                                    className="bg-green-500 text-white p-2 rounded"
                                    onClick={handleConfirmarVenta}
                                >
                                    Confirmar Venta
                                </button>
                                <button
                                    className="mt-4 bg-red-500 text-white p-2 rounded"
                                    onClick={() => setShowModalCobranza(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )
                },
                 <ModalAdvertencia
                    isVisible={showModalAdvertencia}
                    onClose={() => setShowModalAdvertencia(false)}
                    title={title}
                />
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
        ) : (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-center">No hay caja abierta para el día de hoy</h1>
            </div>
        )
    );
};

export default Ventas;
