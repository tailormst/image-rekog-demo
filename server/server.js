const express = require("express");
const app = express();
const path = require("path");
const { RekognitionClient, DetectLabelsCommand, DetectFacesCommand } = require("@aws-sdk/client-rekognition");

// Initialize Rekognition Client
const rekognition = new RekognitionClient({
    region: "us-east-1",
});

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "../public")));

// Route for Image Label Detection
app.post("/rekognize/image", async (req, res) => {
    try {
        const imageData = req.body.data;
        if (!imageData) {
            return res.status(400).json({ message: "No image data provided" });
        }
        const buf = Buffer.from(imageData, "base64");

        const command = new DetectLabelsCommand({
            Image: { Bytes: buf },
            MaxLabels: 7,
            MinConfidence: 70,
        });

        const data = await rekognition.send(command);
        console.log("Labels:", data);
        return res.status(200).json(data);
    } catch (error) {
        console.error("Detect Labels Error:", error);
        return res.status(500).json({ message: "Error detecting labels", error });
    }
});

// Route for Facial Attribute Detection
app.post("/rekognize/face", async (req, res) => {
    try {
        const imageData = req.body.data;
        if (!imageData) {
            return res.status(400).json({ message: "No image data provided" });
        }
        const buf = Buffer.from(imageData, "base64");

        const command = new DetectFacesCommand({
            Image: { Bytes: buf },
            Attributes: ["ALL"],
        });

        const data = await rekognition.send(command);
        console.log("Face Details:", data);
        return res.status(200).json(data);
    } catch (error) {
        console.error("Detect Faces Error:", error);
        return res.status(500).json({ message: "Error detecting faces", error });
    }
});

// Start Server
app.listen(3000, () => {
    console.log("Server Started on Port 3000. Press Ctrl+C to Quit");
});
