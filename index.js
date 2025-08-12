const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Folder ya kuhifadhi videos
const VIDEOS_DIR = path.join(__dirname, "videos");

// Hakikisha folder ipo
if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR);
}

// Root route
app.get("/", (req, res) => {
    res.send("Video platform backend is running...");
});

// Upload video route
app.post("/upload", (req, res) => {
    if (!req.files || !req.files.video) {
        return res.status(400).send("No video file uploaded");
    }

    const video = req.files.video;
    const uploadPath = path.join(VIDEOS_DIR, video.name);

    // Save video to disk
    video.mv(uploadPath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.send({ message: "Video uploaded successfully", filename: video.name });
    });
});

// Route ya kutazama video
app.get("/videos/:filename", (req, res) => {
    const filePath = path.join(VIDEOS_DIR, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Video not found");
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
