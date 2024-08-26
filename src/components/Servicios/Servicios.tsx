import React, { useState } from 'react';
import Button from '../Productos/Button';
import InputText from '../Productos/InputText';
import axios from 'axios';

const Servicios: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [categorias, setCategorias] = useState([] as any[]);
    const [servicios, setServicios] = useState([] as any[]);
    const [showModalServicios, setShowModalServicios] = useState(false);
    const [showModalCategorias, setShowModalCategorias] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const crearServicio = async () => {
        if (editingId) {
            await axios.patch(`http://localhost:3001/tiposervicio/${editingId}`, { nombre, categoria });
            setEditingId(null);
        } else {
            await axios.post('http://localhost:3001/tiposervicio', { nombre, categoria });
        }
        setNombre('');
        setCategoria('');
    };

    const getServicios = async () => {
        const rest = await axios.get('http://localhost:3001/tiposervicio');
        setServicios(rest.data);
    }

    const handleShowModalServicios = async () => {
        await getServicios();
        setShowModalServicios(true);
    };

    const handleEditServicio = (servicio: any) => {
        setNombre(servicio.nombre);
        setCategoria(servicio.categoria);
        setEditingId(servicio._id);
        setShowModalServicios(false);
    };

    const handleEliminarServicio = async (id: string) => {
        await axios.delete(`http://localhost:3001/tiposervicio/${id}`);
        await getServicios();
    }

    const handleCategorias = async () => {
        const res = await axios.get('http://localhost:3001/categoriatiposervicio');
        console.log(res.data);
        setShowModalCategorias(true);
        setCategorias(res.data);
    }
    const handleSeleccionarCategoria = (nombreCategoria: string) => {
        setCategoria(nombreCategoria);
        setShowModalCategorias(false);
    }

    return (
        <>
            <div>
                <h1 className='text-center font-bold border-b'>CREAR SERVICIOS</h1>
                <div className='flex flex-col gap-5 justify-center items-center mt-4'>
                    <InputText value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
                    <div className='flex'>

                        <InputText value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Categoria" />
                        <Button className='!mt-0' onClick={handleCategorias}>Seleccionar</Button>
                    </div>
                    <Button className='border !mt-0 border-black' onClick={crearServicio}>{editingId ? 'Actualizar Servicio' : 'Crear Servicio'}</Button>
                </div>
                <div className=' flex justify-center mt-4'>
                    <Button className='border !mt-0 border-black' onClick={handleShowModalServicios}>Ver Servicios</Button>
                </div>
            </div>
            {showModalServicios && (
                <div className="modal-background">
                    <div className="modal-content">
                        <h2 className='text-center font-bold border-b'>LISTADO DE SERVICIOS</h2>
                        <div className='overflow-auto h-64'>
                            <table className='table-auto border w-full !text-center'>
                                <thead>
                                    <tr>
                                        <th className='border'>N°</th>
                                        <th className='border'>Nombre</th>
                                        <th className='border'>Categoria</th>
                                        <th className='border'>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {servicios.map((servicio, index) => (
                                        <tr key={servicio._id}>
                                            <td className='border'>{index + 1}</td>
                                            <td className='border'>{servicio.nombre}</td>
                                            <td className='border'>{servicio.categoria}</td>
                                            <td className='border'>
                                                <Button className='mb-3 mr-3 border border-black' onClick={() => handleEditServicio(servicio)}>Editar</Button>
                                                <Button className='mb-3 border border-black' onClick={() => handleEliminarServicio(servicio._id)}>Eliminar</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='flex justify-center'>
                            <Button className='border border-black' onClick={() => setShowModalServicios(false)}>Cerrar</Button>
                        </div>
                    </div>
                </div>
            )}
            {showModalCategorias && (
                <div className="modal-background">
                    <div className="modal-content">
                        <h2 className='text-center font-bold border-b'>LISTADO DE CATEGORIAS</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th className='border'>categoría</th>
                                    <th className='border'>Accion</th>
                                    {/* Agrega aquí más encabezados de columna si tus categorías tienen más propiedades */}
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map((categoria, index) => (
                                    <tr key={index}>
                                        <td className='border'>{categoria.nombre}</td>
                                        <td className='border'><Button type='button' onClick={() => handleSeleccionarCategoria(categoria.nombre)}>Seleccionar</Button></td>   
                                        {/* Agrega aquí más celdas si tus categorías tienen más propiedades */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='flex justify-center'>
                            <Button className='border border-black' onClick={() => setShowModalCategorias(false)}>Cerrar</Button>
                        </div>
                    </div>
                </div>

            )}

        </>
    );
};

export default Servicios;