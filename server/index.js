// backend/index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    seedEmails(); // Seed emails after successful connection
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a schema for allowed emails
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Unique and required field
});

// Create a model based on the schema
const Email = mongoose.model("Email", emailSchema);

// Email Verification Endpoint
app.post("/verify-email", async (req, res) => {
  const { email } = req.body;
  try {
    const foundEmail = await Email.findOne({ email });
    if (foundEmail) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: "Email is not authorized." });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only images are allowed!");
    }
  },
});

// Profile Picture Upload Endpoint
app.post("/upload-profile", upload.single("profilePic"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  res.json({
    success: true,
    message: "File uploaded successfully",
    url: `http://localhost:${PORT}/uploads/${req.file.filename}`,
  });
});

// Serve static files in the uploads folder
app.use("/uploads", express.static("uploads"));

// Function to seed emails
const seedEmails = async () => {
  const emailsToSeed = [
    "abhijit017@gmail.com",
    "abhiramkumar00@gmail.com",
    "chdry.abhishek@gmail.com",
    "abivm3010@gmail.com",
    "ajesh2k4@gmail.com",
    "ajithajay446@gmail.com",
    "altaf.aqeel@gmail.com",
    "anumita.laskar@gmail.com",
    "anurajrv2018@gmail.com",
    "ashwinims18@gmail.com",
    "pbalaji2707@gmail.com",
    "bhavinuvyas@thevyas.co.in",
    "kuntapalli.bhavishya@gmail.com",
    "bkp940397@gmail.com",
    "lopamuddra@gmail.com",
    "gagan.mathur@gmail.com",
    "harshu77vc@gmail.com",
    "bhandari.hritik@gmail.com",
    "singh.kamlesh25@gmail.com",
    "dmaheshkumar.1995@gmail.com",
    "manjunathreddy.siddalingannagari@tesco.com",
    "manojkumar0868@gmail.com",
    "oktamoizuddin@gmail.com",
    "mukeshgowda00012@gmail.com",
    "nandakishoreph@gmail.com",
    "neerajarmahajan@gmail.com",
    "nithin.panjala@techdemocracy.com",
    "oppili07@outlook.com",
    "pnk507@gmail.com",
    "kulharipooja1993@gmail.com",
    "puja4life1@gmail.com",
    "rahulragavan373@gmail.com",
    "pradeep47a@gmail.com",
    "pramodkumar.gondi@gmail.com",
    "pravingt9@gmail.com",
    "priyaa43@gmail.com",
    "ranjith211295@gmail.com",
    "rashmikn.cism@gmail.com",
    "natarajrashmi@johndeere.com",
    "ravichhetri17@gmail.com",
    "rohitja1988@gmail.com",
    "rohits.cissp@gmail.com",
    "roopale218@gmail.com",
    "pavanitta234@duck.com",
    "tawargeri.sameer@gmail.com",
    "avles1984@gmail.com",
    "siddhurao@icloud.com",
    "an.sivagami@gmail.com",
    "sknomanbusiness@gmail.com",
    "sudheerhr@gmail.com",
    "asksukumar@gmail.com",
    "swathikanchan96@gmail.com",
    "tanujain1306@gmail.com",
    "tejeshchauhan649@gmail.com",
    "thotarajesh2739@gmail.com",
    "tushar.sharma715@gmail.com",
    "venki06@gmail.com",
    "venkatesann2595@gmail.com",
    "vidhijain883@gmail.com",
    "vinodmvk2404@gmail.com",
    "vs.travelbuddy@gmail.com",
    "visveswarreddy37@gmail.com",
  ];

  try {
    for (const email of emailsToSeed) {
      const existingEmail = await Email.findOne({ email });
      if (!existingEmail) {
        await Email.create({ email });
        console.log(`Seeded email: ${email}`);
      } else {
        console.log(`Email already exists: ${email}`);
      }
    }
  } catch (error) {
    console.error("Error seeding emails:", error);
  }
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
