import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'award'
  },
  points: {
    type: Number,
    required: true,
    min: 1
  },
  criteria: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#FFD700'
  }
}, {
  timestamps: true
});

export default mongoose.model('Badge', badgeSchema);