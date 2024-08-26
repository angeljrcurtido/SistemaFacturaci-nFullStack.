interface Categoria {
    _id: string;
    nombre: string;
    subCategorias: string[];
}

interface NavbarlateralProps {
    CategoriaGral?: Categoria[];
    onSelectSubCategoria: (subCategoria: string) => void;
    onPriceFilterChange: (selectedRanges: number[][]) => void;
}

const Navbarlateral: React.FC<NavbarlateralProps> = ({ CategoriaGral, onSelectSubCategoria, onPriceFilterChange }) => {
    const CategoriaGralSeleccionada = CategoriaGral?.[0];

    const handleCheckboxChange = () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedRanges: number[][] = Array.from(checkboxes).map(checkbox => {
            const value = checkbox.getAttribute('data-range');
            if (value) {
                // Divide el rango en dos partes usando ',' y conviértelos en números
                const [min, max] = value.split(',').map(Number);
                return [min, max];
            }
            return [];
        });
        onPriceFilterChange(selectedRanges);
    };

    return (
        <div className="mt-3 flex flex-col gap-5 pl-5">
            <div>
                <h2 className="border-b font-bold text-xl">{CategoriaGralSeleccionada?.nombre}</h2>
                <ul>
                    {CategoriaGralSeleccionada?.subCategorias.map((subCategoria, index) => (
                        <li
                            key={index}
                            onClick={() => onSelectSubCategoria(subCategoria)}
                            className="cursor-pointer"
                        >
                            {subCategoria}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col gap-1" >
                <h2 className="border-b font-bold text-xl">Precios</h2>
                <div className="flex items-center mb-4 mt-1">
                    <input
                        type="checkbox"
                        data-range="0,10000"
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Gs. 0 hasta 10.000</label>
                </div>
                <div className="flex items-center mb-4 mt-1">
                    <input
                        type="checkbox"
                        data-range="10001,50000"
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">Gs. 10.001 hasta 50.000</label>
                </div>
                <div className="flex items-center mb-4 mt-1">
                    <input
                        type="checkbox"
                        data-range="50001,100000"
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">Gs. 50.001 hasta 100.000</label>
                </div>
                <div className="flex items-center mb-4 mt-1">
                    <input
                        type="checkbox"
                        data-range="100001,1000000"
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">Gs. 100.001 hasta 1.000.000</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        data-range="1000001,Infinity"
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">Gs. 1.000.001 y más</label>
                </div>
            </div>

        </div>
    );
};

export default Navbarlateral;
