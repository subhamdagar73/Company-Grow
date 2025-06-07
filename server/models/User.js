import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['employee', 'manager', 'admin'],
    default: 'employee'
  },
  profileImage: {
    type: String,
    default: ''
  },
  skills: [{
    name: String,
    level: {
      type: Number,
      min: 1,
      max: 5,
      default: 1
    }
  }],
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }],
  totalPoints: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'Beginner'
  }
}, {
  timestamps: true
});

userSchema.pre('save', function(next) {
  if (this.isModified('totalPoints')) {
    if (this.totalPoints < 10) {
      this.rank = 'Beginner';
    } else if (this.totalPoints < 100) {
      this.rank = 'Intermediate';
    } else {
      this.rank = 'Advanced';
    }
  }
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);