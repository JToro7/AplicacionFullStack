import { AuthService } from '../services/authService.js';
import API_URL from '../utils/api.js';

// Función helper para posts con autenticación
async function makeAuthenticatedRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // JWT para el backend
        ...options.headers
      },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se puede conectar al servidor backend');
    }
    throw error;
  }
}

export const mockAPI = {
  async login(email, password) {
    return await AuthService.login(email, password);
  },

  async register(userData) {
    return await AuthService.register(userData);
  },

  async getPosts() {
    try {
      const posts = await makeAuthenticatedRequest('/posts', {
        method: 'GET'
      });
      
      return posts;
    } catch (error) {
      throw error;
    }
  },

  async createPost(postData, userId) {
    console.log('📝 mockAPI.createPost - Enviando al backend:', postData);
    
    if (!postData.title || !postData.content) {
      throw new Error('Título y contenido son requeridos');
    }

    try {
      const newPost = await makeAuthenticatedRequest('/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: postData.title,
          content: postData.content
        })
      });
      
      return newPost;
    } catch (error) {
      throw error;
    }
  },

  async updatePost(postId, postData, userId) {
    
    try {
      const updatedPost = await makeAuthenticatedRequest(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: postData.title,
          content: postData.content
        })
      });
      
      return updatedPost;
    } catch (error) {
      throw error;
    }
  },

  async deletePost(postId, userId) {
    
    try {
      const result = await makeAuthenticatedRequest(`/posts/${postId}`, {
        method: 'DELETE'
      });
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
};

export default mockAPI;