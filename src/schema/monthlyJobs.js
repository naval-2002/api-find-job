const { mongoose } = require("mongoose");

const monthlyJobSchema = mongoose.Schema({
  date: {
    type: String,
  },
  count: {
    type: Number,
  },
});

const MonthlyJob = mongoose.model("monthly Job", monthlyJobSchema);

module.exports = MonthlyJob;
