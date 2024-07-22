const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
    },
  ],
});

userSchema.methods.generateAccessToken = function (secretKey) {
    try {
        return jwt.sign(
            { id: this._id, email: this.email },
            secretKey,
            { expiresIn: '30d' } // Token expires in 30 days
        );
    } catch (err) {
        console.error('Error creating JWT token', err);
        process.exit(1);
    }
};

module.exports = mongoose.model('User', userSchema);
