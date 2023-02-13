const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

// Routes
const authRoutes = require('./src/routes/auth.route');
const userRoutes = require('./src/routes/user.route');

const port = process.env.PORT || 4001;

const app = express();

app.use(express.json());
// setting up public folder
app.use(express.static('public'));
// setting up view engine
// app.use('view engine', 'ejs');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);


const connectDatabase = () => {
  const dbUrl = `mongodb+srv://tourappmay2022:${process.env.MONGODB_PASSWORD}@cluster0.hwkx9.mongodb.net/${process.env.MOGNODB_DB}`;
  const localHost = 'mongodb://localhost:27017/tourInfo_v2';
  const env = process.env.ENV

  mongoose.set('strictQuery', false);
  return mongoose.connect(env === 'DEV' ? localHost : dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
};

connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`tourInfo service running successfully on port ${port}`);
  })
}).catch((err) => {
  console.error(`tourInfo service did not started`, err);
})