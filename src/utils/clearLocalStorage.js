export function clearLocalPosts() {
  localStorage.removeItem('blog_posts');
}

clearLocalPosts();