import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import PaginaBienvenida from './components/PaginaBienvenida';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import BlogList from './features/posts/BlogList';
import ProtectedRoute from './components/ProtectedRoute'; 
function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<PaginaBienvenida />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        
        <Route 
          path="/blog" 
          element={
            <ProtectedRoute>
              <BlogList />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<h1>¡Página no encontrada!</h1>} />
      </Routes>
    </AppProvider>
  );
}

export default App;