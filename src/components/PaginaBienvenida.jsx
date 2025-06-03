import { Link } from 'react-router-dom';

function PaginaBienvenida() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🚀 Mi Blog Full-Stack
        </h1>
        
        <p className="text-gray-600 mb-8">
          Plataforma de blog con autenticación real usando MongoDB Atlas
        </p>
        
        <div className="space-y-4">
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
        </div>
        
        <div className="mt-6 p-3 bg-blue-50 rounded text-sm text-blue-700">
          <strong>Backend :</strong> MongoDB Atlas conm JWT
        </div>
      </div>
    </div>
  );
}

export default PaginaBienvenida;