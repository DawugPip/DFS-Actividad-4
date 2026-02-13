import { useState, useEffect } from "react";
import "./NuevoProducto.css"; // Archivo de estilos

function NuevoProducto( props ) {
    const { alAgregar, alCerrar } = props;
    console.log('Props recibidas:', { alAgregar, alCerrar });
    const [datosProducto, setDatosProducto]= useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
    });

  // Función para actualizar el estado mientras el usuario escribe
    const handleChange = (e) => {
        setDatosProducto({
            ...datosProducto,
            [e.target.name]: e.target.value
    });
  };

  // Función para enviar los datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('mi_token_seguro') },
        body: JSON.stringify(datosProducto)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Producto agregado correctamente');
        alAgregar &&alAgregar(data); // Llamar a la función pasada como prop para actualizar la lista en el padre
        //Avisa a la lista que hay un nuevo producto, para que se vuelva a cargar el inventario
        alCerrar && alCerrar(); // Cerrar el formulario después de agregar
      } else {
        const data = await response.json(); 
        alert(data.message);
      }
    } catch (error) {
      console.error("Error conectando con Node:", error);
    }
  };

  return (
    <div className= "modal-overlay">
      <div className="newProduct-container">
        <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
            <h2>Nuevo Producto</h2>
            <p>Ingrese los datos del producto a agregar</p>
            
            <div className="input-group">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" name="nombre" placeholder="Ej. Manzana" required onChange={handleChange}/>
            </div>

            <div className="input-group">
                <label htmlFor="descripcion">Descripción</label>
                <input type="text" id="descripcion" name="descripcion" placeholder="Golden" required onChange={handleChange}/>
            </div>

            <div className="input-group">
                <label htmlFor="precio">Precio (en pesos)</label>
                <input type="number" id="precio" name="precio" placeholder="30" required onChange={handleChange}/>
            </div>

            <div className="input-group">
                <label htmlFor="stock">Stock disponible</label>
                <input type="number" id="stock" name="stock" placeholder="28" required onChange={handleChange}/>
            </div>

        <div className="button-container">
            <button type="submit" className="newProduct-btn">Crear producto</button>
            <button type="button" className="cancel-btn" onClick={() => alCerrar && alCerrar()}>
              Cancelar
            </button>
        </div>
        </form>
      </div>
    </div>
  );
}            
export default NuevoProducto;