const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const toggleThemeButton = document.querySelector("#toggle-theme-button");

let userMessage = null;

// API configuration
const API_KEY = "AIzaSyAuKBkiPDpnjl3bGnbGa6yQ7DI07O0eOjY";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models
/gemini-1.5-flash:generateContent?key=${API_KEY}`

const createMessageElement= (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}
 

// show typing effect
const showTypingEffect = (text, textElement) => {
    const words = text.split(' ');
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        // Append each word to the text element with a sapce
        textElement.innerText += (currentWordIndex ===0 ? '' : ' ') + words[currentWordIndex++];

        // if all words are displayed
        if(currentWordIndex === words.length) {
            clearInterval(typingInterval);
        }
    }, 75)
}
// Fetch response from the API on user message
const generateAPIResponse = async (incomingMessageDiv) => {

    const textElement = incomingMessageDiv.querySelector(".text"); //get text element
    // Send a POST request to the API with the user's message
    try{
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text : userMessage}]
                }]
            })
        });

        const data = await response.json();

        // Get the API response text
        const apiResponse = data?.candidates[0].content.parts[0].text;
        showTypingEffect(apiResponse, textElement);
    }catch(error){
        console.log(error);
    }finally{
        incomingMessageDiv.classList.remove("loading");
    }
}

// Show a loading animation while waiting for API response
const showLoadingAnimation = () => {
    const html = ` <div class="message-content">
                <img src="images/gemini.svg" alt="Gemini Image" class="avatar">
                <p class="text"></p>
                <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                </div>
            </div>
            <span onclick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
chatList.append(incomingMessageDiv);

generateAPIResponse(incomingMessageDiv);
}

//Copy message to text clipboard
const copyMessage = (copyIcon) => {
    const messageText = copyIcon.parentElement.querySelector(".text");
    navigator.clipboard.writeText(messageText);
    copyIcon.innerText = "done"; //show tick icon
    setTimeout(() => copyIcon.innerText = "content_copy",1000 ) //revert icon after 1 second
}

// Handle sending outgoing messages
const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();
    if(!userMessage) return; // Exit if there is no message

    const html = ` <div class="message-content">
                <img src="images/user.jpg" alt="User Image" class="avatar">
                <p class="text"></p>
                </div>`;

   const outgoingMessageDiv = createMessageElement(html, "outgoing");
   outgoingMessageDiv.querySelector(".text").innerText = userMessage;
   chatList.append(outgoingMessageDiv);

   typingForm.reset(); //Clear input field
   setTimeout(showLoadingAnimation, 500); // Show loading animation after a delay
}

// toggle between light and dark mode
toggleThemeButton.addEventListener("click", () => {
    const isLightMode = document.body.classList.toggle("light_mode");
    localStorage.setItem("themeColor", )
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
})


// Prevent default from submission and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    handleOutgoingChat();
})