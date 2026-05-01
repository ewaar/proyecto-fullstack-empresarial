const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      default: null
    },

    affectedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    action: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    module: {
      type: String,
      enum: ['clients', 'projects', 'tasks', 'users', 'reports'],
      required: true
    },

    type: {
      type: String,
      enum: [
        'client_created',
        'client_updated',
        'client_deleted',

        'project_created',
        'project_updated',
        'project_deleted',

        'task_created',
        'task_updated',
        'task_deleted',
        'task_status_changed',
        'task_progress_changed',

        'user_created',
        'user_updated',
        'user_deleted',

        'report_generated'
      ],
      required: true
    },

    oldValue: {
      type: String,
      default: ''
    },

    newValue: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('History', historySchema);