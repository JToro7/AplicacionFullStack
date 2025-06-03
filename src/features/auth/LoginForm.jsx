import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import API_URL from '../../utils/api';


function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { actions } = useApp()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

  
  try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }  

      //Se Guarda el token y user (según el authController.js)

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

       if (actions.syncFromLocalStorage) {
        actions.syncFromLocalStorage();
      } else if (actions.dispatch) {
        actions.dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: data.user, token: data.token } 
        });
      }

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
      <h2 className="text-xl font-bold mb-4 text-center">Iniciar Sesión</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
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
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 rounded"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
        <strong>Conectado con MongoDB!</strong><br/>
        Regístrate o usa cualquier cuenta que hayas creado.<br/>
        Datos guardados en MongoDB Atlas.
      </div>
    </div>
  );
}

export default LoginForm;