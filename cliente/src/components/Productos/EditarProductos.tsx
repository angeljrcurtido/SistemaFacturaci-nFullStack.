import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AiFillDelete } from "react-icons/ai";
import InputText from './InputText'

const EditarProductos: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState<any>(null); // Se usa any para evitar problemas con productos sin codigoBarra
    console.log('Probando' + id);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/productos/${id}`);
                // Si el producto no tiene codigoBarra, se añade un campo vacío
                const productoData = res.data;
                if (!productoData.codigoBarra) {
                    productoData.codigoBarra = '';
                }
                setProducto(productoData);
                console.log(productoData);
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };

        fetchProducto();
    }, [id]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const updatedProducto = {
            ...producto,
            [event.target.id]: event.target.value
        };

        setProducto(updatedProducto);
        console.log(updatedProducto);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const res = await axios.put(`http://localhost:3001/productos/${id}`, producto);
            setProducto(res.data);
            console.log('Funciona' + res.data);
            navigate('/productos');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    const handleSubmitDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        try {
            const res = await axios.delete(`http://localhost:3001/productos/${id}`);
            console.log('Funciona eliminado' + res.data);
            navigate('/productos');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    if (!producto) {
        return <p>Cargando...</p>;
    }

    const fecha = new Date(producto.fechaVencimiento);
    const fechaInput = fecha.toISOString().split('T')[0];

    return (
        <form onSubmit={handleSubmit} className="w-full h-full">
            <h1 className='font-bold text-center border-b w-full'>Editar Productos</h1>
            {producto ? (
                <div className="grid grid-cols-3 gap-4 ml-9 mr-9">
                    <div>
                        <InputText id="nombreProducto" label="Nombre Producto" value={producto.nombreProducto} onChange={handleChange} />
                        <div className='flex'>
                            <InputText type='number' id="precioVenta" label="Precio Venta" value={producto.precioVenta} onChange={handleChange} />
                            <button type='button' className='ml-2 mt-6 shadow-xl hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none' onClick={() => setProducto({ ...producto, precioVenta: '' })}><AiFillDelete /></button>
                        </div>
                        <div className='flex'>
                            <InputText type='number' id="precioCompra" label="Precio Compra" value={producto.precioCompra} onChange={handleChange} />
                            <button type='button' className='ml-2 mt-6 shadow-xl hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none' onClick={() => setProducto({ ...producto, precioCompra: '' })}><AiFillDelete /></button>
                        </div>
                    </div>

                    <div>
                        <InputText id="proveedor" label="Proveedor" value={producto.proveedor} onChange={handleChange} />
                        <div className='flex'>
                            <InputText id="stockActual" type="number" label="Stock actual" value={producto.stockActual} onChange={handleChange} />
                            <button type='button' className='ml-2 mt-6 shadow-xl hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none' onClick={() => setProducto({ ...producto, stockActual: '' })}><AiFillDelete /></button>
                        </div>
                        <div className='flex'>
                            <InputText id="stockMinimo" type="number" label="Stock mínimo" value={producto.stockMinimo} onChange={handleChange} />
                            <button type='button' className='ml-2 mt-6 shadow-xl hover:bg-gray-800 hover:text-white transform hover: scale-110 transition-all duration-200 hover:border-none' onClick={() => setProducto({ ...producto, stockMinimo: '' })}><AiFillDelete /></button>
                        </div>
                    </div>
                    <div>
                        <InputText id="ubicacion" label="Ubicación" value={producto.ubicacion} onChange={handleChange} />
                        <InputText id="unidadMedida" label="Unidad de Medida" value={producto.unidadMedida} onChange={handleChange} />
                        <InputText id="categoria" label="Categoria" value={producto.categoria} onChange={handleChange} />
                        <InputText id="codigoBarra" label="Código de Barra" value={producto.codigoBarra} onChange={handleChange} /> {/* Nuevo campo de entrada */}
                    </div>
                    <div>
                        <InputText type='date' id="fechaVencimiento" label="Fecha de vencimiento" value={fechaInput} onChange={handleChange} />
                    </div>
                    <select className="shadow-sm w-[20%] mt-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" onChange={handleChange} id="Iva">
                        <option value={producto.Iva}>{producto.Iva}</option>
                        {producto.Iva === "10%" ? (
                            <option value="5%">5%</option>
                        ) : (
                            <option value="10%">10%</option>
                        )}
                    </select>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
            <div className='flex justify-center gap-3'>
                <button className='shadow-xl hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none' type='submit'>Guardar</button>
                <button className='shadow-xl hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none' onClick={handleSubmitDelete} type='button'>Eliminar</button>
            </div>
        </form>
    );
}

export default EditarProductos;