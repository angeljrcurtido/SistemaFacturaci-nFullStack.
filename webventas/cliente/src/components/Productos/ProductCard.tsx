import Product1 from '../../assets/imagenauricular.png'
import { FaCartArrowDown } from "react-icons/fa";
import Cards from '../Ofertas/Cards';
import { useEffect, useState } from 'react';
import { CiDeliveryTruck } from "react-icons/ci";
import Monedero from '../../assets/monedero.jpg'
import { useCartStore } from './useCartStore.ts';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useLocation } from "react-router-dom";
import { MdOutlinePriceChange } from "react-icons/md";
import axios from 'axios';
interface ProductCardProps {
    NombreProduct?: string;
    CodProduct?: string;
    BrandProduct?: string;
    Estado?: string;
    Price?: string;
    textbutton?: string;
    text2button?: string;
    Categorias?: string[];
}
const ProductCard: React.FC<ProductCardProps> = ({

    Estado = "DISPONIBLE",

    textbutton = "AGREGAR",
    text2button = "al carrito",

}) => {
    const { addItem } = useCartStore();
    const location = useLocation();
    const { productData } = location.state || {};
    console.log( "Datos que llegan al productData",productData)
    const [productos, setProductos] = useState<any[]>([]);
    const handleAddToCart = () => {
        const item = {
            id: productData._id,
            
            name: productData.nombreProducto,
            price: productData.precioVenta,
            category: productData.categoria,
            quantity: 1, // Inicialmente añadimos 1 al carrito
        };
        addItem(item); // Añadir el producto al carrito
        console.log("Datos del item del carrito", item);
    };
    const features = [
        { icon: <CiDeliveryTruck />, text: 'Delivery express' },
        { icon: <MdOutlinePriceChange />, text: 'Mejores precios' },
    ];
    const getProductos = async (): Promise<any[]> => {
        const response = await axios.get<any[]>('https://serversisweb-1.onrender.com/productos');
        setProductos(response.data)
        return response.data || [];
    };
    
    useEffect(() => {
        getProductos();
    }, [])
    // Configuración del slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Muestra 3 productos a la vez
        slidesToScroll: 1, // Desliza un producto a la vez
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div>
            <div className='flex flex-row justify-center'>
                <img className='max-w-[500px]' src={Product1} alt="Product1" />
                <div className='flex flex-col justify-evenly max-w-[600px]'>
                    <h2 className='font-bold text-2xl'>{productData.nombreProducto}</h2>
                    <div className='flex flex-row gap-4'>
                        <p><span className='text-gray-300'>Código:</span><span className='font-bold'>{(productData._id).slice(-4)}</span></p>
                    </div>
                    <div className='flex justify-start'>
                        <button className='bg-[#3b82f6] text-xs font-bold shadow-md text-white'>{Estado}</button>
                    </div>
                    <div className='flex flex-row gap-3 border-2 rounded-md pl-3 pt-3 pb-3 !w-full shadow-sm'>
                        <p className='font-bold text-2xl mt-4'>Gs. {(productData.precioVenta).toLocaleString("es")}</p>
                        <button onClick={handleAddToCart} className='bg-[#3b82f6] text-white flex flex-row gap-3 mr-4'><FaCartArrowDown className='mt-5' /><span className='flex flex-col gap-1 '><span className='font-bold tracking-widest'>{textbutton}</span><span className='tracking-widest'>{text2button}</span></span></button>
                    </div>
                    <p><span className='text-gray-300'>Categoria: </span><span className='font-bold'>{productData.categoria}</span></p>
                </div>
            </div>
            <p className='text-center font-bold text-2xl mt-3'>También te puede interesar</p>
            <div className='ml-20 mb-9 '>
                <Slider {...settings}>
                    {productos.slice(0, 3).map((producto) => (
                        <Cards
                            data={producto}
                            className='w-[400px] mt-3'
                            key={producto._id}
                            imageSrc={Monedero}
                            altText={producto.nombreProducto} // Puedes usar el nombre del producto como alt text
                            discountText="Up to 35% off" // Si tienes algún campo de descuento en tus datos, puedes reemplazar esto
                            productName={producto.nombreProducto}
                            rating={5} // Si tienes un campo de calificación en tus datos, puedes usarlo aquí
                            features={features}
                            price={`Gs. ${(producto.precioVenta).toLocaleString("es")}`} // Ajusta el formato según necesites
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default ProductCard;
