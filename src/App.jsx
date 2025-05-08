import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard"; 
import Registro from "./pages/admin/Registro"; 
import CategoriasList from './pages/admin/CategoriasList';
import CategoriaForm from './pages/admin/CategoriaForm'; 
import PrivateRoute from "./components/PrivateRoute";
import { CategoriaProvider } from './contexts/CategoriaContext';  // Importando o CategoriaProvider

export default function App() {
  return (
    <BrowserRouter>
      <CategoriaProvider>  {/* Envolvendo a aplicação com o contexto */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categorias"
            element={
              <PrivateRoute>
                <CategoriasList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categorias/adicionar"
            element={
              <PrivateRoute>
                <CategoriaForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </CategoriaProvider>
    </BrowserRouter>
  );
}
