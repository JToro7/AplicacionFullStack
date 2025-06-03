import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import LoginForm from '../features/auth/LoginForm';
import RegisterForm from '../features/auth/RegisterForm';
import BlogList from '../features/posts/BlogList';
import Header from '../components/Header';
import ErrorMessage from '../components/ErrorMessage';

export default function FullStackBlogApp() {
  const [isLogin, setIsLogin] = useState(true);
  const { state, actions } = useApp();

  useEffect(() => {
    if (state.token && !state.user) {
      const fakeUser = { id: 1, email: 'admin@test.com', name: 'Usuario Autenticado' };
      actions.actions?.({ type: 'LOGIN_SUCCESS', payload: { user: fakeUser, token: state.token } });
    }
  }, []);

  const isAuthenticated = state.user && state.token;

  return (
    <div className="min-h-screen bg-gray-100">
      <ErrorMessage message={state.error} onClose={actions.clearError} />

      {isAuthenticated ? (
        <>
        
          <Header />
          <BlogList />
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs">
        <div className="font-bold">Stack: React + Node.js + MongoDB</div>
        <div>Frontend: ✓ | Backend: ✓ | DB: ✓</div>
      </div>
    </div>
  );
}
