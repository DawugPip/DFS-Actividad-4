// src/App.jsx
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login.jsx"; 
import Register from "./components/Register.jsx";
import ListaProductos from "./components/ListaProductos.jsx";

// Componente para proteger rutas
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('mi_token_seguro');
  
  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  // 1. Obtenemos la ubicación actual
  const location = useLocation();

  return (
    <div>
      {/* 2. Condición: Si la ruta NO es "/productos", muestra el nav */}
      {location.pathname !== "/productos" && ( //&& Significa "si lo de la izquierda es verdad, dibuja lo de la derecha"
        <nav>
          <Link to="/">Registrarse</Link> | <Link to="/login">Iniciar Sesión</Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productos" element={
          <ProtectedRoute>
            <ListaProductos />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;