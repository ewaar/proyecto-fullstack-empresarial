const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Correo electrónico inválido']
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      unique: true,
      trim: true,
      minlength: [8, 'El teléfono debe tener al menos 8 números']
    },
    company: {
      type: String,
      required: [true, 'La empresa es obligatoria'],
      trim: true
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

clientSchema.index(
  {
    name: 1,
    company: 1
  },
  {
    unique: true,
    collation: {
      locale: 'en',
      strength: 2
    }
  }
);

module.exports = mongoose.model('Client', clientSchema);