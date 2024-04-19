
const express = require('express');
const { register, login, adminAuth, adminLogout, createBlog, getAllBlogs, deleteBlog, getSingleBlog, updateBlog } = require('../controllers/adminController');
const verifyAdminToken = require('../middleware/adminMiddleware');
const Blog = require('../model/blogModel');
const router = express.Router();


// Admin registration route
router.post('/admin/register', register);

// Admin login route
router.post('/admin/login', login);
router.post('/admin/create-blog', createBlog);
router.get('/admin/allblogs', getAllBlogs);
router.delete('/admin/delete-blog/:id',deleteBlog)
router.get('/blogs/:blogId', async (req, res) => {
  const { blogId } = req.params;
  try {
    // Fetch the blog based on blogId from your database
    const blog = await Blog.findById(blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(200).json({ message: 'Blog fetched successfully', blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('admin/update-blog',updateBlog)

router.get('/admin/protected', verifyAdminToken, (req, res) => {
    res.json({ message: 'This is a protected route' });
  });

router.get('/adminAuth', verifyAdminToken, adminAuth);
router.get("/admin/logout",adminLogout)
module.exports = router;
