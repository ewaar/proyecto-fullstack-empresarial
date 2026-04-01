const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    responsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    priority: {
      type: String,
      enum: ['baja', 'media', 'alta'],
      default: 'media'
    },
    status: {
      type: String,
      enum: ['pendiente', 'en progreso', 'completada'],
      default: 'pendiente'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);