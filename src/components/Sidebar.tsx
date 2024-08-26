import { useState } from "react";
import { BsMenuButtonWide } from "react-icons/bs";
import { RiDashboard3Fill } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import { FaDropbox, FaBox } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdManageHistory } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const toggleReportMenu = () => {
    setIsReportMenuOpen(!isReportMenuOpen);
    if (isCategoryMenuOpen) {
      setIsCategoryMenuOpen(false);
    }
  };

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
    if (isReportMenuOpen) {
      setIsReportMenuOpen(false);
    }
  };

  const menuItems = [
    { name: 'Productos', icon: <BiCategoryAlt />, route: '/productos' },
    { name: 'Proveedores', icon: <FaBox/>, route: '/proveedor' },
    { name: 'Compras', icon: <FaMoneyBillTransfer/>, route: '/compras' },
    { name: 'Ventas', icon: <FaMoneyBillTransfer />, route: '/ventas' },
    { name: 'Ventas a Credito', icon: <FaMoneyBillTransfer />, route: '/ventascredito' },
    { name: 'Detalles Creditos', icon: <FaMoneyBillTransfer />, route: '/historialventascredito' },
    { name: 'Historial Ventas', icon: <MdManageHistory/>, route: '/historialventas' },
    { name: 'Historial Compras', icon: <MdManageHistory />, route: '/historialcompras' },
    { name: 'Apertura de Caja', icon: <FaDropbox />, route: '/caja' },
    { name: 'Historial Aperturas', icon: <RiFolderHistoryFill/>, route: '/historialcaja' },
    { name: 'Actualizar Datos', icon: <MdManageHistory/>, route: '/datosempresa' },
    { name: 'Agregar Clientes', icon: <MdManageHistory/>, route: '/datoscliente' },
  ];

  const reportItems = [
    { name: 'Reporte Gral', icon: <RiDashboard3Fill />, route: '/' },
    { name: 'Reporte Contado', icon: <RiDashboard3Fill />, route: '/dashboardcontado' },
    { name: 'Reporte Credito', icon: <RiDashboard3Fill />, route: '/dashboardcredito' },
  ];

  const categoriaGralItems = [
    { name: 'Categoria General', icon: <RiDashboard3Fill />, route: '/categoriagral' },
    { name: 'Subcategoria', icon: <RiDashboard3Fill />, route: '/categoria' }
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-6">
      <h1 className="text-2xl flex"><BsMenuButtonWide className="mt-2" size={20} />Menú</h1>
      <nav>
        <div>
          <div className="flex items-center hover:bg-gray-700 hover:rounded-md py-1 text-gray-200 mb-3 mt-2 hover:text-white px-4 cursor-pointer" onClick={toggleReportMenu}>
            <RiDashboard3Fill />
            <span className="ml-2">Reportes</span>
          </div>
          {isReportMenuOpen && (
            <div className="ml-4">
              {reportItems.map((item, index) => (
                <Link key={index} to={item.route} className="flex items-center hover:bg-gray-700 hover:rounded-md py-1 text-gray-200 mb-3 mt-2 hover:text-white px-4">
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center hover:bg-gray-700 hover:rounded-md py-1 text-gray-200 mb-3 mt-2 hover:text-white px-4 cursor-pointer" onClick={toggleCategoryMenu}>
            <RiDashboard3Fill />
            <span className="ml-2">Categoría</span>
          </div>
          {isCategoryMenuOpen && (
            <div className="ml-4">
              {categoriaGralItems.map((item, index) => (
                <Link key={index} to={item.route} className="flex items-center hover:bg-gray-700 hover:rounded-md py-1 text-gray-200 mb-3 mt-2 hover:text-white px-4">
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        {menuItems.map((item, index) => (
          <Link key={index} to={item.route} className="flex items-center hover:bg-gray-700 hover:rounded-md py-1 text-gray-200 mb-3 mt-2 hover:text-white px-4">
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
