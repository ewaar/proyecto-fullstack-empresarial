const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título de la tarea es obligatorio'],
      trim: true,
      minlength: [2, 'El título debe tener al menos 2 caracteres']
    },

    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      minlength: [5, 'La descripción debe tener al menos 5 caracteres']
    },

    responsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El responsable es obligatorio']
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
      min: [0, 'El progreso no puede ser menor a 0'],
      max: [100, 'El progreso no puede ser mayor a 100'],
      default: 0
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'El proyecto es obligatorio']
    },

    parentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null
    },

    previousTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null
    },

    version: {
      type: Number,
      default: 1
    },

    followUpDate: {
      type: Date,
      default: Date.now
    },

    isLatest: {
      type: Boolean,
      default: true
    },

    actionType: {
      type: String,
      enum: ['creacion', 'seguimiento', 'finalizacion'],
      default: 'creacion'
    }
  },
  {
    timestamps: true
  }
);

taskSchema.index({ project: 1, parentTask: 1, version: 1 });
taskSchema.index({ project: 1, title: 1 });
taskSchema.index({ isLatest: 1 });

module.exports = mongoose.model('Task', taskSchema);