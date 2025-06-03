import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import PostCard from '../../components/PostCard';
import PostForm from '../../components/PostForm';
import Loading from '../../components/Loading';
import Header from '../../components/Header';

export default function BlogList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { state, actions } = useApp();

  useEffect(() => {
    actions.loadPosts();
  }, []);

  const handleCreatePost = async (formData) => {
    try {
      await actions.createPost(formData, state.user.id);
      setShowCreateForm(false);
    } catch (error) {
      // Error manejado por el reducer
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Posts del Blog</h2>
                <p className="text-gray-600 mt-1">
                  Comparte tus ideas y pensamientos
                </p>
              </div>
              
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <Plus size={18} className="mr-2" />
                {showCreateForm ? 'Cancelar' : 'Nuevo Post'}
              </button>
            </div>

            {showCreateForm && (
              <div className="mb-8">
                <PostForm
                  onSubmit={handleCreatePost}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            )}

            {state.loading && (
              <div className="flex justify-center py-12">
                <Loading />
              </div>
            )}

            {!state.loading && state.posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No hay posts aún
                  </h3>
                  <p className="text-gray-500 mb-4">
                    ¡Sé el primero en compartir algo interesante!
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Crear mi primer post
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {state.posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {!state.loading && state.posts.length > 0 && (
              <div className="mt-12 text-center text-sm text-gray-500">
                {state.posts.length} {state.posts.length === 1 ? 'post publicado' : 'posts publicados'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}