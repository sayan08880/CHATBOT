# VISION – Web AI Chatbot

**VISION** is a lightweight **browser-based AI chatbot** built using **HTML, CSS, and JavaScript**.
It provides a simple conversational interface with multiple utilities such as:

* Voice interaction
* Math problem solving
* Encoding and decoding text
* Guess-the-number game
* Time and date responses
* Google search suggestions
* Thank-you note generator

The chatbot runs **entirely in the browser** without requiring a backend server.

---

# Features

### Conversational Chat Interface

Users can type messages and receive automated responses from the chatbot.

---

### Voice Interaction

VISION supports:

* **Speech Recognition** (voice input)
* **Text-to-Speech** (bot replies spoken aloud)

Technologies used:

* Web Speech API
* SpeechSynthesis

---

### Math Solver

The chatbot can solve mathematical expressions using **math.js**.

Example:

```
5 + 10 * 3
```

Response:

```
THE ANSWER IS: 35
```

---

### Guess The Number Game

Type:

```
game
```

The chatbot will generate a number between **1 and 100** and ask the user to guess it.

Commands during the game:

```
exit
```

to stop the game.

---

### Name Memory

You can save your name.

Example:

```
save my name as sayan
```

Then ask:

```
who am i
```

The bot will remember your name during the session.

---

### Encoding System

VISION can convert text into a **numeric code format**.

Example:

```
encode < hello
```

Output:

```
8 5 12 12 15
```

Rules:

* lowercase letters → number
* uppercase letters → +number
* digits → -number

Example:

```
encode < Hello123
```

---

### Decoding System

Convert numeric code back into text.

Example:

```
decode < 8 5 12 12 15
```

Output:

```
hello
```

---

### Google Search Assistant

If VISION does not understand a message, it will ask:

```
WOULD YOU LIKE TO SEARCH THIS ON GOOGLE?
```

Answer:

```
Y
```

to open a Google search automatically.

---

### Thank You Note Generator

Type:

```
thank you note
```

The chatbot will ask for:

* recipient name
* reason
* personal message

Then generate a formatted **thank-you note**.

---

### Time and Date

Commands:

```
time
date
```

Example response:

```
THE CURRENT TIME : 10:30:12
```

---

### Greetings

VISION automatically responds to greetings:

```
hi
hello
hey
```

with time-based greetings such as:

* Good Morning
* Good Afternoon
* Good Evening

---

# Technologies Used

* HTML5
* CSS3
* JavaScript (Vanilla)
* Web Speech API
* Math.js Library

---

# Project Structure

```
vision-chatbot/
│
├── index.html
├── style.css
├── app.js
└── README.md
```

---

# How to Run

1. Download or clone the repository

```
git clone https://github.com/yourusername/vision-chatbot.git
```

2. Open the project folder

```
cd vision-chatbot
```

3. Run the chatbot

Simply open:

```
index.html
```

in your browser.

No server required.

---

# Browser Support

Best supported in:

* Google Chrome
* Microsoft Edge

Voice recognition may not work in some browsers.

---

# User Interface

VISION includes:

* dark themed UI
* animated background
* voice input button
* scrollable chat window
* glowing interface design

---

# Author

**Sayan**

BCA Student
Web AI Chatbot Project

---

# Educational Purpose

This project demonstrates:

* frontend chatbot development
* browser speech APIs
* JavaScript event handling
* client-side AI utilities

---

# License

Free to use for **learning and educational projects**.
