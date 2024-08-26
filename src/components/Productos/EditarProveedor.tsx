import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import InputText from './InputText';
import Button from './Button';
/*import { AiFillDelete } from "react-icons/ai";
import fondo from '../../assets/fondo4.jpg';*/

const EditarProveedor: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombreEmpresa, setNombreEmpresa] = useState('');
    const [ruc, setRuc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');

    useEffect(() => {
        const fetchCategoria = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/proveedor/${id}`);
                setNombreEmpresa(res.data.nombreEmpresa);
                setRuc(res.data.ruc);
                setDireccion(res.data.direccion);
                setTelefono(res.data.telefono);
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };
        fetchCategoria();
    }, [id])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const categoria = { nombreEmpresa, ruc, direccion, telefono };
        try {
            const response = await axios.put(`http://localhost:3001/proveedor/${id}`, categoria);
            console.log("Por aqui viene", response.data);
            navigate('/proveedor')
        }
        catch {
            console.log(categoria)
            console.error('Error al actualizar el proveedor');
        }
    };
    const handleDeleteProveedor = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.delete(`http://localhost:3001/proveedor/${id}`);
            console.log("Eliminado" , response.data);
            navigate('/proveedor')

        }
        catch {
            console.error('Error al eliminar el proveedor');
        }
    } 
    const handleDeleteProveedorSinEvento = () => {
        const eventoFicticio = {
          preventDefault: () => {},
          // Puedes agregar aquí cualquier otra propiedad que necesites
        } as React.MouseEvent<HTMLButtonElement>;
      
        handleDeleteProveedor(eventoFicticio);
      };

    return (
        <form onSubmit={handleSubmit} >
            <h1 className='border-b w-full text-center font-bold mb-4'>Editar Proveedor</h1>
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
            <div className='flex justify-center'>
                <Button className='shadow-xl mt-2 ml-2  hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none' type='submit'>Actualizar</Button>
                <Button className='shadow-xl mt-2 ml-2  hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none' onClick={handleDeleteProveedorSinEvento} type='button'>Eliminar</Button>
            </div>
        </form>
    )
}

export default EditarProveedor;