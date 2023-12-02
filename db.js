const mongoose = require('mongoose');

const username = 'haseebishtiaq300';
const password = 'KKPy78Sm2w2iLvWq';
const dbName = 'Feedback_tool';

const uri = `mongodb+srv://${username}:${password}@cluster0.o2fuvov.mongodb.net/${dbName}`;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
