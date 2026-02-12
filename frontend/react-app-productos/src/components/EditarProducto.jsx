import { useState, useEffect } from "react";
import "./EditarProducto.css";

function EditarProducto({ producto, alActualizar, alCerrar }) {
    const [datosProducto, setDatosProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
    });

    // Cargar los datos del producto cuando se abre el modal
    useEffect(() => {
        if (producto) {
            setDatosProducto({
                _id: producto._id,
                nombre: producto.nombre || '',
                descripcion: producto.descripcion || '',
                precio: producto.precio || '',
                stock: producto.stock || '',
            });
        }
    }, [producto]);

    const handleChange = (e) => {
        setDatosProducto({
            ...datosProducto,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:3000/api/productos/${datosProducto._id || datosProducto.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('mi_token_seguro')
                },
                body: JSON.stringify(datosProducto)
            });

            if (response.ok) {
                const data = await response.json();
                alert('Producto actualizado correctamente');
                alActualizar && alActualizar(data.actualizarProducto); // Llamar a la función pasada como prop para actualizar la lista en el padre
                alCerrar && alCerrar();
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error("Error conectando con Node:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="newProduct-container">
                <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
                    <h2>Editar Producto</h2>
                    <p>Ingrese los datos del producto a editar</p>
                    
                    <div className="input-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input 
                            type="text" 
                            id="nombre" 
                            name="nombre" 
                            placeholder="Ej. Manzana" 
                            required 
                            value={datosProducto.nombre}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <input 
                            type="text" 
                            id="descripcion" 
                            name="descripcion" 
                            placeholder="Golden" 
                            required 
                            value={datosProducto.descripcion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="precio">Precio (en pesos)</label>
                        <input 
                            type="number" 
                            id="precio" 
                            name="precio" 
                            placeholder="30" 
                            required 
                            value={datosProducto.precio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="stock">Stock disponible</label>
                        <input 
                            type="number" 
                            id="stock" 
                            name="stock" 
                            placeholder="28" 
                            required 
                            value={datosProducto.stock}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="button-container">
                        <button type="submit" className="newProduct-btn">Actualizar producto</button>
                        <button type="button" className="cancel-btn" onClick={() => alCerrar && alCerrar()}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarProducto;
