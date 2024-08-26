import Cards from '../Ofertas/Cards';
import Navbarlateral from './NavbarLateral';
import { useEffect, useState } from 'react';
import { CiDeliveryTruck } from "react-icons/ci";
import Monedero from '../../assets/monedero.jpg';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLocation } from "react-router-dom";
import { MdOutlinePriceChange } from "react-icons/md";
import axios from 'axios';

interface CategoryProduct {
    NombreProduct?: string;
    CodProduct?: string;
    BrandProduct?: string;
    Estado?: string;
    Price?: string;
    textbutton?: string;
    text2button?: string;
    Categorias?: string[];
}

const CategoryProduct: React.FC<CategoryProduct> = ({ }) => {
    const location = useLocation();
    const { productData, categoriaGralSeleccionada } = location.state || {};
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedData, setSortedData] = useState(productData);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const [productos, setProductos] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

    const handleAddToCart = () => {
        console.log('Product added to cart');
    };

    const features = [
        { icon: <CiDeliveryTruck />, text: 'Delivery express' },
        { icon: <MdOutlinePriceChange />, text: 'Mejores precios' },
    ];

    const getProductos = async (): Promise<any[]> => {
        const response = await axios.get<any[]>('https://serversisweb-1.onrender.com/productos');
        setProductos(response.data);
        setFilteredProducts(response.data); // Inicialmente mostrar todos los productos
        return response.data || [];
    };

    useEffect(() => {
        getProductos();
    }, []);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const sortOption = event.target.value;

        const sortedArray = [...filteredProducts].sort((a, b) => {
            if (sortOption === '1') {
                return a.precioVenta - b.precioVenta;
            } else if (sortOption === '2') {
                return b.precioVenta - a.precioVenta;
            }
            return 0;
        });

        setSortedData(sortedArray);
        setCurrentPage(1);
    };

    const handleSubCategoriaSelect = (subCategoria: string) => {
        const filtered = productos.filter(producto => producto.categoria === subCategoria);
        setFilteredProducts(filtered);
        setSortedData(filtered);
        setCurrentPage(1);
    };

   
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = sortedData.slice(startIndex, startIndex + itemsPerPage);

    console.log("Datos de sortedData",sortedData)
    const handlePriceFilterChange = (selectedRanges: number[][]) => {
        
        let filtered;
    
        if (selectedRanges.length === 0) {
            // Si no hay rangos seleccionados, mostrar todos los currentItems
            handleSubCategoriaSelect(productData[0].categoria);
            filtered = productData
        } else {
            // Si hay rangos seleccionados, aplicar el filtro
            filtered = currentItems.filter((producto: any) => {
                return selectedRanges.some(([min, max]) => producto.precioVenta >= min && producto.precioVenta <= max);
            });
        }
    
        console.log("Datos filtrados", filtered);
        setSortedData(filtered);
        setCurrentPage(1);
    };
    return (
        <div className='flex flex-row'>
            <div>
                <Navbarlateral
                    CategoriaGral={[categoriaGralSeleccionada]}
                    onSelectSubCategoria={handleSubCategoriaSelect}
                    onPriceFilterChange={handlePriceFilterChange}
                />
            </div>
            <div>
                <div className='flex flex-row justify-between ml-3 mr-3 mt-3'>
                    <div>
                        {currentPage} de {totalPages} páginas con {sortedData.length} productos
                    </div>
                    <div>
                        Organizar por:
                        <select
                            className="border border-gray-300 p-1 rounded-full ml-2"
                            onChange={handleSortChange}
                        >
                            <option value="1">Menores precios</option>
                            <option value="2">Mayores precios</option>
                        </select>
                    </div>
                </div>
                <div className='ml-20 mb-9'>
                    <div className="grid grid-cols-4 gap-6">
                        {currentItems.map((producto: any) => (
                            <Cards
                                data={producto}
                                className='w-[300px] mt-3'
                                classNamePrice='!text-sm'
                                key={producto._id}
                                imageSrc={Monedero}
                                altText={producto.nombreProducto}
                                discountText="Up to 35% off"
                                productName={producto.nombreProducto}
                                rating={5}
                                features={features}
                                price={`Gs. ${(producto.precioVenta).toLocaleString("es")}`}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-3 mt-4 mb-3">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryProduct;
