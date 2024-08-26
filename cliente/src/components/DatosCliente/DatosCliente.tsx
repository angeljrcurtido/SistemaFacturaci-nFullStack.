import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Cliente {
    _id?: string;
    nombreCliente: string;
    rucCliente: string;
    direccionCliente: string;
}

const DatosClientes: React.FC = () => {
    const [clienteData, setClienteData] = useState<Cliente>({ nombreCliente: '', rucCliente: '', direccionCliente: '' });
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [showModalClientes, setShowModalClientes] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState<string>('')  
    const [showModalAlert, setShowModalAlert] = useState(false)
    const [editingClienteId, setEditingClienteId] = useState<string | null>(null);

    const fetchClientes = () => {
        axios.get('http://localhost:3001/datos-cliente')
            .then(response => {
                setClientes(response.data);
            })
            .catch(error => {
                console.error('Error fetching clientes:', error);
            });
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClienteData({ ...clienteData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validar que los campos no estén vacíos
        if (!clienteData.nombreCliente || !clienteData.rucCliente || !clienteData.direccionCliente) {
            console.error('Todos los campos son obligatorios');
            setMensajeAlerta("Todos los campos son obligatorios")
            setShowModalAlert(true)
            return;
        }
        if (isEditing && editingClienteId) {
            axios.put(`http://localhost:3001/datos-cliente/${editingClienteId}`, clienteData)
                .then(() => {
                    setMensajeAlerta("Cliente actualizado correctamente")
                    setShowModalAlert(true)
                    fetchClientes();
                    
                    resetForm();
                })
                .catch(error => {
                    setMensajeAlerta("Error al actualizar el cliente")
                    setShowModalAlert(true)
                    console.error('Error updating cliente:', error);
                });
        } else {
            axios.post('http://localhost:3001/datos-cliente', clienteData)
                .then(() => {
                    setMensajeAlerta("Cliente creado correctamente")
                    setShowModalAlert(true)
                    fetchClientes();
                    resetForm();
                })
                .catch(error => {
                    setMensajeAlerta("Error al crear el cliente")
                    setShowModalAlert(true)
                    console.error('Error creating cliente:', error);
                });
        }
    };

    const handleEdit = (cliente: Cliente) => {
        setIsEditing(true);
        setEditingClienteId(cliente._id!);
        setClienteData(cliente);
    };

    const handleDelete = (clienteId: string) => {
        axios.delete(`http://localhost:3001/datos-cliente/${clienteId}`)
            .then(() => {
                setMensajeAlerta("Cliente eliminado correctamente")
                setShowModalAlert(true) 
                fetchClientes();
            })
            .catch(error => {
                setMensajeAlerta("Error al eliminar el cliente")
                setShowModalAlert(true)
                console.error('Error deleting cliente:', error);
            });
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingClienteId(null);
        setClienteData({ nombreCliente: '', rucCliente: '', direccionCliente: '' });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl text-center font-bold mb-4 border-b">{isEditing ? 'Editar Cliente' : 'Crear Cliente'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="nombreCliente"
                    placeholder="Nombre Cliente"
                    value={clienteData.nombreCliente}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="rucCliente"
                    placeholder="RUC Cliente"
                    value={clienteData.rucCliente}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="direccionCliente"
                    placeholder="Dirección Cliente"
                    value={clienteData.direccionCliente}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
                <div className="flex justify-center gap-4">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    {isEditing ? 'Actualizar Cliente' : 'Crear Cliente'}
                </button>
                <button
                className=" bg-blue-500 text-white p-2 rounded"
                type="button"
                onClick={() => setShowModalClientes(true)}
            >
                Ver Datos Clientes
            </button>
            </div>
            </form>
      
            {
                showModalClientes && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                            <h2 className="text-xl font-bold mb-4 text-center border-b">Datos de Clientes</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2">Nombre</th>
                                            <th className="px-4 py-2">RUC</th>
                                            <th className="px-4 py-2">Dirección</th>
                                            <th className="px-4 py-2">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clientes.map(cliente => (
                                            <tr key={cliente._id}>
                                                <td className="border px-4 py-2">{cliente.nombreCliente}</td>
                                                <td className="border px-4 py-2">{cliente.rucCliente}</td>
                                                <td className="border px-4 py-2">{cliente.direccionCliente}</td>
                                                <td className="border px-4 py-2 flex justify-center">
                                                    <button
                                                        className="bg-yellow-500 text-white p-1 rounded mr-2"
                                                        onClick={() => handleEdit(cliente)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white p-1 rounded"
                                                        onClick={() => handleDelete(cliente._id!)}
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
                                onClick={() => setShowModalClientes(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )
            }
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
        </div>
    );
};

export default DatosClientes;