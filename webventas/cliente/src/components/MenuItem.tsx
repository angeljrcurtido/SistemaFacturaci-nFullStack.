import {useState } from 'react';

const MenuItem = () => {
    const [selectedCategory, setSelectedCategory] = useState('Lacteos');

    const categories = ['Lacteos', 'Verduras', 'Bebidas', 'Juguetes'];
    const products:any = {
        Lacteos: ['Leche', 'Queso', 'Yogur'],
        Verduras: ['Tomate', 'Lechuga', 'Zanahoria'],
        Bebidas: ['Agua', 'Refresco', 'Jugo'],
        Juguetes: ['Pelota', 'Muñeca', 'Puzzle']
    };



    return (
        <div className='flex inset-0 z-40 space-x-6 p-6 bg-gray-100 rounded-lg shadow-md'>
            <div className='w-1/3 bg-white p-6 rounded-lg shadow-lg'>
                <h3 className='text-xl font-semibold mb-4 text-center'>Categorías</h3>
                {categories.map(category => (
                    <p
                        key={category}
                        className={`cursor-pointer p-2 rounded-lg mb-2 text-center transition-colors ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </p>
                ))}

            </div>
            <div className='w-2/3 bg-white p-6 rounded-lg shadow-lg'>
                <h2 className='text-2xl font-semibold mb-4 text-center'>Productos en {selectedCategory}</h2>
                <div className='grid grid-cols-2 gap-4'>
                    {products[selectedCategory].map((product:any) => (
                        <p key={product} className='bg-blue-100 p-4 rounded-lg text-center'>{product}</p>
                    ))}
                </div>


            </div>
        </div>
    );
}

export default MenuItem;
