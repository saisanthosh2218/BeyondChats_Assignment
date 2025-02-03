require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const Chatbot = require("./models/Chatbot");
require("./config/passport"); // Google OAuth Configuration

const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sai-santhosh-portfolio.netlify.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// ✅ FIX: Initialize session before passport.session()
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret", // Use a strong secret
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Initialize Passport after session middleware
app.use(passport.initialize());
app.use(passport.session());

// console.log(process.env.MONGO_CONNECT)
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);

// Store chatbot integration request
app.post("/api/chatbot/register", async (req, res) => {
  const { website } = req.body;
  try {
    const newChatbot = new Chatbot({ website, integrated: false });
    await newChatbot.save();
    res.json({
      message: "Chatbot registered. Please integrate it on your site.",
    });
  } catch (error) {
    res.status(500).json({ error: "Error registering chatbot." });
  }
});

// Check chatbot integration status
app.get("/api/chatbot/status", async (req, res) => {
  const { website } = req.query;
  try {
    // Simulating a check by requesting the website's HTML
    const { data } = await axios.get(website);
    const isIntegrated = data.includes(
      "https://amazing-salamander-b53819.netlify.app/chatbot.js"
    );

    // Update database status
    await Chatbot.findOneAndUpdate({ website }, { integrated: isIntegrated });

    res.json({ success: isIntegrated });
  } catch (error) {
    console.error("Error fetching website:", error.message);
    res.json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
