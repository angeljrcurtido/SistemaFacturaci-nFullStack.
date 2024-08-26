import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DetallesCajaModal from './DetallesCajaModal';

const HistorialCaja: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [estado, setEstado] = useState<string>(''); // Estado para filtro de estado
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedCaja, setSelectedCaja] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/caja');
                // Ordenar los datos por fecha de apertura, de más reciente a más antiguo
                const sortedData = response.data.sort((a, b) => new Date(b.fechaApertura).getTime() - new Date(a.fechaApertura).getTime());

                setData(sortedData);
                setFilteredData(sortedData);
                console.log(sortedData);
                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filterData = () => {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const filtered = data.filter(caja => {
            const date = new Date(caja.fechaApertura);
            const matchesDate = (!start || date >= start) && (!end || date <= end);
            const matchesEstado = !estado || caja.estado === estado;
            return matchesDate && matchesEstado;
        });

        setFilteredData(filtered);
    };

    const openModal = (caja: any) => {
        setSelectedCaja(caja);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedCaja(null);
    };

    if (loading) return <div className="text-center mt-4">Loading...</div>;
    if (error) return <div className="text-center mt-4 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 overflow-auto h-[500px]">
            <h1 className="font-bold text-center">Historial Cajas</h1>
            <div className="mb-4 flex flex-row gap-4 justify-center border rounded">
                <div className="flex">
                    <label className="mt-4 font-bold" htmlFor="">Fecha Inicio:</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="flex">
                    <label className="mt-4 font-bold" htmlFor="">Fecha Fin:</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="flex">
                    <label className="mt-4 font-bold" htmlFor="">Estado:</label>
                    <select value={estado} onChange={e => setEstado(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="abierto">Abierto</option>
                        <option value="cerrado">Cerrado</option>
                    </select>
                </div>
                <button className="mt-2 mb-2 border border-gray-300" onClick={filterData}>Filtrar</button>
            </div>
            <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <tr>
                        <th className="py-3 px-4 border-b border-gray-200">Fecha Apertura</th>
                        <th className="py-3 px-4 border-b border-gray-200">Fecha Cierre</th>
                        <th className="py-3 px-4 border-b border-gray-200">Monto Inicial</th>
                        <th className="py-3 px-4 border-b border-gray-200">Monto Final</th>
                        <th className="py-3 px-4 border-b border-gray-200">Estado</th>
                        <th className="py-3 px-4 border-b border-gray-200">Situación Caja</th>
                        <th className="py-3 px-4 border-b border-gray-200">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {filteredData.map((caja) => (
                        <tr key={caja._id} className="text-center hover:bg-gray-100 transition-colors duration-200">
                            <td className="py-3 px-4 border-b border-gray-200">{new Date(caja.fechaApertura).toLocaleString()}</td>
                            <td className="py-3 px-4 border-b border-gray-200">{caja.fechaCierre ? new Date(caja.fechaCierre).toLocaleString() : 'N/A'}</td>
                            <td className="py-3 px-4 border-b border-gray-200">{caja.montoInicial}</td>
                            <td className="py-3 px-4 border-b border-gray-200">{caja.montoFinal ? caja.montoFinal : 'N/A'}</td>
                            <td className="py-3 px-4 border-b border-gray-200">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                        ${caja.estado === 'abierto' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                    {caja.estado}
                                </span>
                            </td>
                            <td className="py-3 px-4 border-b border-gray-200">{caja.situacionCaja}</td>
                            <td className="py-3 px-4 border-b border-gray-200">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105" onClick={() => openModal(caja)}>Detalles</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <DetallesCajaModal isOpen={showModal} onClose={closeModal} caja={selectedCaja} />
        </div>
    );
};

export default HistorialCaja;
