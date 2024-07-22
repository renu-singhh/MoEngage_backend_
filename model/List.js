const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  responseCodes: [
    {
      code: Number,
      url: String,
    },
  ],
  userEmail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("List", listSchema);
