import OpenAI from "openai"
import { Content } from "openai/resources/containers/files/content.mjs"

const client = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
})

const completion = await client.chat.completions.create({
  temperature:1,  
  // top_p: 0.2,
  // stop:["\n"], //Negative
  // max_completion_tokens:1000,
  // max_tokens:'',
  // frequency_penalty:1,
  // presence_penalty: 1
// _____________________________________________________________________________________________________,

  response_format: {type: 'json_schema',json_schema: {schema: {'type': 'object'}}},

  model: "openai/gpt-oss-20b",
  messages: [
    // We are giving it persona , system persona | WE SHOULD ALWAYS GIVE SYSTEM BEHAVIOUR ITS PERSONA ALWAYS ON SYSTEM PERSONA SECTION
    {
       role:'system',
       content: `content: You are a interview grader assistant. Your task is to generate candidate evaluation score.
                 Output must be following JSON structure:
                  {
                    "confidence": number (1–10 scale),
                    "accuracy": number (1–10 scale),
                    "pass": boolean (true or false)
                }

                The response must:
                    1. Include ALL fields shown above
                    2. Use only the exact field names shown
                    3. Follow the exact data types specified
                    4. Contain ONLY the JSON object and nothing else
`


      //  content: `You are Friday, a smart review grader. Your task is to analyse given review and return the sentiment:Be always polite. Classify the review as positive , negative or neutaral .You must return the result in a valid JSON structure
      //  example: ("sentiment": "Negative")   json- response_format
      //  `
    },
    // We are giving input to the assistant ai as a user
    {
      role: 'user',
      content: `Q: What does === do in JavaScript?
            A: It checks strict equality—both value and type must match.

            Q: How do you create a promise that resolves after 1 second?
            A: const p = new Promise(r => setTimeout(r, 1000));

            Q: What is hoisting?
            A: JavaScript moves declarations (but not initializations) to the top of their scope before code runs.

            Q: Why use let instead of var?
            A: let is block-scoped, avoiding the function-scope quirks and re-declaration issues of var.
            `

      //  role: "user", 
      //  content: `Review: These headphones arrived quickly and look great, but the left earcup stopped working after a week
      //  Sentiment:`
    }
  ]
});

console.log(completion.choices[0].message.content);
 




