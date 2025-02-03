const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const Company = require("../models/Company");

const router = express.Router();

// Fetch Meta Description
const fetchMetaDescription = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return (
      $('meta[name="description"]').attr("content") || "No description found"
    );
  } catch (error) {
    console.error("Error fetching meta description:", error);
    return "Error fetching description";
  }
};

// Register Company
router.post("/register", async (req, res) => {
  const { name, website, description } = req.body;
  const metaDescription = await fetchMetaDescription(website);

  try {
    const newCompany = new Company({
      name,
      website,
      description: metaDescription || description,
      detectedPages: [
        {
          url: `${website}/about`,
          status: "scraped",
          scrapedData: ["About Us content"],
        },
        { url: `${website}/contact`, status: "pending", scrapedData: [] },
      ],
      chatbotTrainingProgress: 0, // Set training progress to 0 at start
    });

    await newCompany.save();

    // Start chatbot training in the background
    startChatbotTraining(newCompany._id);

    res.json({
      message: "Company registered successfully",
      company: newCompany,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to simulate chatbot training
const startChatbotTraining = async (companyId) => {
  let progress = 0;

  const interval = setInterval(async () => {
    progress += 20; // Increase progress by 20% every 2 seconds

    await Company.findByIdAndUpdate(companyId, {
      chatbotTrainingProgress: progress,
    });

    if (progress >= 100) {
      clearInterval(interval); // Stop when training reaches 100%
    }
  }, 2000);
};

// Fetch pages for a company
router.get("/:companyId/pages", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company.detectedPages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pages" });
  }
});

// Get chatbot training progress
router.get("/:companyId/training-status", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ progress: company.chatbotTrainingProgress });
  } catch (error) {
    res.status(500).json({ message: "Error fetching training status" });
  }
});

module.exports = router;
