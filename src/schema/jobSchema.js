const mongoose = require("mongoose");

const JobSchema = mongoose.Schema(
  {
    position: {
      type: String,
    },
    company: {
      type: String,
    },
    jobLocation: {
      type: String,
    },
    status: {
      type: String,
    },
    jobType: {
      type: String,

      enum: ["full-time", "part-time", "internship", "remote"],
    },
  },
  { timestamps: true }
);
JobSchema.index({
  company: "text",
  jobLocation: "text",
  position: "text",
});

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
