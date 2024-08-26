import axios from "axios";
import { useEffect, useState } from 'react'
import Imagen1 from '../../assets/imagenmuestra.jpg'
import Categorias from '../../assets/categorias.jpg'
import { useNavigate } from "react-router-dom";
import Ofertas from '../../assets/OFERTAS.jpg'


const Category: React.FC<any> = ({ CategoriaGral }) => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>([])
    const [productos, setProductos] = useState<any[]>([]);
    
    const getCategoriasGral = async (): Promise<any[]> => {
        const response = await axios.get<any[]>('https://serversisweb-1.onrender.com/categorias');
        setData(response.data)
        console.log("Datos de categorias por peticion",response.data)
        return response.data || [];
    };
    const getProductos = async (): Promise<any[]> => {
        const response = await axios.get<any[]>('https://serversisweb-1.onrender.com/productos');
        setProductos(response.data);
        return response.data || [];
    };
    useEffect(() => {
        getCategoriasGral();
        getProductos();
    }, []);
    const itemsToShow = data;

    const handleChange = (categoriaNombre: string) => {
        const categoriaGralSeleccionada = CategoriaGral[0].find((categoriaGral: any) =>
            categoriaGral.subCategorias.includes(categoriaNombre)
        );
        const productosFiltrados = productos.filter(producto => producto.categoria === categoriaNombre);
        navigate("/category", { state: { productData: productosFiltrados, categoriaGralSeleccionada, productos } });
    };

    return (
        <div>
            <h2 className='font-bold text-4xl text-center mt-9 mb-3'>Categorias</h2>
            <div className=" flex flex-row ml-5">
                <img className="w-[250px] h-[400px] rounded-lg" src={Categorias} alt="" />
                <div className="flex flex-wrap gap-4 justify-evenly  mr-10 overflow-y-auto max-h-[400px] min-h-[300px] ">
                    {itemsToShow.map((categoria: any) => (
                        <div key={categoria._id} className="max-w-sm w-[100px] h-[200px] flex-1 basis-1/3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href="#">
                                <img className="rounded-t-lg w-[500px] h-20" src={Imagen1} alt="" />
                            </a>
                            <div className="p-5">
                                <a href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{categoria.nombre}</h5>
                                </a>
                                <button onClick={() => handleChange(categoria.nombre)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Ir a categoria
                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <img className="w-[250px] h-[400px] rounded-lg" src={Ofertas} />
            </div>
           
        </div>
    )
}

export default Category
