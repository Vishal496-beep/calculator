# LLM(Large Language Models) bigger ones & comes in trillions
# SLM(Small Language Models) smaller ones = 70b

first nodejs
second api of model
third model download
fourth type in json type::module

# tool means function

# ~ temprature || top_p

it is setted between 0 - 2 
when we set it on higher temp it will thing and create more and multiple things and suggestion 
we do it like 0.8 or so it will give us the answer to the question it wont think or create thing or suggessions randomly 
we should always set it on (0) (or 0.8) for better usecase of ai nd it will be more focused on questions asked  it will give better response
it is used before model persona as its shown in app.js file in invoke
we can only use top_p when we dont want to mention temprature its basically the same thing 
we should always priortise not to use it
top_p is between 0 - 1 

## ~ stop
 we use it to stop generating content after ending something for example we give prompt to write 10 things but it also hallicunates so we stop it using stop keyword 

## max_completion_tokens || max_tokens

used to generate ansers withing those tokens bcz otherwise it will hallicunate ~ max_completion tokens | It is used in OpenAI mostly 
# max_token ~ which can be used to generate  

## frequency panelty ~
 it is used when LLM provides multiple same words when can decrease it using frequency_panelty || it is setted between -2.0 to 2.0 

## Presense Panelty

 # it generates new words instead of repentence of same words || creative words 

________________________________________________________________________________________

 #                             Structured Output

 # response_format: {'type': 'json_object'},  old method for json
   use to covert into JSON and with using this we gotta add a desired description in of the format then process it.
   JSON Schema enforcement: Responses match your schema exactly
   Type-safe outputs: No validation or retry logic needed
   Programmatic refusal detection: Handle safety-based refusals programmatically
   JSON Object Mode: Basic JSON output with prompt-guided structure

# response_format: {'type': 'json_schema': {schema: {'type': 'object'}}},   new method for json
   response_format: {
  type: "json_schema",
  json_schema: {
    name: "my_response",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string"
        }
      },
      required: ["message"]
    }
  }
}
____________________________________________________________________________________________________________________________
#  Tool Calling ~
   It is used to interect with external resources, such as APIs, databases and the web
# LLM tells us when will the exact toll should be executed so that we could execute tools based on the query

# tool_calls - Tavilly is good for api
  till the llm starts generating the answer it runs different tools to get the answer , when it gets the exact tools for the operation it starts generating nd stops searching for the other tools 