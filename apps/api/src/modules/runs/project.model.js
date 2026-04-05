const mongoose = require("mongoose");

const projectStateSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  binaryState: {
    type: Buffer,
    required: true
  },
  lastSaved: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const ProjectStateModel = mongoose.model("ProjectState", projectStateSchema);

module.exports = { ProjectStateModel };
