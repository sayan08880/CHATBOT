// DOM elements
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const voiceButton = document.getElementById("voiceButton");

// State variables
let lastBotResponse = "";
let userName = "";
let gameActive = false;
let numberToGuess = null;
let attempts = 0;
let pendingGoogleSearch = "";

// Utility functions
function scrollChatToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
  if (chatBox.children.length > 50) {
    while (chatBox.children.length > 50) {
      chatBox.removeChild(chatBox.children[0]);
    }
  }
}

function textToVoice(text, delay = 0) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  if (delay) setTimeout(() => synth.speak(utterance), delay);
  else synth.speak(utterance);
}

function displayMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", sender === "bot" ? "bot-message" : "user-message");
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  scrollChatToBottom();
  
  if (sender === "bot") {
    textToVoice(message, 500);
    lastBotResponse = message;
  }
}

function solveMathProblem(problem) {
  try {
    // Assuming you have math.js for safe evaluation
    return `THE ANSWER IS: ${math.evaluate(problem)}`;
  } catch (error) {
    return "SORRY, I CAN ONLY SOLVE MATHEMATICAL EQUATIONS.";
  }
}

function isMathProblem(message) {
  return /^[\d\s\+\-\*\/\(\)\.eE\^]+$/.test(message);
}

function getGreeting() {
  const hour = new Date().getHours();
  
  if (hour < 12) return "HELLO, GOOD MORNING!";
  if (hour === 12) return "HELLO, GOOD NOON!";
  if (hour < 18) return "HELLO, GOOD AFTERNOON!";
  if (hour < 23) return "HELLO, GOOD EVENING!";
  return "HELLO, GOOD NIGHT!";
}

function getTime() {
  return new Date().toLocaleTimeString();
}

function getDate() {
  return new Date().toLocaleDateString();
}

function startGuessTheNumberGame() {
  numberToGuess = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  gameActive = true;
  return "WELCOME TO THE GUESS THE NUMBER GAME\nI'M THINKING OF A NUMBER BETWEEN 1 TO 100\nENTER YOUR GUESS:";
}

function handleGuess(guess) {
  attempts += 1;
  if (isNaN(guess) || guess.trim() === '') return "PLEASE ENTER A VALID NUMBER";
  const guessNumber = parseInt(guess, 10);
  if (guessNumber < numberToGuess) return "TOO LOW! TRY AGAIN.";
  if (guessNumber > numberToGuess) return "TOO HIGH! TRY AGAIN.";
  gameActive = false;
  return `CONGRATULATIONS! YOU'VE GUESSED THE NUMBER ${numberToGuess} IN ${attempts} ATTEMPTS.`;
}

function transformToNumericCode(text) {
  let result = [];

  for (let char of text) {
      if (/[a-zA-Z]/.test(char)) { // Check if it's a letter
          if (char === char.toUpperCase()) {
              // Capital letter: add '+' and corresponding alphabet number
              result.push(`+${char.charCodeAt(0) - 64}`);
          } else {
              // Lowercase letter: just the corresponding alphabet number
              result.push(`${char.charCodeAt(0) - 96}`);
          }
      } else if (/[0-9]/.test(char)) { // Check if it's a number
          // Prepend '-' to the number
          result.push(`-${char}`);
      } else {
          // Special characters or spaces remain unchanged
          result.push(char);
      }
  }
  return result.join(" ");
}

function decodeFromNumericCode(numericCode) {
  let elements = numericCode.split(' '); // Split the code into parts
  let result = [];

  for (let element of elements) {
      if (element.startsWith("+")) { // Uppercase letter
          let num = parseInt(element.slice(1)); // Remove "+" and convert to a number
          result.push(String.fromCharCode(num + 64)); // Convert number to uppercase letter
      } else if (/^\d+$/.test(element)) { // Lowercase letter if it's all digits
          let num = parseInt(element); // Convert to a number
          result.push(String.fromCharCode(num + 96)); // Convert number to lowercase letter
      } else if (element.startsWith("-") && /^\d+$/.test(element.slice(1))) { // Numbers
          result.push(element.slice(1)); // Remove "-" to restore the original number
      } else { // Special characters or spaces
          result.push(element);
      }
  }

  return result.join('');
}

function createThankYouNote() {
    console.log("Welcome to the Thank You Note Generator!");

    // Ask for the recipient's name
    let recipient = prompt("Who would you like to thank?");
    
    // Ask for the reason for the thank you
    let reason = prompt("What are you thanking them for?");
    
    // Ask for a personal message or additional comments
    let personalMessage = prompt("Any additional message or comments?");

    // Generate the thank you note
    let note = `Dear ${recipient},

I wanted to take a moment to express my heartfelt thanks for ${reason}. 
Your kindness and support have truly meant a lot to me. 

${personalMessage}

Thank you once again!

With gratitude,
[Your Name]`;

    // Display the note in the chat interface
    displayMessage(note, "bot");

    // Option to save the note (simulated as we are in a browser environment)
    let save = prompt("Would you like to save this note? (yes/no)").toLowerCase();
    if (save === 'yes') {
        console.log("Downloading your note...");
        console.log("Note would be saved if this were not a browser environment.");
    }
}

