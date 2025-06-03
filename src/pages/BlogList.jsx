import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';

export default function BlogList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { state, actions } = useApp();

  useEffect(() => {
    actions.loadPosts();
  }, []);

  const handleCreatePost = async (formData) => {
    try {
      await actions.createPost(formData);
      setShowCreateForm(false);
    } catch (error) {
      // Error ya manejado por el contexto
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Posts del Blog</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            {showCreateForm ? 'Cancelar' : 'Nuevo Post'}
          </button>
        </div>

        {showCreateForm && (
          <PostForm
            onSubmit={handleCreatePost}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {state.loading && <Loading />}

        {state.posts.length === 0 && !state.loading ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay posts publicados aún.</p>
            <p className="text-sm mt-2">¡Sé el primero en crear uno!</p>
          </div>
        ) : (
          <div>
            {state.posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
