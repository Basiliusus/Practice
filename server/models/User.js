const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickname: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: [
      'Frontend Developer', 
      'Backend Developer', 
      'QA Engineer', 
      'Designer', 
      'Manager', 
      'HR'
    ], 
    required: true 
  },
});

module.exports = mongoose.model('User', UserSchema); 