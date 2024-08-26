import React, { useState } from 'react';
import InputText from './InputText';
import Button from './Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Proveedor: React.FC = () => {
    const [nombreEmpresa, setNombreEmpresa] = useState('');
    const [ruc, setRuc] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [showModalAlert, setShowModalAlert] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [categorias, setCategorias] = useState([]);
    const navigate = useNavigate();


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const proveedor = {
            nombreEmpresa,
            ruc,
            direccion,
            telefono
        }

        //Verificación si nada esta vacio
        if (!nombreEmpresa|| !ruc || !direccion|| !telefono) {
            console.log(proveedor)
            setMensajeAlerta('Todos los campos son obligatorios');
            setShowModalAlert(true);
            return;
        }
        try {
             await axios.post('http://localhost:3001/proveedor', proveedor);
            setMensajeAlerta('Proveedor creado correctamente');
            setShowModalAlert(true);

        } catch(error) {
            console.error('Error al crear el proveedor:');
        }
    };
    const handleShowModal = async () => {
        try {
            const response = await axios.get('http://localhost:3001/proveedor');
            console.log(response.data);
            setCategorias(response.data);
            setShowModal(true);
        }
        catch (error) {
            console.error('Error al obtener los proveedores:', error);
        }


    };
    const handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1 className='border-b w-full text-center font-bold mb-4'>Proveedor</h1>
            <div className="grid grid-cols-2 gap-1 ml-9 mr-9">
                <div className="max-w-md">
                    <InputText id="nombreEmpresa" label="Nombre de la Empresa" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} />
                    <InputText id="ruc" label="Ruc Empresa" value={ruc} onChange={(e) => setRuc(e.target.value)} />
                </div>
                <div className="max-w-md">
                    <InputText id="direccion" label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                    <InputText id="telefono" label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>
            </div>
            <div className='flex justify-center mt-3'>
                <Button className='mr-3' type='submit'>Crear Proveedor</Button>
                <Button onClick={handleShowModal} type="button">Ver Proveedores</Button>
            </div>
            {showModal && (
                <div className="modal-background" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h1 className='border-b font-bold text-center text-'>Categorías</h1>
                        <table className='table-auto border w-full'>
                            <thead>
                                <tr className='bg-gray-800 text-white'>
                                    <th className="border-r">N°:</th>
                                    <th className="border-r">Nombre:</th>
                                    <th className="border-r">RUC:</th>
                                    <th className="border-r">Dirección:</th>
                                    <th className="border-r">Teléfono:</th>
                                    <th className='border-r'>Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map((categoria, index) => (
                                    <tr key={categoria._id}>
                                        <td className="border">{index + 1}</td>
                                        <td className="border">{categoria.nombreEmpresa}</td>
                                        <td className="border">{categoria.ruc}</td>
                                        <td className="border">{categoria.direccion}</td>
                                        <td className="border">{categoria.telefono}</td>
                                        <td><Button type='button' onClick={()=>navigate (`/editarproveedor/${categoria._id}`)}>Editar</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Button onClick={handleCloseModal}>Cerrar</Button>
                    </div>
                </div>
            )}
            { showModalAlert && (
                <div className="modal-background" onClick={() => setShowModalAlert(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h1 className='font-bold border-b text-center'>{mensajeAlerta}</h1>
                       <div className='flex justify-center'>
                        <button className='mt-4 border border-gray-300' onClick={() => setShowModalAlert(false)}>Aceptar</button>
                        </div>
                    </div>
                </div>
            
            )}
        </form>
    );
};

export default Proveedor;