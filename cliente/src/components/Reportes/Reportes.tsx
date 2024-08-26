import React from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Reportes: React.FC = () => {
    const handleDownloadReport = async () => {
        try {
            const response = await axios.get('http://localhost:3001/productos');
            const productos = response.data;

            // Añadir encabezados de columnas y convertir datos
            const encabezados = [['NOMBRE_PRODUCTOS', 'CATEGORIA', 'STOCK_ACTUAL', 'PRECIO_COMPRA', 'PRECIO_VENTA']];
            const datos = productos.map(producto => [
                producto.nombreProducto,
                producto.categoria,
                producto.stockActual,
                producto.precioCompra,
                producto.precioVenta
            ]);

            // Combinar encabezados y datos
            const hojaDatos = [...encabezados, ...datos];

            // Crear la hoja de cálculo
            const worksheet = XLSX.utils.aoa_to_sheet(hojaDatos);

            // Añadir el título "REPORTE PRODUCTOS"
            XLSX.utils.sheet_add_aoa(worksheet, [['REPORTE PRODUCTOS']], { origin: 'A1' });
            worksheet['A1'].s = { font: { bold: true, sz: 14 }, alignment: { horizontal: 'center' } };
            worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

            // Ajustar la posición de los encabezados y datos
            XLSX.utils.sheet_add_aoa(worksheet, encabezados, { origin: 'A2' });
            XLSX.utils.sheet_add_aoa(worksheet, datos, { origin: 'A3' });

            // Añadir la fila "Total Productos Cargados"
            XLSX.utils.sheet_add_aoa(worksheet, [['Total Productos Cargados', productos.length]], { origin: -1 });

            // Crear el libro de trabajo
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

            // Descargar el archivo Excel
            XLSX.writeFile(workbook, 'reporte_productos.xlsx');
        } catch (error) {
            console.error('Error fetching productos:', error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Reporte de Productos</h1>
            <button
                onClick={handleDownloadReport}
                className="bg-green-500 text-white p-2 rounded border border-gray-600"
                type='button'
            >
                Descargar Reporte Productos
            </button>
        </div>
    </div>
    );
};

export default Reportes;

