import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ListaProductos.css";
import NuevoProducto from "./NuevoProducto.jsx";
import EditarProducto from "./EditarProducto.jsx";

function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [modalEditar, setModalEditar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarProductos() {
      try {
        const token = localStorage.getItem('mi_token_seguro');
        console.log('Token encontrado:', token ? 'Sí' : 'No');
        
        if (!token) {
          console.log('No hay token, redirigiendo a login');
          navigate('/login');
          return;
        }
        
        console.log('Haciendo petición a /api/productos...');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        
        console.log('Respuesta del servidor:', response.status);
        
        if (response.status === 401 || response.status === 403) {
          // Token inválido o expirado
          console.log('Token inválido, eliminando y redirigiendo');
          localStorage.removeItem('mi_token_seguro');
          navigate('/login');
          return;
        }
        
        const data = await response.json();
        console.log('Productos recibidos:', data);
        
        // Verificar si es un array de productos o un mensaje de error/vacio
        if (Array.isArray(data)) {
          setProductos(data);
        } else if (data.message && typeof data.message === 'string') {
          // El backend devolvió un mensaje (no hay productos)
          setProductos([]);
        } else {
          setProductos([]);
        }
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setCargando(false);
      }
    }
    cargarProductos();
  }, [navigate]);

  const agregarALista = (nuevo) => {
    setProductos([...productos, nuevo]);
  };

  const actualizarProducto = (productoActualizado) => {
    setProductos(productos.map(p => 
      p._id === productoActualizado._id ? productoActualizado : p
    ));
  };

  const eliminarProducto = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': 'Bearer ' + localStorage.getItem('mi_token_seguro') 
        }
      });

      if (response.ok) {
        setProductos(productos.filter(p => p._id !== id));
        alert("Producto eliminado");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (cargando) return <div className="loader">Cargando inventario...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Gestión de Inventario</h1>
        <button className="add-btn" onClick={() => setMostrarModalNuevo(true)}>+ Nuevo Producto</button>
      </header>

      {/* Modal para nuevo producto */}
      {mostrarModalNuevo && (
        <NuevoProducto 
          alAgregar={agregarALista} 
          alCerrar={() => setMostrarModalNuevo(false)}
        />
      )}

      {/* Modal para editar producto */}
      {modalEditar && (
        <EditarProducto 
          producto={modalEditar}
          alActualizar={actualizarProducto}
          alCerrar={() => setModalEditar(null)}
        />
      )}

      <div className="table-container">
        {productos.length === 0 ? (
          <div className="no-products-message">
            <p>No tienes productos registrados aún.</p>
            <p>¡Agrega tu primer producto haciendo clic en el botón "+ Nuevo Producto"!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p._id || p.id}>
                  <td><strong>{p.nombre}</strong></td>
                  <td>{p.descripcion}</td>
                  <td>${p.precio}</td>
                  <td><span className="stock-badge">{p.stock} unid.</span></td>
                  <td>
                    <button className="edit-btn" onClick={() => setModalEditar(p)}>Editar</button>
                    <button className="delete-btn" onClick={() => eliminarProducto(p._id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ListaProductos;
