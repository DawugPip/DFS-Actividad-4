import { useState } from 'react';
import './Register.css'; // Mueve tu CSS aquí
import { useNavigate } from 'react-router-dom';

function Register() {
  // 1. Llamar useNavigate al nivel del componente
  const navigate = useNavigate(); 

  // 1. Definimos el estado para el formulario
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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
      if (credentials.password !== credentials.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Bienvenido al sistema. A continuación, inicia sesión con tus credenciales.');
        navigate('/login'); // Redirige al login después del registro
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error conectando con Node:", error);
    }
  };

  return (
    <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
            <h2>Inventario Pro</h2>
            <p>Bienvenido</p>
            <p>Por favor, ingrese sus credenciales para crear una cuenta</p>
            
            <div className="input-group">
                <label htmlFor="email">Correo</label>
                <input type="text" id="email" name="email" placeholder="Ej. admin@email.com" value={credentials.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} required />
            </div>

            <div className="input-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="*******" value={credentials.confirmPassword} onChange={handleChange} required />
            </div>

            <button type="submit" className="register-btn">Entrar al Sistema</button>
    
        </form>
    </div>
  );
}
export default Register;