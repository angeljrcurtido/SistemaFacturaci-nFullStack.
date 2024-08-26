import React, { useState } from 'react';
import Button from '../Productos/Button';
import InputText from '../Productos/InputText';
import axios from 'axios';

const CategoriaServicio: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [servicios, setServicios] = useState([] as any[]);
  const [showModalServicios, setShowModalServicios] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const crearServicio = async () => {
    if (editingId) {
      await axios.patch(`http://localhost:3001/categoriatiposervicio/${editingId}`, { nombre});
      setEditingId(null);
    } else {
      await axios.post('http://localhost:3001/categoriatiposervicio', { nombre });
    }
    setNombre('');
    handleShowModalServicios();
  };

  const getServicios = async () => {
    const rest = await axios.get('http://localhost:3001/categoriatiposervicio');
    setServicios(rest.data);
  }

  const handleShowModalServicios = async () => {
    await getServicios();
    setShowModalServicios(true);
  };

  const handleEditServicio = (servicio: any) => {
    setNombre(servicio.nombre);
    setEditingId(servicio._id);
    setShowModalServicios(false);
  };

  const handleEliminarServicio = async (id: string) => { 
    await axios.delete(`http://localhost:3001/categoriatiposervicio/${id}`);
    await getServicios();
  }

  return (
    <>
      <div>
        <h1 className='text-center font-bold border-b'>CREAR SERVICIOS</h1>
        <div className='flex gap-5 justify-center items-center mt-4'>
          <InputText value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
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
            <table className='table-auto border w-full text-center'>
              <thead>
                <tr>
                  <th className='border'>N°</th>
                  <th className='border'>Nombre</th>
                  <th className='border'>Acción</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((servicio, index) => (
                  <tr key={servicio._id}>
                    <td className='border'>{index + 1}</td>
                    <td className='border'>{servicio.nombre}</td>
                    <td className='border'>
                        <Button className='mb-3 mr-3 border border-black' onClick={() => handleEditServicio(servicio)}>Editar</Button>
                        <Button className='mb-3 border border-black' onClick={()=>handleEliminarServicio(servicio._id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex justify-center'>
              <Button className='border border-black' onClick={() => setShowModalServicios(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriaServicio;