import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PostForm from './PostForm';

export default function PostCard({ post }) {
  const [isEditing, setIsEditing] = useState(false);
  const { state, actions } = useApp();

  const canEdit = state.user?.id === post.userId;

  const handleEdit = async (formData) => {
    try {
      await actions.updatePost(post.id, formData);
      setIsEditing(false);
    } catch (error) {
      // estos errores de aqui son manejados por el reducer
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      try {
        await actions.deletePost(post.id);
      } catch (error) {
        // este tambien es manejado por el reducer
      }
    }
  };

  if (isEditing) {
    return (
      <PostForm
        post={post}
        onSubmit={handleEdit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <article className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
        {canEdit && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700 p-1"
              title="Editar"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 p-1"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>

      <div className="text-sm text-gray-500 border-t pt-3">
        <div className="flex justify-between">
          <span>Por: {post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString('es-ES')}</span>
        </div>
        {post.updatedAt !== post.createdAt && (
          <div className="text-xs text-gray-400 mt-1">
            Editado: {new Date(post.updatedAt).toLocaleDateString('es-ES')}
          </div>
        )}
      </div>
    </article>
  );
}
