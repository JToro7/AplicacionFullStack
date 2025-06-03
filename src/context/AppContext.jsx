import { createContext, useContext, useReducer } from 'react';
import appReducer, { initialState } from './appReducer';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    async login(email, password) {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const result = await import('../api/mockAPI').then(api => api.mockAPI.login(email, password));
        dispatch({ type: 'LOGIN_SUCCESS', payload: result });
        return result;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    async register(userData) {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const result = await import('../api/mockAPI').then(api => api.mockAPI.register(userData));
        dispatch({ type: 'LOGIN_SUCCESS', payload: result });
        return result;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    },

    async loadPosts() {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const posts = await import('../api/mockAPI').then(api => api.mockAPI.getPosts());
        dispatch({ type: 'SET_POSTS', payload: posts });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    },

    async createPost(postData, userId) {
      try {
        const newPost = await import('../api/mockAPI').then(api => api.mockAPI.createPost(postData, userId));
        dispatch({ type: 'ADD_POST', payload: newPost });
        return newPost;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    async updatePost(postId, postData, userId) {
      try {
        const updatedPost = await import('../api/mockAPI').then(api => api.mockAPI.updatePost(postId, postData, userId));
        dispatch({ type: 'UPDATE_POST', payload: updatedPost });
        return updatedPost;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    async deletePost(postId, userId) {
      try {
        await import('../api/mockAPI').then(api => api.mockAPI.deletePost(postId, userId));
        dispatch({ type: 'DELETE_POST', payload: postId });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    clearError() {
      dispatch({ type: 'SET_ERROR', payload: null });
    }
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe usarse dentro de AppProvider');
  return context;
}