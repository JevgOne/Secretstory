import {db} from './lib/db.js';

(async () => {
  await db.execute('DELETE FROM blog_posts');
  console.log('✅ Deleted all blog posts');
})();
