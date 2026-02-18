import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true, 
    required: true,
  },
  image: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
});

const User = models.User || model('User', UserSchema);

export default User;