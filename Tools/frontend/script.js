const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask");
input.addEventListener("keyup", handleEnter);

askBtn.addEventListener("click", handleAsk);
const threadId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8)

const loading = document.createElement("div");
loading.className = "my-6 animate-pulse";
loading.textContent = "Thinking...";

async function generate(text) {
  // 1. append text to ui
  // 2. send message to LLM
  // 3. append response to the ui

  const msg = document.createElement("div");
  msg.className =
    "my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit text-white";
  msg.textContent = text;
  chatContainer.appendChild(msg);

  // Clear input immediately for better UX
  input.value = "";

  chatContainer?.appendChild(loading);

  try {
    // 2. Send message to LLM
    const assistantMessage = await callServer(text);

    // 3. Append response to the UI (Previously commented out)
    const assistantMsgElem = document.createElement("div");
    assistantMsgElem.className =
      "my-6 bg-neutral-900 p-3 rounded-xl mr-auto max-w-fit text-white";
    assistantMsgElem.textContent = assistantMessage;

    loading.remove();

    chatContainer.appendChild(assistantMsgElem);

    // Auto-scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error("Failed to get response:", error);
    // Show error in UI so the user knows what happened
    const errorElem = document.createElement("div");
    errorElem.className = "text-red-500 text-sm italic";
    errorElem.textContent = "Error: Could not connect to the server.";
    chatContainer.appendChild(errorElem);
  }
}

async function callServer(inputText) {
  const response = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ threadId, message: inputText }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const result = await response.json();
  return result.message; // Ensure your server returns an object like { message: "..." }
}

async function handleAsk(e) {
  const text = input.value.trim();
  if (!text) {
    return;
  }

  await generate(text);
}

async function handleEnter(e) {
  if (e.key === "Enter") {
    const text = input.value.trim();
    if (!text) {
      return;
    }

    await generate(text);
  }
}
