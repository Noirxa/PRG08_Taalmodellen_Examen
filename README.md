# WorldWide: Proactive Language Coach AI

WorldWide is a web application that integrates Large Language Models to provide cultural and linguistic guidance. The project is designed to demonstrate professional AI implementation through the following technical achievements:

## Technical Implementation

* **JSON Structured Output:** The system forces the model to respond exclusively in JSON. This allows the backend to parse and separate the response, cultural notes, and follow-up questions for specific UI rendering.
* **Chat History per User:** A server-side Map architecture manages isolated conversation histories via unique session IDs, ensuring persistent context for multiple simultaneous users.
* **Markdown Rendering:** Integration of the micromark library ensures that AI-generated formatting is correctly translated into readable HTML.
* **Asynchronous State Management:** The frontend manages UI interaction states by disabling inputs during processing to ensure a stable user experience.

## Tech Stack

* **Backend:** Node.js, Express.js
* **AI Framework:** LangChain (Azure OpenAI)
* **Frontend:** Vanilla JavaScript, CSS3
* **Parsing:** Micromark
