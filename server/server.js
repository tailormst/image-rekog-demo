const express = require("express");
const app = express();
const path = require("path");
const { Rekognition } = require("@aws-sdk/client-rekognition");

const rekognition = new Rekognition({
    region: "us-east-1",
});

app.use(express.json({ limit: "50mb" }));
app.use(express.static("../public"));
app.post("/rekognize/image", async (req, res) => {
    const imageData = req.body.data;
    const buf = Buffer.from(imageData, "base64");
    rekognition.detectLabels(
        {
            Image: { Bytes: buf },
            MaxLabels: 7,
            MinConfidence: 70,
        },
        function (err, data) {
            if (err) {
                console.log(err);
                return res.status(400).json(err);
            } else {
                console.log(data);
                return res.status(200).json(data);
            }
        }
    );
});

app.post("/rekognize/face", async (req, res) => {
    const imageData = req.body.data;
    const buf = Buffer.from(imageData, "base64");
    rekognition.detectFaces(
        {
            Image: { Bytes: buf },
            Attributes: ["ALL"],
        },
        function (err, data) {
            if (err) {
                console.log(err);
                return res.status(400).json(err);
            } else {
                console.log(data);
                return res.status(200).json(data);
            }
        }
    );
});

app.listen(3000, () => {
    console.log("Server Started on Port 3000. Press Ctrl+C to Quit");
});