// Main chat handler
async function handleUserInput(userText) {
  userText = userText.trim().toLowerCase();
  if (!userText) return;

  displayMessage(userText, "user");

  let botResponse = "I'M NOT SURE HOW TO RESPOND TO THAT.";

  if (userText === 'help') {
    botResponse = "YOU CAN ASK ME ABOUT TIME, DATE, WEATHER, OR START A GAME BY TYPING 'GAME'. YOU CAN ALSO SAVE YOUR NAME BY SAYING 'SAVE MY NAME AS [NAME]'. SAY 'ENCODE < [TEXT]' OR 'DECODE < [CODE]' FOR NUMERIC CONVERSION. SAY 'THANK YOU NOTE' TO GENERATE A THANK YOU NOTE.";
  } else if (gameActive) {
    botResponse = userText === 'exit' ? "GAME EXITED. YOU CAN START A NEW GAME BY TYPING 'GAME'." : handleGuess(userText);
    if (userText === 'exit') gameActive = false;
  } else if (pendingGoogleSearch) {
    if (['y', 'yes'].includes(userText)) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(pendingGoogleSearch)}`, "_blank");
      botResponse = "I HAVE SEARCHED GOOGLE FOR YOU. PLEASE CHECK YOUR BROWSER.";
      pendingGoogleSearch = "";
    } else if (['n', 'no'].includes(userText)) {
      botResponse = "OKAY, I WON'T SEARCH GOOGLE.";
      pendingGoogleSearch = "";
    } else {
      botResponse = "PLEASE ANSWER WITH 'Y' FOR YES OR 'N' FOR NO.";
    }
  } else {
    if (userText.startsWith('save my name as ')) {
      userName = userText.slice(16).trim();
      botResponse = `I'VE SAVED YOUR NAME AS ${userName.toUpperCase()}.`;
    } else if (userText === "who am i") {
      botResponse = userName ? `YOU ARE ${userName.toUpperCase()}.` : "YOU HAVEN'T TOLD ME YOUR NAME YET. YOU CAN SAVE IT BY SAYING 'SAVE MY NAME AS [NAME]'.";
    } else if (userText === 'game') {
      botResponse = startGuessTheNumberGame();
    } else if (userText === "repeat") {
      botResponse = lastBotResponse || "I HAVE NOTHING TO REPEAT.";
    } else if (['hi', 'hello', 'hey'].some(greet => userText.includes(greet))) {
      botResponse = getGreeting();
    } else if (userText.includes("time")) {
      botResponse = `THE CURRENT TIME : ${getTime()}.`;
    } else if (userText.includes("date")) {
      botResponse = `TODAY'S DATE : ${getDate()}.`;
    } else if (userText.includes("weather")) {
      botResponse = "PLEASE ENTER YOUR LOCATION FOR A WEATHER UPDATE (THIS FEATURE REQUIRES BACKEND INTEGRATION).";
    } else if (['bye', 'tata', 'off'].some(reet => userText.includes(reet))) {
      botResponse = "GOODBYE! HAVE A GREAT DAY!";
    } else if (isMathProblem(userText)) {
      botResponse = solveMathProblem(userText);
    } else if (userText.startsWith('encode < ')) {
      const textToEncode = userText.slice(9).trim();
      if (textToEncode) {
        botResponse = `ENCODED: ${transformToNumericCode(textToEncode)}`;
      } else {
        botResponse = "PLEASE ENTER TEXT TO ENCODE AFTER 'ENCODE < '. RETRY.";
      }
    } else if (userText.startsWith('decode < ')) {
      const codeToDecode = userText.slice(9).trim();
      if (codeToDecode) {
        botResponse = `DECODED: ${decodeFromNumericCode(codeToDecode)}`;
      } else {
        botResponse = "PLEASE ENTER CODE TO DECODE AFTER 'DECODE < '. RETRY.";
      }
    } else if (userText.startsWith('encode ') || userText.startsWith('decode ')) {
      botResponse = "MISSING '<' SYMBOL FOR ENCODING OR DECODING. PLEASE RETRY WITH THE CORRECT FORMAT.";
    } else if (userText === 'thank you note') {
      createThankYouNote();
      return; // No need for botResponse here as createThankYouNote() handles the display
    } else {
      botResponse = "WOULD YOU LIKE TO SEARCH THIS ON GOOGLE? PLEASE RESPOND WITH 'Y' FOR YES OR 'N' FOR NO.";
      pendingGoogleSearch = userText;
    }
  }

  displayMessage(botResponse, "bot");
}

// Event listeners for user interactions
sendButton.addEventListener("click", () => {
  handleUserInput(userInput.value);
  userInput.value = ''; // Clear the input field after sending the message
});

userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleUserInput(userInput.value);
    userInput.value = ''; // Clear the input field after sending the message
  }
});

// Voice recognition setup (assuming web speech API support)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  console.error("Speech recognition is not supported in this browser.");
  voiceButton.disabled = true;
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceButton.addEventListener("click", () => {
    recognition.start();
    voiceButton.disabled = true;
    voiceButton.textContent = "Listening...";
  });

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    setTimeout(() => {
      voiceButton.disabled = false;
      voiceButton.textContent = "🎤";
    }, 1000);
    handleUserInput(transcript);
  });
}

// Show welcome message on page load
window.addEventListener("load", () => {
  displayMessage("HI, I AM VISION, YOUR BASIC AI CHATBOT.", "bot");
});