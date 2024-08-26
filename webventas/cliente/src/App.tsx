import Navbar from './components/Navbar'
import Navbar2 from './components/Navbar2';
import ListaCarrito from './components/ListadeCarrito/ListaCarrito';
import Footer from './components/Footer/Footer';
import PaySave from './components/ListadeCarrito/PaySave';
import ProductCard from './components/Productos/ProductCard';
import CategoryProduct from './components/Categorias/CategoryProduct';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css'

function App() {

  return (
    <body>
      <Router>
      <Navbar2/>
        <Routes>
          <Route path='/listacarrito' element={<ListaCarrito />} />
          <Route path='/product' element={<ProductCard />} />
          <Route path='/category' element={<CategoryProduct />} />
          <Route path='/' element={<Navbar />} />
          <Route path='/paysave' element={<PaySave />} />
          <Route path='/prueba' element={<Navbar2 />} />
        </Routes>
        <Footer/>      
      </Router>
    </body>
  )
}

export default App
