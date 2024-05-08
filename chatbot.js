// chatbot-sdk.js

class ChatbotSDK {
  constructor(apiKey, id) {
    this.API_KEY = apiKey;
    this.id = id;
  }

  initChatbot() {
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
        <span class="material-symbols-rounded" style="display: flex; justify-content: center; align-items: center;"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg></span>
        <span class="material-symbols-outlined" style="display: flex; justify-content: center; align-items: center;"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></span>
      `;

      // Create chatbot container
      const chatbotDiv = document.createElement("div");
      chatbotDiv.classList.add("chatbot");
      chatbotDiv.innerHTML = `
        <header>
          <h2>Chatbot</h2>
          <span class="close-btn material-symbols-outlined"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></span>
        </header>
        <ul class="chatbox">
          <li class="chat incoming">
            <p>Hi there 👋<br />How can I help you today?</p>
          </li>
        </ul>
        <div class="chat-input">
          <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
          <span id="send-btn" class="material-symbols-rounded"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7664E9"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg></span>
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
      const sendChatBtn = document.querySelector(".chat-input span");
      const chatbox = document.querySelector(".chatbox");
      const inputInitHeight = chatInput.scrollHeight;

      const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);
        let chatContent = className === "outgoing" ? `<p></p>` : `<p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
      };

      const generateResponse = (chatElement, userMessage) => {
        const API_URL = `https://mlapi.qualetics.com/api/datamachine/init?id=${this.id}`;
        const messageElement = chatElement.querySelector("p");

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.API_KEY}`
          },
          body: JSON.stringify({
            input: userMessage
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

// export default ChatbotSDK;

window.ChatbotSDK = ChatbotSDK;
