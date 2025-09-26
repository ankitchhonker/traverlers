// controller/generateController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateDescription = async (req, res) => {
  try {
    const { title, location, country, category, price } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      Write an attractive property listing description. in very short in just 2 line only that relate to this info:
      Title: ${title}
      Location: ${location}, ${country}
      Category: ${category}
      Price per night: ₹${price}
      Tone: Friendly.
    `;

    const result = await model.generateContent(prompt);
    const aiDescription = result.response.text();

    res.json({ description: aiDescription });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "Failed to generate description" });
  }
};

module.exports = { generateDescription };
