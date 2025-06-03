import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../utils/api';

function RegisterForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Registrar usuario 
      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Enviar username 
        body: JSON.stringify({ 
          username: nombre,  
          email, 
          password 
        })
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        // Usar 'message'
        throw new Error(registerData.message || 'Error al registrarse');
      }

      // Login automático después del registro exitoso
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        throw new Error(loginData.message || 'Error al iniciar sesión automático');
      }

      //Guardar token y usuario del login
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify(loginData.user)); 

      // Redirigir al blog
      navigate('/blog');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Crear cuenta</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Nombre
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label className="block mb-2">
          Email
          <input
            type="email"
            className="w-full p-2 border rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4">
          Contraseña
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            placeholder="Mínimo 6 caracteres"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-2 rounded"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      {/* ✅ Info actualizada */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
        <strong>🚀 Registro Real!</strong><br/>
        Tu cuenta se guardará en MongoDB Atlas.<br/>
        Iniciarás sesión automáticamente.
      </div>

      {/* Link a login */}
      <p className="text-center mt-4 text-sm">
        ¿Ya tienes cuenta?{' '}
        <button 
          onClick={() => navigate('/login')}
          className="text-blue-500 hover:underline"
        >
          Inicia sesión aquí
        </button>
      </p>
    </div>
  );
}

export default RegisterForm;