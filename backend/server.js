require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');


const app = express();

// MongoDB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit with failure
  }
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
// Import User model
const User = require('./models/User');

// Simple root route
app.get('/', (req, res) => {
  res.send('Hello from UCT Blog CMS Backend!');
});

// Test route to fetch all users
app.get('/test-user', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); // Send back list of users
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
