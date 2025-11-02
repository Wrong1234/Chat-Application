import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    trim: true 
  },
  mediaUrl: {
    type: String
  },
  thumbnailUrl: {
    type: String
  },
  fileUrl: { type: String, default: null },
  fileSize: {
    type: Number
  },
  duration: {
    type: Number // for audio/video in seconds
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  deliveredTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deliveredAt: {
      type: Date
    }
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date
    }
  }],
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  publicId: {
    type: String,
    default: null,
  },
  cloudinaryId: {
    type: String,
    default: null,
  },
  fileType: {
    type: String,
    // enum: ['image', 'video', 'audio', 'document'],
    // default: 'image',
  },
  mimeType: {
    type: String,
    default: null,
  },
  fileSize: {
    type: Number,
    default: null,
  },
  uploadedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true
});

// Indexes for performance
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });


const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;