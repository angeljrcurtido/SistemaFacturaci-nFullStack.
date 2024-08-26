import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Categoria from './components/Categoria';
import Productos from './components/Productos/Productos';
import EditarProductos from './components/Productos/EditarProductos';
import Proveedor from './components/Productos/Proveedor';
import CategoriaGral from './components/CategoriaGral/CategoriaGral';
import Caja from './components/Caja/Caja';
import CategoriaServicio from './components/Servicios/Categoria';
import Servicios from './components/Servicios/Servicios';
import EditarProveedor from './components/Productos/EditarProveedor';
import HistorialCaja from './components/Caja/HistorialCaja';
import ModalAdvertencia from './components/Ventas/ModalAdvertencia';
import Dashboardtotal from './components/Dashboard/Dashboardtotal';
import HistorialVentasCredito from './components/HistorialVentasCredito/HistorialVentasCredito';
import DatosEmpresa from './components/DatosEmpresa/DatosEmpresa';
import VentasCredito from './components/VentasCredito/VentasCredito';
import DatosCliente from './components/DatosCliente/DatosCliente';
import ConfigWeb from './components/ConfigWeb/ConfigWeb';
import HistorialVentas from './components/HistorialVentas/HistorialVentas';
import HistorialCompras from './components/HistorialCompras/HistorialCompras';
import Reportes from './components/Reportes/Reportes';
import Dashboard from './components/Dashboard/Dahsboard';
import DashboardCredito from './components/Dashboard/DashboardCredito';
import Ventas from './components/Ventas/Ventas';
import Compras from './components/Compras/Compras';
import './App.css';

function App() {
  const [title, setTitle] = useState("")
  const [showModalAdvertencia, setShowModalAdvertencia] = useState(false);
  // Asignar la fecha de vencimiento para la demo
  const currentDate = new Date();
  const disableDate = new Date('2024-12-01');
  useEffect(() => {
    // Mostrar el mensaje de alerta al montar el componente
    setTitle('Esta es una versión demo del sistema se vencerá el día 01 de Diciembre del 2024, favor tener en cuenta, luego de ese tiempo quedará obsoleto. Si desea una versión personalizada, contactar con el desarrollador al correo: angeljrcurtido@gmail.com');
    setShowModalAdvertencia(true);
  }, []);

  useEffect(() => {
    // Mostrar un mensaje de alerta si la fecha actual es posterior a la fecha de vencimiento
    if (currentDate > disableDate) {
      alert('Favor contactar con el desarrollador al angeljrcurtido@gmail.com');
    }
  }, [currentDate, disableDate]);

  return (
    <Router>
      <div className="flex h-screen">
        <div className='w-64'>
          <Sidebar />
        </div>
        <div className='flex-grow'>
          <Routes>
           
              <>
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/categoria" element={<Categoria />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/proveedor" element={<Proveedor />} />
                <Route path="/compras" element={<Compras />} />
                <Route path='/configweb' element={<ConfigWeb/>}/>
                <Route path="/ventascredito" element={<VentasCredito />} />
                <Route path="/categoriaservicio" element={<CategoriaServicio />} />
                <Route path="/ventas" element={<Ventas />} />
                <Route path="/caja" element={<Caja />} />
                <Route path="/categoriagral" element={<CategoriaGral/>}/>
                <Route path="/datosempresa" element={<DatosEmpresa />} />
                <Route path="/datoscliente" element={<DatosCliente />} />
                <Route path="/historialcompras" element={<HistorialCompras />} />
                <Route path="/historialcaja" element={<HistorialCaja />} />
                <Route path="/historialventascredito" element={<HistorialVentasCredito />} />
                <Route path="/historialventas" element={<HistorialVentas />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/dashboardcontado" element={<Dashboard />} />
                <Route path="/dashboardcredito" element={<DashboardCredito />} />
                <Route path="/" element={<Dashboardtotal />} />
                <Route path="/editarproductos/:id" element={<EditarProductos />} />
                <Route path="/editarproveedor/:id" element={<EditarProveedor />} />
              </>
          
          </Routes>
        </div>
      </div>
      
    </Router>
  );
}

export default App;
