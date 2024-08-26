import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const DashboardCredito: React.FC = () => {
  const [totalVentas30, setTotalVentas30] = useState(0);
  const [ventasDiarias, setVentasDiarias] = useState<number[]>([]);
  const [cantidadTotalVentas30, setCantidadTotalVentas30] = useState(0);
  const [totalGanancias30, setTotalGanancias30] = useState(0);
  const [dias, setDias] = useState<string[]>([]);
  const [totalCantidadVentas, setTotalCantidadVentas] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ventas30DiasResponse, totalCantidadResponse] = await Promise.all([
          axios.get('http://localhost:3001/ventas-credito/total-ultimos-30-dias'),
          axios.get('http://localhost:3001/ventas-credito/total-cantidad')
        ]);

        const ventas30DiasData = ventas30DiasResponse.data;
        const totalCantidadData = totalCantidadResponse.data;

        setTotalVentas30(ventas30DiasData.totalVentas30);
        setCantidadTotalVentas30(ventas30DiasData.cantidadTotalVentas);
        setTotalGanancias30(ventas30DiasData.totalGanancias30);
        setVentasDiarias(Object.values(ventas30DiasData.ventasDiarias));
        setDias(Object.keys(ventas30DiasData.ventasDiarias));
        setTotalCantidadVentas(totalCantidadData.totalCantidadVentas);

      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const barVentasData = {
    labels: dias,
    datasets: [
      {
        label: 'Total de Ventas (últimos 30 días)',
        data: ventasDiarias,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['Total de Ventas (30 días)', 'Cantidad de Ventas (30 días)', 'Ganancia Acumulada (30 días)'],
    datasets: [
      {
        label: 'Estadísticas de Ventas',
        data: [totalVentas30, cantidadTotalVentas30, totalGanancias30],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 border-b">Informes Generales Ventas a credito</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-red-500 text-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold">Total de Ventas (30 días)</h2>
          <p className="text-2xl">Gs.{totalVentas30.toLocaleString()}</p>
        </div>
        <div className="bg-blue-500 text-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold">Cantidad de Ventas (30 días)</h2>
          <p className="text-2xl">{cantidadTotalVentas30}</p>
        </div>
        <div className="bg-green-500 text-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold">Ganancia Acumulada (30 días)</h2>
          <p className="text-2xl">Gs.{totalGanancias30.toLocaleString()}</p>
        </div>
        <div className="bg-yellow-500 text-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold">Cantidad Total de Ventas</h2>
          <p className="text-2xl">{totalCantidadVentas}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Total de Ventas (últimos 30 días)</h2>
          <Bar data={barVentasData} />
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Estadísticas de Ventas</h2>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCredito;
