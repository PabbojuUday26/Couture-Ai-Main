import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config();  // Load .env file

const app = express();
app.use(express.json());
app.use(cors());  // Enable CORS for frontend requests

const API_KEY = process.env.HF_API_KEY;
const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

// Log to check if API key is loaded correctly
if (!API_KEY) {
    console.error("❌ ERROR: Hugging Face API key is missing! Check .env file.");
    process.exit(1);  // Exit process if API key is missing
}

app.post("/generate", async (req, res) => {
    const { inputs } = req.body;

    if (!inputs) {
        return res.status(400).json({ error: "Missing clothing description" });
    }

    console.log("🔹 Generating image for:", inputs); // Log request

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error (${response.status}):`, errorText);
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const imageBuffer = await response.arrayBuffer();
        console.log("✅ Image generated successfully!");

        res.setHeader("Content-Type", "image/png");
        res.send(Buffer.from(imageBuffer));
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ error: "Failed to generate image. Check logs for details." });
    }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
