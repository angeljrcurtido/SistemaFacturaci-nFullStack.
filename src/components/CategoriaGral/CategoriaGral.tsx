import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  nombreProducto: string;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  fechaVencimiento: string;
  stockMinimo: number;
  Iva: string;
  stockActual: number;
  ubicacion: string;
  proveedor: string;
  unidadMedida: string;
  codigoBarra: string;
  __v: number;
}

interface CategoriaGral {
  _id: string;
  nombre: string;
  subCategorias: string[];
  __v: number;
}

const CategoriaGralComponent = () => {
  const [nombre, setNombre] = useState('');
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriaGral, setCategoriaGral] = useState<CategoriaGral[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const nombreExiste = categoriaGral.some(categoria => categoria.nombre.toLowerCase() === nombre.toLowerCase() && categoria._id !== editId);
    if (nombreExiste) {
      setError('El nombre de la categoría ya existe. Por favor, elige otro nombre.');
      setLoading(false);
      return;
    }

    try {
      if (editMode && editId) {
        const response = await axios.put(`http://localhost:3001/categoriasgral/${editId}`, {
          nombre,
          subCategorias: selectedSubCategories,
        });
        setCategoriaGral(categoriaGral.map(categoria => (categoria._id === editId ? response.data : categoria)));
        setSuccess(true);
        setEditMode(false);
        setEditId(null);
      } else {
        const response = await axios.post('http://localhost:3001/categoriasgral', {
          nombre,
          subCategorias: selectedSubCategories,
        });
        setCategoriaGral([...categoriaGral, response.data]);
        setSuccess(true);
      }
      setNombre('');
      setSelectedSubCategories([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get<Product[]>('http://localhost:3001/productos');
      setProducts(response.data || []);
      setIsProductsLoading(false);
      const uniqueCategories = Array.from(new Set(response.data.map(product => product.categoria)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setIsProductsLoading(false);
    }
  };

  const getCategoriaGral = async () => {
    try {
      const response = await axios.get<CategoriaGral[]>('http://localhost:3001/categoriasgral');
      setCategoriaGral(response.data || []);
    } catch (error) {
      console.error("Error al obtener las categorías generales:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/categoriasgral/${id}`);
      setCategoriaGral(categoriaGral.filter(categoria => categoria._id !== id));
    } catch (error) {
      console.error("Error al eliminar la categoría general:", error);
    }
  };

  const handleEdit = (categoria: CategoriaGral) => {
    setEditMode(true);
    setEditId(categoria._id);
    setNombre(categoria.nombre);
    setSelectedSubCategories(categoria.subCategorias);
  };

  useEffect(() => {
    getProducts();
    getCategoriaGral();
  }, []);

  const handleCheckboxChange = (category: string) => {
    setSelectedSubCategories(prev =>
      prev.includes(category) ? prev.filter(subCategory => subCategory !== category) : [...prev, category]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">{editMode ? 'Editar Categoría General' : 'Crear Categoría General'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">SubCategorías:</label>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full bg-gray-500 text-white font-semibold py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Seleccionar SubCategorías
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Guardando...' : editMode ? 'Guardar Cambios' : 'Crear Categoría'}
          </button>
        </form>
        {loading && <p className="text-blue-500 mt-4">Guardando...</p>}
        {error && <p className="text-red-500 mt-4">Error: {error}</p>}
        {success && <p className="text-green-500 mt-4">¡Éxito!</p>}
      </div>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Categorías Generales Existentes</h2>
        <div className="overflow-x-auto max-h-20">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
              <th className="py-2 px-4 border-b">N°</th>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">SubCategorías</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categoriaGral.map((categoria, index) => (
                <tr key={categoria._id}>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{categoria.nombre}</td>
                  <td className="py-2 px-2 border-b">
                    {categoria.subCategorias.join(', ')}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(categoria)}
                      className="bg-yellow-500 text-xs w-[55px] text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(categoria._id)}
                      className="bg-red-500 text-xs w-[55px] text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Seleccionar SubCategorías</h2>
            {isProductsLoading ? (
              <p className="text-blue-500">Cargando categorías...</p>
            ) : (
              <div className="flex flex-col space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedSubCategories.includes(category)}
                      onChange={() => handleCheckboxChange(category)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Cancelar
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriaGralComponent;
