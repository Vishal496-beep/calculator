import readline from 'node:readline/promises'
import Groq from "groq-sdk";
import llama from 'llama'
import { tavily } from '@tavily/core'

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
import { Assistants } from "openai/resources/beta/assistants.js";
const groq = new Groq();
async function main() {
 
    const rl = readline.createInterface({input: process.stdin, output: process.stdout})


 const messages = [
       {
           role: 'system',
           content:`You are a smart assistant who answers the asked question.
           you have access to the following tools:
           1. webSearch({ query : {query: string} })
           // Search the latest information and data on the internet
           current date and time: ${new Date().toUTCString()} `
        },
      //  {
      //   role: "user",
      //   content: "whats the weather in chandigarh right now?",
      //   //When was iphone 16 launched? 
      //   //what is the current weather in chandigarh?
      //  },
    ]

    while (true) {

      const question = await rl.question('You:  ')
        if (question === 'bye') {
          break;
        }
        messages.push({
          role: 'user',
          content: question
        })

        while (true) {
  const completion = await groq.chat.completions.create({
    model:'openai/gpt-oss-120b',
    temperature: 0,
    messages: messages,
       tools:[
         {
      "type": "function",
      "function": {
        "name": "webSearch",
        "description": "Search the latest information and data on the internet",
        "parameters": {
          // JSON Schema object
          "type": "object",
          "properties": {
            query: {
              "type": "string",
              "description": "the search query to perform search form."
            },
           
          },
          "required": ['query']
        }
      }
    }
       ],
        
       tool_choice: 'auto'
  });
  //    console.log(JSON.stringify(completion.choices[0].message, null, 2));

  messages.push(completion.choices[0].message)

const toolcalls = completion.choices[0].message.tool_calls

if (!toolcalls) {
  console.log(`Assistant: ${completion.choices[0].message.content}`);
  break
}

for (const tool of toolcalls) {
  // console.log('tool:', tool);
  const functionName = tool.function.name
  const functionParams = tool.function.arguments

  if (functionName === 'webSearch') {
     const toolResult = await webSearch(JSON.parse(functionParams))
    //  console.log('Tool result:', toolResult);
     messages.push({
      tool_call_id: tool.id,
      role: 'tool',
      name: functionName,
      content: toolResult
     })
  }
}
  

 //console.log(JSON.stringify(completion2.choices[0].message, null, 2));
    }
    }
  rl.close()
 }

  
  main().catch(console.error);


async function webSearch({ query }) {
  // console.log('calling web search....');
    const response = await tvly.search(query);
    // console.log('Response:', response);

    const finalResult = response.results.map(result => result.content).join('\n\n')
    
    
    //here we will do tavilly api call
    return finalResult
}