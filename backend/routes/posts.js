const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BlogPost = require('../models/BlogPost');

// POST /api/posts - Create post (protected)
router.post('/', auth, async (req, res) => {
  const { title, content, published } = req.body;

  try {
    const newPost = new BlogPost({
      author: req.user.id,
      title,
      content,
      published: published || false,
      createdAt: new Date()
    });
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/posts - get all published posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true }).populate('author', 'name');
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET /api/posts/:id - get post by id (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (!post.published) return res.status(401).json({ msg: 'Post not published' });
    res.json(post);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PUT /api/posts/:id - update post (protected)
router.put('/:id', auth, async (req, res) => {
  const { title, content, published } = req.body;

  try {
    let post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    post.title = title || post.title;
    post.content = content || post.content;
    if (typeof published !== 'undefined') {
      post.published = published;
    }
    post.updatedAt = new Date();

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE /api/posts/:id - delete post (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    await post.remove();
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
