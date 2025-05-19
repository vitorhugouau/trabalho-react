import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './ProtectedRoute';
import BemVindo from './pages/BemVindo';
import Registrar from './pages/Registrar';
import Dashboard from './pages/Dashboard';
import ProdutosAdmin from './pages/Admin/ProdutosAdmin';
import CategoriasAdmin from './pages/Admin/CategoriasAdmin';
import VendasAdmin from './pages/Admin/VendasAdmin';
import EditarProduto from './pages/Admin/EditarProduto';
import EditarCategoria from './pages/Admin/EditarCategoria';
import Painel from './pages/Painel';
import Agradecimento from './pages/Agradecimento';

export default function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<BemVindo />} />
      <Route path="/registrar" element={<Registrar />} />
      <Route path="/painel" element={<Painel />} />
      <Route path="/agradecimento" element={<Agradecimento />} />
      {/* Rotas protegidas */}
      <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      <Route path="/produtos" element={<ProtectedRoute> <ProdutosAdmin /> </ProtectedRoute>}/>
      <Route path="/produtos/alterar" element={<ProtectedRoute> <EditarProduto /> </ProtectedRoute>}/>
      <Route path="/categorias" element={<ProtectedRoute> <CategoriasAdmin /> </ProtectedRoute>}/>
      <Route path="/categorias/alterar" element={<ProtectedRoute> <EditarCategoria /> </ProtectedRoute>}/>
      <Route path="/vendas" element={<ProtectedRoute> <VendasAdmin /> </ProtectedRoute>}/>
    </Routes>
  );
}