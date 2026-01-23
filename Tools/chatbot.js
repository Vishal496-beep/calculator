import "dotenv/config";
import Groq from "groq-sdk";

import { tavily } from "@tavily/core";
import NodeCache from "node-cache";
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq();

const cache = new NodeCache({stdTTL: 60 * 60 * 24}); //for 24 hours data is saves

export async function generate(userMessage, threadId) {
  const baseMessage = [
    {
      role: "system",
      content: `You are a smart personal assistant.
         If you know the answer to a question, answer it directly in plain English.
         If the answer requires real-time, local, or up-to-date information, or if you dont know the answer, use the available tools to find it.
         You have access to the following tool:
          webSearch(query: string): Use this to search the internet for current or unknown information.
         Decide when to use your own knowledge and when to use the tool.
         Do not mention the tool unless needed.
         Examples:
         Q: What is the capital of France?
          A: The capital of France is Paris.

         Q: What is the weather in Mumbai right now?
          A: (use the search tool to find the latest weather)

         Q: Who is the Prime Minister of India?
          A: The current Prime Minister of India is Narendra Modi.

         Q: Tell me the latest IT news.
          A: (use the search tool to get the latest news)

           current date and time: ${new Date().toUTCString()} `,
    },
    //  {
    //   role: "user",
    //   content: "whats the weather in chandigarh right now?",
    //   //When was iphone 16 launched?
    //   //what is the current weather in chandigarh?
    //  },
  ];

  const messages = cache.get(threadId) ?? baseMessage

  messages.push({
    role: "user",
    content: userMessage,
  });

  let MAX_RETRIES  = 10;
  let count = 0

  while (true) {
      
      if (count > MAX_RETRIES) {
        return "I could not find the result . Please try again"
      }
      count++;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the latest information and data on the internet",
            parameters: {
              // JSON Schema object
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "the search query to perform search form.",
                },
              },
              required: ["query"],
            },
          },
        },
      ],

      tool_choice: "auto",
    });
    //    console.log(JSON.stringify(completion.choices[0].message, null, 2));

    messages.push(completion.choices[0].message);

    const toolcalls = completion.choices[0].message.tool_calls;

    if (!toolcalls) {
      //here we end chatbot responses
       cache.set(threadId, messages)
      //  console.log(JSON.stringify(cache.data));
       
      return completion.choices[0].message.content;
    }

    for (const tool of toolcalls) {
      // console.log('tool:', tool);
      const functionName = tool.function.name;
      const functionParams = tool.function.arguments;

      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionParams));
        //  console.log('Tool result:', toolResult);
        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }

    //console.log(JSON.stringify(completion2.choices[0].message, null, 2));
  }
}

//   main().catch(console.error);

async function webSearch({ query }) {
  // console.log('calling web search....');
  const response = await tvly.search(query);
  // console.log('Response:', response);

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");

  //here we will do tavilly api call
  return finalResult;
}
