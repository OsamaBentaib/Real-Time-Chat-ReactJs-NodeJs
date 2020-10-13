const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('Message', messageSchema);