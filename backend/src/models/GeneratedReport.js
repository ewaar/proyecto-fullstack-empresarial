const mongoose = require('mongoose');

const generatedReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['general', 'project'],
      required: true
    },
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    contentType: {
      type: String,
      default: 'application/pdf'
    },
    pdf: {
      type: Buffer,
      required: true
    },
    size: {
      type: Number,
      default: 0
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      default: null
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('GeneratedReport', generatedReportSchema);