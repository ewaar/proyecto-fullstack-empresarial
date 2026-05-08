const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del proyecto es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      minlength: [5, 'La descripción debe tener al menos 5 caracteres']
    },
    startDate: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria']
    },
    endDate: {
      type: Date,
      required: [true, 'La fecha de fin es obligatoria']
    },
    status: {
      type: String,
      enum: ['pendiente', 'en progreso', 'finalizado'],
      default: 'pendiente'
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'El cliente es obligatorio']
    }
  },
  {
    timestamps: true
  }
);

projectSchema.index(
  {
    name: 1,
    client: 1
  },
  {
    unique: true,
    collation: {
      locale: 'en',
      strength: 2
    }
  }
);

module.exports = mongoose.model('Project', projectSchema);