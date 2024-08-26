import axios from "axios";
import { BiSolidCategory } from "react-icons/bi";
import { FcNeutralTrading } from "react-icons/fc";
import { BsCartCheck } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useCartStore } from './Productos/useCartStore.ts';
import { useNavigate } from "react-router-dom";
import './style.css';
const Navbar2 = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoriasGral, setCategoriasGral] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
 
 
  const [isShaking, setIsShaking] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const getCategoriasGral = async (): Promise<any[]> => {
    const response = await axios.get<any[]>('https://serversisweb-1.onrender.com/categoriasgral');
    return response.data || [];
  };

  const getProductos = async (): Promise<any[]> => {
    const response = await axios.get<any[]>('https://serversisweb-1.onrender.com/productos');
    return response.data || [];
  };

 
  useEffect(() => {
    if (totalItems > 0) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500); // Duración de la animación
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataCategorias, dataProductos] = await Promise.all([getCategoriasGral(), getProductos()]);
        setCategoriasGral(dataCategorias);
        setProductos(dataProductos);
        console.log("Datos de landing", dataProductos)
        if (dataCategorias.length > 0) {
          setSelectedCategory(dataCategorias[0].nombre);
        }
      } catch (error) {
        console.error("Error al obtener las categorías generales o productos:", error);
      }
    };
    fetchData();
  }, []);

  const handleNavigation = (producto: any) => {
    console.log("Datos antes de enviar", producto)
    navigate("/product", { state: { productData: producto } });
    setIsModalVisible(false);
  };
 
  const filteredSubCategorias = categoriasGral.find(categoria => categoria.nombre === selectedCategory)?.subCategorias || [];

  return (
    <div>
      <div className=" bg-[#98b8ff]  text-white flex flex-wrap items-center justify-between mx-auto p-4 !m-0 w-full">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl whitespace-nowra text-white font-bold">SisVentas</span>
        </a>
        <div className="flex md:order-2">
          <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
            <span className="sr-only">Search</span>
          </button>
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input type="text" id="search-navbar" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." />

          </div>
          <button data-collapse-toggle="navbar-search" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-search" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <BsCartCheck onClick={()=>navigate (`/listacarrito`)}  className={`text-4xl ${isShaking ? 'shake' : ''}`} />
          {totalItems > 0 && (
            <span className={`absolute top-4 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex text-xs items-center justify-center ${isShaking ? 'shake' : ''}`}>
              {totalItems}
            </span>
          )}
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input type="text" id="search-navbar" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." />
          </div>
          <button onClick={() => setIsModalVisible(true)} className="block py-2 px-3 text-white font-bold text-2xl  rounded md:bg-transparent" aria-current="page">Inicio</button>
          {isModalVisible && (
            <>
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <div className="bg-white max-w-[500px] min-w-[500px] p-6 rounded-lg shadow-lg">
                <div className="flex justify-end">
              <button className="bg-gray-400" onClick={() => setIsModalVisible(false)}>Cerrar</button>
              </div>
              <div className="flex flex-row">
                <div className="w-50 bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl text-gray-900 font-semibold mb-4 text-center">Categorías</h3>
                  {categoriasGral.map((categoria) => (
                    <p
                      key={categoria._id}
                      className={`cursor-pointer p-2 rounded-lg mb-2 text-center transition-colors ${selectedCategory === categoria.nombre ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      onClick={() => setSelectedCategory(categoria.nombre)}
                    >
                      <div className='flex flex-row'>
                        <BiSolidCategory className='mt-1' />{categoria.nombre}
                      </div>
                    </p>
                  ))}
                </div>
                <div className="overflow-y-auto max-h-80 min-h-80 max-w-72 min-w-28">
                  <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900">{selectedCategory}</h2>
                  <div className="grid grid-cols-2 gap-4 pr-1 pl-2">
                    {filteredSubCategorias.map((subCategoria: any, index: any) => (
                      <div key={index} className=" text-center">
                        <p className="break-words bg-blue-100 p-4 rounded-lg">{subCategoria}</p>
                        <div className="mt-2 text-sm text-gray-700 ">
                          {productos
                            .filter(producto => producto.categoria === subCategoria)
                            .map(producto => (
                              <button key={producto._id} onClick={() => handleNavigation(producto)} className="flex flex-row font-base text-xs mt-1 p-1 rounded"><FcNeutralTrading className='text-lg' />{producto.nombreProducto}</button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              </div>
            </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default Navbar2
