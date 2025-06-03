// src/components/Header.jsx - VERSIÓN MEJORADA
import { LogOut, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Header() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Verificar contexto primero
    if (state.user) {
      setCurrentUser(state.user);
      return;
    }

    // Si no hay en contexto, verificar localStorage
    const localStorageUser = localStorage.getItem('user');
    const localStorageToken = localStorage.getItem('token');
    
    if (localStorageUser && localStorageToken) {
      try {
        const user = JSON.parse(localStorageUser);
        setCurrentUser(user);
        
        // SINCRONIZAR CONTEXTO SI ES NECESARIO
        if (actions.syncFromLocalStorage) {
          actions.syncFromLocalStorage();
        } else if (actions.dispatch) {
          actions.dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user, token: localStorageToken } 
          });
        }
        
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, [state.user, actions]);

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      actions.logout();
      setCurrentUser(null);
      navigate('/');
    }
  };

  // NO RENDERIZAR SI NO HAY USUARIO
  if (!currentUser) {
    return null;
  }

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">Mi Blog Full-Stack</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-blue-700 px-3 py-2 rounded-lg">
            <User size={16} className="text-blue-200" />
            <div className="text-right">
              <div className="font-medium text-sm">
                {currentUser?.username || currentUser?.name || 'Usuario'}
              </div>
              <div className="text-blue-200 text-xs">
                {currentUser?.email}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut size={16} className="mr-2" />
            <span className="font-medium">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;