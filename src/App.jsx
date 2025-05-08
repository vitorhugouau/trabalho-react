import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard"; 
import Registro from "./pages/admin/Registro"; 
import PrivateRoute from "./components/PrivateRoute"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/registro" element={<Registro />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
