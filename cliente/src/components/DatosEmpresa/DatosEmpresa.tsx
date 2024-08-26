import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Empresa {
    _id?: string;
    Comercial: string;
    Ruc: string;
    Timbrado: string;
    Telefono: string;
    Direccion: string;
}

const DatosEmpresa: React.FC = () => {
    const [empresaData, setEmpresaData] = useState<Empresa>({ Comercial: '', Ruc: '', Timbrado: '', Telefono: '', Direccion: '' });
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [showModalDatos, setShowModalDatos] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState<string>('')
    const [showAlertMensaje, setShowAlertMensaje] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const [editingEmpresaId, setEditingEmpresaId] = useState<string | null>(null);

    const fetchEmpresas = () => {
        axios.get('http://localhost:3001/datos-empresa')
            .then(response => {
                setEmpresas(response.data);
            })
            .catch(error => {
                console.error('Error fetching empresas:', error);
            });
    };

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmpresaData({ ...empresaData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validar que los campos no estén vacíos
    if (!empresaData.Comercial || !empresaData.Ruc || !empresaData.Timbrado || !empresaData.Telefono || !empresaData.Direccion) {
        console.error('Todos los campos son obligatorios');
        setMensajeAlerta("Todos los campos son obligatorios")
        setShowAlertMensaje(true)
        return;
    }
        if (isEditing && editingEmpresaId) {
            axios.put(`http://localhost:3001/datos-empresa/${editingEmpresaId}`, empresaData)
                .then(() => {
                    fetchEmpresas();
                    setMensajeAlerta("Datos Actualizados Correctamente")
                    setShowAlertMensaje(true)
                    resetForm();
                })
                .catch(error => {
                    console.error('Error updating empresa:', error);
                });
        } else {
            axios.post('http://localhost:3001/datos-empresa', empresaData)
                .then(() => {
                    setMensajeAlerta("Datos Creados Correctamente")
                    setShowAlertMensaje(true)
                    fetchEmpresas();
                    resetForm();
                })
                .catch(error => {
                    console.error('Error creating empresa:', error);
                    setMensajeAlerta("Error al Crear Datos de Empresa")
                    setShowAlertMensaje(true)
                });
        }
    };

    const handleEdit = (empresa: Empresa) => {
        setIsEditing(true);
        setEditingEmpresaId(empresa._id!);
        setEmpresaData(empresa);
    };

    const handleDelete = (empresaId: string) => {
        axios.delete(`http://localhost:3001/datos-empresa/${empresaId}`)
            .then(() => {
                fetchEmpresas();
                setMensajeAlerta("Datos Eliminados Correctamente")
                setShowAlertMensaje(true)
            })
            .catch(error => {
                console.error('Error deleting empresa:', error);
            });
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingEmpresaId(null);
        setEmpresaData({ Comercial: '', Ruc: '', Timbrado: '', Telefono: '', Direccion: '' });
    };

    return (
        <div className="p-6">
            <h1 className="text- font-bold border-b mb-4 text-center">{isEditing ? 'Editar Empresa' : 'Crear Empresa'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className='grid grid-cols-3 gap-4'>
                    <input
                        type="text"
                        name="Comercial"
                        placeholder="Comercial"
                        value={empresaData.Comercial}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="Ruc"
                        placeholder="Ruc"
                        value={empresaData.Ruc}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="Timbrado"
                        placeholder="Timbrado"
                        value={empresaData.Timbrado}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="Telefono"
                        placeholder="Telefono"
                        value={empresaData.Telefono}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="Direccion"
                        placeholder="Direccion"
                        value={empresaData.Direccion}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className='flex justify-center'>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        {isEditing ? 'Actualizar Empresa' : 'Crear Empresa'}
                    </button>
                    <button
                        className="ml-3 bg-blue-500 text-white p-2 rounded"
                        type="button"
                        onClick={() => setShowModalDatos(true)}
                    >
                        Ver Datos Empresas
                    </button>
                </div>
            </form>

            {
                showModalDatos && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                            <h2 className="text-xl font-bold mb-4 text-center border-b">Datos de Empresas</h2>
                            <div className="overflow-x-auto max-h-60">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2">Comercial</th>
                                            <th className="px-4 py-2">Ruc</th>
                                            <th className="px-4 py-2">Timbrado</th>
                                            <th className="px-4 py-2">Telefono</th>
                                            <th className="px-4 py-2">Direccion</th>
                                            <th className="px-4 py-2">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {empresas.map(empresa => (
                                            <tr key={empresa._id}>
                                                <td className="border px-4 py-2">{empresa.Comercial}</td>
                                                <td className="border px-4 py-2">{empresa.Ruc}</td>
                                                <td className="border px-4 py-2">{empresa.Timbrado}</td>
                                                <td className="border px-4 py-2">{empresa.Telefono}</td>
                                                <td className="border px-4 py-2">{empresa.Direccion}</td>
                                                <td className="border px-4 py-4 flex">
                                                    <button
                                                        className="bg-yellow-500 text-white p-1 rounded mr-2"
                                                        onClick={() => handleEdit(empresa)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white p-1 rounded"
                                                        onClick={() => handleDelete(empresa._id!)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button
                                className="mt-4 bg-red-500 text-white p-2 rounded"
                                onClick={() => setShowModalDatos(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )
            }
             { showAlertMensaje && (
                <div className="modal-background" onClick={() => setShowAlertMensaje(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h1 className='font-bold border-b text-center'>{mensajeAlerta}</h1>
                       <div className='flex justify-center'>
                        <button className='mt-4 border border-gray-300' onClick={() => setShowAlertMensaje(false)}>Aceptar</button>
                        </div>
                    </div>
                </div>
            
            )}
        </div>
    );
};

export default DatosEmpresa;