const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: String,
  website: String,
  description: String,
  detectedPages: [
    {
      url: String,
      status: String,
      scrapedData: [String],
    },
  ],
  chatbotTrainingProgress: { type: Number, default: 0 }, // NEW FIELD
});

module.exports = mongoose.model("Company", CompanySchema);
