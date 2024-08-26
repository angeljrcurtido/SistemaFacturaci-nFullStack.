import React from 'react';
import { FaEye } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
interface Feature {
    icon: React.ReactNode; // Este tipo permite pasar componentes React como íconos
    text: string;
}

interface CardsProps {
    data?:any[];
    imageSrc?: string;
    className?: string;
    classNamePrice?: string;
    altText?: string;
    discountText?: string;
    productName?: string;
    rating?: number;
    reviewsCount?: number;
    features?: Feature[];
    price?: string;
    onAddToCart?: () => void;
}

const Cards: React.FC<CardsProps> = ({
    data,
    imageSrc,
    className,
    classNamePrice,
    altText,
    discountText,
    productName,
    rating,
    reviewsCount,
    features,
    price,

}) => {

    const navigate = useNavigate();
    const handleNavigation = () => {
        console.log("Datos antes de enviar desde card", data)
        navigate("/product", { state: { productData: data } });
      };
    return (
        <div className={`rounded-lg border  border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}>
            <div className="h-56 w-full">
                <a href="#">
                    <img className="mx-auto h-full dark:hidden" src={imageSrc} alt={altText} />
                </a>
            </div>
            <div className="pt-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        {discountText}
                    </span>
                    <div className="flex items-center justify-end gap-1">
                        <button
                            type="button"
                            data-tooltip-target="tooltip-quick-look"
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <FaEye/>
                        </button>

                        <button
                            type="button"
                            data-tooltip-target="tooltip-add-to-favorites"
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                         <FaRegHeart/>
                        </button>
                    </div>
                </div>

                <a href="#" className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
                    {productName}
                </a>

                <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                        {[...Array(rating)].map((_, i) => (
                            <svg
                                key={i}
                                className="h-4 w-4 text-yellow-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                            </svg>
                        ))}
                    </div>

                    <p className="text-sm font-medium text-gray-900 dark:text-white">{rating}.0</p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{reviewsCount}</p>
                </div>

                <ul className="mt-2 flex items-center gap-4">
                    {features?.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            {feature.icon} {/* Aquí renderizas el ícono pasado como prop */}
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{feature.text}</p>
                        </li>
                    ))}
                </ul>

                    <div className="mt-4 flex items-center justify-between gap-4">
                        <p className={`text-2xl font-extrabold leading-tight text-gray-900 dark:text-white ${classNamePrice}`}>{price}</p>
                        <button
                            type="button"
                            className="font-bold text-sm"
                            onClick={handleNavigation}
                        > 
                            Ver Detalles
                        </button>
                    </div>
            </div>
        </div>
    );
};

export default Cards;
