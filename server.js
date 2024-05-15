// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require("express");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const getProducts = require("./fetch.js");
const getDetails = require("./fetchv3.js");
const getGovtDetails = require("./govtSearch.js");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

let arr = [];
let govt = [];

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 64,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
    {
      text: `input: "Product DetailsAbout Prazopress XL 5 Tablet 30'sPrazopress XL 5 Tablet 30's contains an 'anti-hypertensive' medication primarily used to treat hypertension (high blood pressure) and lower any future risk of heart attack and stroke. \n what is the name of the medicine`,
    },
    { text: "output: " },
    {
      text: "input: " + userInput,
    },
    { text: "output: " },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  return response.text();
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/select", (req, res) => {
  res.sendFile(__dirname + "/select.html");
});
app.get("/loader.gif", (req, res) => {
  res.sendFile(__dirname + "/loader.gif");
});

app.get("/search", async (req, res) => {
  let q = req.query.name;
  let d1 = await getProducts(q);
  res.send(d1);
});

app.get("/getItem", async (req, res) => {
  try {
    let q = req.query.key;
    let d1 = await getDetails(q);
    let alternatives = await getProducts(
      d1[1].filter((e) => e.key == "composition")[0].value
    );
    govt.push(d1[1].filter((e) => e.key == "composition")[0].value);
    arr.push(
      d1[0] +
        "\n" +
        JSON.stringify(d1[1]) +
        "\n" +
        d1[2].join("\n") +
        "\n Alternatives to the medicine or Generic Version of the medicines \n" +
        JSON.stringify(alternatives)
    );
    res.send((arr.length - 1).toString());
  } catch (err) {
    console.log(err);
    res.send(null);
  }
});

app.post("/chat", async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    const id = req.body?.id;
    console.log("incoming /chat req", userInput);
    if (!userInput) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    console.log(arr[parseInt(id) || 0].toString() + "\n");
    const response = await runChat(
      arr[parseInt(id) || 0].toString() +
        "\n" +
        userInput +
        "\n give answers in about one line or in less than 100 words"
    );
    console.log(response);
    res.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/govt", async (req, res) => {
  let data = await getGovtDetails(govt[parseInt(req.query?.id)] || "");

  res.send(data);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
