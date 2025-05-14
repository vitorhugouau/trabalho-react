import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/dashboard/Dashboard"; 
import Categorias from "./pages/admin/categorias/CategoriasList"; 
import CategoriasAdd from "./pages/admin/categorias/CategoriaForm"; 
import Registro from "./pages/admin/Registro"; 
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
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
                  <Categorias />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/categorias/adicionar"
              element={
                <PrivateRoute>
                  <CategoriasAdd />
                </PrivateRoute>
              }
            />
          </Routes>
    </BrowserRouter>
  );
}
