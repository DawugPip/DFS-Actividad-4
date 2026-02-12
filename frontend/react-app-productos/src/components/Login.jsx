import { useState } from 'react';
import './Login.css'; // Mueve tu CSS aquí
import { useNavigate } from 'react-router-dom';

function Login() {
  // 1. Llamar useNavigate al nivel del componente
  const navigate = useNavigate(); 

  // 1. Definimos el estado para el formulario
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // 2. Función para actualizar el estado mientras el usuario escribe
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // 3. Función para enviar los datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      if (response.ok) {
        // 1. Guardamos el token en el "bloc de notas" del navegador
        // 'token' es el nombre de la etiqueta, data.token es el valor que viene de Node
        localStorage.setItem('mi_token_seguro', data.token);

        alert('Login exitoso, token guardado');

        // 2. Redirigir (En React puro se usa useNavigate, pero para no liarte:)
        navigate('/productos'); // Redirige a la página de productos después del login

      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error conectando con Node:", error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Inventario Pro</h2>
        <p>Ingresa tus credenciales para continuar</p>
        
        <div className="input-group">
          <label htmlFor="email">Usuario</label>
          <input 
            type="text" 
            name="email" 
            placeholder="Ej. admin_01" 
            value={credentials.email}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            value={credentials.password}
            onChange={handleChange}
            required 
          />
        </div>

        <button type="submit" className="login-btn">Entrar al Sistema</button>
        
        <div className="form-footer">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </div>
  );
}

export default Login;