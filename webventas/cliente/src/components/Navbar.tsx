import axios from 'axios';
import { FcBookmark } from "react-icons/fc";
import { useEffect, useState } from 'react';
import Sponsors from './Sponsors/Sponsors';
import Ofertas from './Ofertas/Ofertas';
import Category from './Categorias/Category';
import './style.css'
interface CategoriaGral {
  _id: string;
  nombre: string;
  subCategorias: string[];
  __v: number;
}

interface Producto {
  _id: string;
  nombreProducto: string;
  categoria: string;
}

interface Imagenes {
  _id: string;
  imagensuperior: string[];
  stylebotonesdebajo: string[];
  __v?: number;
}

const Navbar: React.FC = () => {

  const [categoriasGral, setCategoriasGral] = useState<CategoriaGral[]>([]);
  const [lastImage, setLastImage] = useState<Imagenes | null>(null);
  const getCategoriasGral = async (): Promise<CategoriaGral[]> => {
    const response = await axios.get<CategoriaGral[]>('https://serversisweb-1.onrender.com/categoriasgral');
    return response.data || [];
  };

  const getProductos = async (): Promise<Producto[]> => {
    const response = await axios.get<Producto[]>('https://serversisweb-1.onrender.com/productos');
    return response.data || [];
  };

  const getImagenes = async (): Promise<Imagenes[]> => {
    const response = await axios.get<Imagenes[]>('https://serversisweb-1.onrender.com/imagenes');
    return response.data || [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataCategorias] = await Promise.all([getCategoriasGral(), getProductos()]);
        setCategoriasGral(dataCategorias);


      } catch (error) {
        console.error("Error al obtener las categorías generales o productos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getImagenes().then((imagenes) => {
      if (imagenes.length > 0) {
        const lastImage = imagenes[imagenes.length - 1];
        setLastImage(lastImage);
        console.log('Última imagen:', lastImage);
      }
    });
  }, []);


  return (
    <>
      <div className=''>
        <nav className="bg-white border-gray-200 dark:bg-gray-900   ">
          <div className="flex justify-center">
            {lastImage ? (
              <img
                src={lastImage.imagensuperior[lastImage.imagensuperior.length - 1]}
                alt="Última imagen cargada"
                className="w-[2000px] h-[300px]"
              />
            ) : (
              <p>Cargando imagen...</p>
            )}
          </div>
          <div className='flex flex-row justify-center gap-4 mt-3'>
            <button
              style={{ backgroundColor: lastImage?.stylebotonesdebajo[0] }}
              className='text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-75 flex flex-row-reverse mt-3 pt-9 pb-9 pr-20 pl-20'
            >
              <FcBookmark className='mt-1 text-xl' />Descubrí los nuevos productos
            </button>
            <button
              style={{ backgroundColor: lastImage?.stylebotonesdebajo[1] }}
              className='text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-75 flex flex-row-reverse mt-3 pt-9 pb-9 pr-20 pl-20'
            >
              <FcBookmark className='mt-1 text-xl' />Aprovechá estas ofertas especiales!
            </button>
          </div>
          <Category CategoriaGral={[categoriasGral]} />
          <Ofertas />
          <Sponsors />
        </nav>
      </div>
    </>
  );
};

export default Navbar;
