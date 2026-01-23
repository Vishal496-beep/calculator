import 'dotenv/config'
import { generate } from "./chatbot.js"
import cors from 'cors'
import express from "express"
const app = express()
const port = 3001

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/chat', async (req, res) => {
  
  try {
    const { message, threadId } = req.body;
    console.log("message:", message);
         //todo validate above fields
       if (!(message || threadId)) {
          return res.status(400).json({message: 'All fields are required'})
       }

    const result = await generate(message, threadId);

    res.json({ message: result });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "LLM failed" });
  }
});

app.listen(port, () => {
  console.log(`Server is running ${port}`)
})