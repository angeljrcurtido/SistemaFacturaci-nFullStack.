import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Categoria {
    _id: number;
    nombre: string;
}

const Categoria = () => {
    const [nombre, setNombre] = useState('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [editNombre, setEditNombre] = useState('');

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Valor inicial 5 ítems por página

    useEffect(() => {
        const fetchCategorias = async () => {
            const response = await axios.get('http://localhost:3001/categorias');
            setCategorias(response.data);
        };

        fetchCategorias();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post<Categoria>('http://localhost:3001/categorias', { nombre });
            setCategorias([...categorias, response.data]);
            setNombre('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = async (_id: number) => {
        const response = await axios.get(`http://localhost:3001/categorias/${_id}`);
        setEditId(_id);
        setEditNombre(response.data.nombre);
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.put(`http://localhost:3001/categorias/${editId}`, { nombre: editNombre });
            setCategorias(categorias.map(categoria => categoria._id === editId ? response.data : categoria));
            setEditId(null);
            setEditNombre('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (_id: number) => {
        try {
            await axios.delete(`http://localhost:3001/categorias/${_id}`);
            setCategorias(categorias.filter(categoria => categoria._id !== _id));
        } catch (error) {
            console.error(error);
        }
    };

    // Cálculo de la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategorias = categorias.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(categorias.length / itemsPerPage);

    return (
        <div className="w-full h-full flex flex-col items-center justify-start">
            <h1 className="text-4xl font-bold text-center text-gray-800 py-2 border-b w-full">Cargar Categorias</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex items-center mt-2 mb-2">
                    <label htmlFor="nombre" className="font-medium mr-2">Categoria:</label>
                    <input className="border rounded-md w-full h-10" id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <button className="ml-[30%] shadow-xl hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none" type="submit">Crear categoría</button>
            </form>
            {editId && (
                <form onSubmit={handleUpdate} className="mb-4 ml-12 flex flex-col items-center">
                    <label htmlFor="editNombre">Editar Categoria:</label>
                    <input className="border rounded-md w-full h-10" id="editNombre" type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} required />
                    <button className="shadow-xl mt-2 hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none" type="submit">Actualizar categoría</button>
                </form>
            )}
           
            <div className="rounded-lg overflow-x-auto max-h-[400px]">
                <table className="table-auto border w-full">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="px-4 border">N°</th>
                            <th className="px-4 border">Categorias</th>
                            <th className="px-4 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategorias.map((categoria, index) => (
                            <tr key={categoria._id}>
                                <td className="px-4 border">{indexOfFirstItem + index + 1}</td>
                                <td className="px-4 border">{categoria.nombre}</td>
                                <td className="px-4 border">
                                    <button className="mr-3 mt-2 mb-2 shadow-xl hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none" onClick={() => handleEdit(categoria._id)}>Editar</button>
                                    <button className="shadow-xl hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none" onClick={() => handleDelete(categoria._id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center w-full mb-4 mt-3">
                <select className="border rounded-md p-2" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                    <option value={5}>5 ítems por página</option>
                    <option value={10}>10 ítems por página</option>
                </select>
                <div>
                    <button
                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 mr-2 border rounded-md shadow-md hover:bg-gray-800 hover:text-white"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : currentPage)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-md shadow-md hover:bg-gray-800 hover:text-white"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Categoria;
