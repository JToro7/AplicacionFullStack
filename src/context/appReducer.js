export const initialState = {
  user: (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Error al cargar usuario desde localStorage:', error);
      return null;
    }
  })(),
  token: localStorage.getItem('token'),
  posts: [],
  loading: false,
  error: null
};

export default function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
      
    case 'LOGIN_SUCCESS':
      // Guardar en localStorage cuando hay login exitoso
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
      
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        token: null,
        posts: []
      };
      
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false };
      
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
      
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(p => p.id === action.payload.id ? action.payload : p)
      };
      
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(p => p.id !== action.payload)
      };
      
    default:
      return state;
  }
}