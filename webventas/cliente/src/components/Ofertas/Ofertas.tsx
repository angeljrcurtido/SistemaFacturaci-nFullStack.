
import { useEffect, useState } from 'react';
import Cards from './Cards';
import { CiDeliveryTruck } from "react-icons/ci";
import { MdOutlinePriceChange } from "react-icons/md";
import Monedero from '../../assets/monedero.jpg'
import axios from 'axios';

const Ofertas = () => {
    const [productos, setProductos] = useState<any[]>([]);
    const handleAddToCart = () => {
        console.log('Product added to cart');
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

    console.log("de ofertas",productos)

    return (
        <div>
            <h2 className='font-bold text-4xl text-center mt-9 mb-3'>Las mejores ofertas para vos!</h2>
            <div className="flex flex-row justify-center gap-24">
                {productos.slice(0,3).map((producto) => (
                    <Cards
                        data={producto}
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
            </div>
        </div>
    )
}

export default Ofertas
