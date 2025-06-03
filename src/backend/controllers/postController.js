import Post from '../models/Post.js';
import User from '../models/User.js';

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
        
    // Formatear posts para el frontend
    const formattedPosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      content: post.content,
      author: post.author.username,
      userId: post.author._id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));
    
    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener posts', error: error.message });
  }
};

export const createPost = async (req, res) => {
  
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Título y contenido son requeridos' });
    }
    
    // Obtener información del usuario
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Crear el nuevo post
    const newPost = new Post({
      title,
      content,
      author: req.userId
    });

    const savedPost = await newPost.save();
    
    // Populate para la respuesta
    const populatedPost = await Post.findById(savedPost._id).populate('author', 'username');
    
    const formattedPost = {
      id: populatedPost._id,
      title: populatedPost.title,
      content: populatedPost.content,
      author: populatedPost.author.username,
      userId: populatedPost.author._id,
      createdAt: populatedPost.createdAt,
      updatedAt: populatedPost.updatedAt
    };
    
    res.status(201).json(formattedPost);
    
  } catch (error) {
    res.status(500).json({ message: 'Error al crear post', error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    // Verificar que el usuario sea el autor
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'No autorizado para editar este post' });
    }
    
    post.title = title;
    post.content = content;
    
    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate('author', 'username');
    
    const formattedPost = {
      id: populatedPost._id,
      title: populatedPost.title,
      content: populatedPost.content,
      author: populatedPost.author.username,
      userId: populatedPost.author._id,
      createdAt: populatedPost.createdAt,
      updatedAt: populatedPost.updatedAt
    };
    
    res.status(200).json(formattedPost);
    
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar post', error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    // Verificar que el usuario sea el autor
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'No autorizado para eliminar este post' });
    }
    
    await Post.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Post eliminado exitosamente' });
    
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar post', error: error.message });
  }
};