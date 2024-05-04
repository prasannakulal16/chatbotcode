// chatbot-sdk.js

class ChatbotSDK {
  constructor(apiKey) {
    this.API_KEY = apiKey;
  }

  initChatbot() {
    console.log("Initializing chatbot...");
    // Create chatbot toggler button

    setTimeout(() => {
      const chatbotContainers = document.createElement("div");
      chatbotContainers.classList.add("chatbot-container");
      document.body.appendChild(chatbotContainers);
      // Create chatbot UI elements dynamically
      const chatbotContainer = document.querySelector(".chatbot-container");
      console.log("chatbotContainer", chatbotContainer);
      // Create chatbot toggler button
      const chatbotToggler = document.createElement("button");
      chatbotToggler.classList.add("chatbot-toggler");
      chatbotToggler.innerHTML = `
        <span class="material-symbols-rounded">mode_comment</span>
        <span class="material-symbols-outlined">close</span>
      `;

      // Create chatbot container
      const chatbotDiv = document.createElement("div");
      chatbotDiv.classList.add("chatbot");
      chatbotDiv.innerHTML = `
        <header>
          <h2>Chatbot</h2>
          <span class="close-btn material-symbols-outlined">close</span>
        </header>
        <ul class="chatbox">
          <li class="chat incoming">
            <span class="material-symbols-outlined">smart_toy</span>
            <p>Hi there 👋<br />How can I help you today?</p>
          </li>
        </ul>
        <div class="chat-input">
          <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
          <span id="send-btn" class="material-symbols-rounded">send</span>
        </div>
      `;

      // Append chatbot toggler and container to the document
      chatbotContainer.appendChild(chatbotToggler);
      chatbotContainer.appendChild(chatbotDiv);
    }, 0);

    setTimeout(() => {
      const chatInput = document.querySelector(".chat-input textarea");
      const closeBtn = document.querySelector(".close-btn");
      const chatbotToggler = document.querySelector(".chatbot-toggler");
      console.log("first", chatbotToggler);
      const sendChatBtn = document.querySelector(".chat-input span");
      const chatbox = document.querySelector(".chatbox");
      const inputInitHeight = chatInput.scrollHeight;

      const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);
        let chatContent =
          className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
      };

      const generateResponse = (chatElement, userMessage) => {
        const API_URL = "https://api.openai.com/v1/chat/completions";
        const messageElement = chatElement.querySelector("p");

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.API_KEY}`
          },
          body: JSON.stringify({
            message: userMessage
          })
        };

        fetch(API_URL, requestOptions)
          .then((res) => res.json())
          .then((data) => {
            messageElement.textContent = data.choices[0].message.content.trim();
          })
          .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
          })
          .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
      };

      const handleChat = () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;

        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
          const incomingChatLi = createChatLi("Thinking...", "incoming");
          chatbox.appendChild(incomingChatLi);
          chatbox.scrollTo(0, chatbox.scrollHeight);
          generateResponse(incomingChatLi, userMessage);
        }, 600);
      };

      chatInput.addEventListener("input", () => {
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
      });

      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
          e.preventDefault();
          handleChat();
        }
      });

      sendChatBtn.addEventListener("click", handleChat);
      closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
      chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
    }, 0);
  }
}

window.ChatbotSDK = ChatbotSDK;
