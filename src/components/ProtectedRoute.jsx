import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { state, actions } = useApp();
  
  // VERIFICAR MÚLTIPLES FUENTES
  const contextAuthenticated = state.user && state.token;
  const localStorageToken = localStorage.getItem('token');
  const localStorageUser = localStorage.getItem('user');
  const localStorageAuthenticated = localStorageToken && localStorageUser;
  
  //SINCRONIZAR CONTEXTO CON LOCALSTORAGE
  useEffect(() => {
    // Si hay datos en localStorage pero no en contexto, sincronizar
    if (localStorageAuthenticated && !contextAuthenticated) {
      console.log('🔄 Sincronizando estado desde localStorage...');
      try {
        const user = JSON.parse(localStorageUser);
        // Despachar acción de login exitoso al contexto
        actions.actions ? 
          actions.actions({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user, token: localStorageToken } 
          }) : 
          null;
      } catch (error) {
        // Limpiar localStorage corrupto
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [localStorageAuthenticated, contextAuthenticated]);
  
  //  AUTENTICADO SI ESTÁ EN CONTEXTO O LOCALSTORAGE
  const isAuthenticated = contextAuthenticated || localStorageAuthenticated;
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-6">
              Debes iniciar sesión para acceder al blog.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link 
              to="/login"
              className="block w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Iniciar Sesión
            </Link>
            
            <Link 
              to="/register"
              className="block w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Crear Cuenta
            </Link>
            
            <Link 
              to="/"
              className="block w-full text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              ← Volver al Inicio
            </Link>
          </div>
          
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            <strong>🔒 Área Protegida:</strong> Se requiere autenticación
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;