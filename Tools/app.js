import Groq from "groq-sdk";
const groq = new Groq();
async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
        {
           role: 'system',
           content:`You are a smart assistant who answers the asked question.
           you have access to the following tools:
           1. webSearch({ query : {query: string} })// Search the latest information and data on the internet`
        },
      {
        role: "user",
        content: "when was iphone 16 launched",
        //When was iphone 16 launched? 
      },
    ],
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
        
       tool_choice: 'required'
  });
  console.log(completion.choices[0]?.message?.content);
}
main().catch(console.error);



async function webSearch({ query }) {
    //here we will do tavilly api call
    return "Iphone 16 was launched 20 september 2024"
}