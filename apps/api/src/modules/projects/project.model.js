const { Schema, model } = require("mongoose");

const ProjectStateSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    // Yjs document update as a binary Buffer
    // This stores the entire history/state of the shared document
    binaryState: { type: Buffer, required: true },
    lastSaved: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const ProjectStateModel = model("ProjectState", ProjectStateSchema);

module.exports = { ProjectStateModel };
