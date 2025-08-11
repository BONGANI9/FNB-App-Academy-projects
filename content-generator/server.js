require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.post("/generate", async (req, res) => {
  const { type, prompt } = req.body;

  try {
    let result;

    if (type === "image") {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: "512x512"
        })
      });
      const data = await response.json();
      result = data.data[0].url;
    } else {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      result = data.choices[0].message.content;
    }

    res.json({ output: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
