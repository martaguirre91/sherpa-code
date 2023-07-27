const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/dispenserRouter');

const app = express();
app.use(bodyParser.json());

app.use(routes);
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27018/beer-tap-dispenser';

// Middleware para habilitar CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // Permite cualquier origen, sólo para pruebas
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  
app.use(bodyParser.json());
app.use('/dispensers', routes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => console.error('Failed to connect to MongoDB:', err.message));

  module.exports = app