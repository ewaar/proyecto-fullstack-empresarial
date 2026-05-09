const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: falta la variable MONGODB_URI');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true
    });

    console.log('Base de datos conectada correctamente');
  } catch (error) {
    console.error('Error al conectar MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;