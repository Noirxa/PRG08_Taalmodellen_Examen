import { micromark } from 'https://esm.sh/micromark@3?bundle';

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const messages = document.getElementById('messages');
const sendBtn = document.getElementById('send-btn');

// Genereer een unieke ID voor deze gebruiker/sessie
const userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = userInput.value;
    if (!message) return;

    // Toon bericht van gebruiker
    addMessage(message, 'user');
    
    userInput.value = '';
    sendBtn.disabled = true; // Zet knop uit tijdens wachten

    try {
        // 2. De Fetch call naar jouw server
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, userId }) // Stuur de userId mee
        });
        
        const data = await response.json();
        
        // 3. Toon antwoord van de bot
        addMessage(data, 'bot');
        
        console.log("Tokens gebruikt:", data.tokens);
        
    } catch (error) {
        console.error("Fout bij ophalen chat:", error);
        addMessage({ response: "Oeps, er ging iets mis." }, 'bot');
    }

    sendBtn.disabled = false; // Zet knop weer aan
    userInput.focus();
});

// 4. De centrale functie voor het toevoegen van bubbels
function addMessage(data, sender) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble ' + sender;

    if (sender === 'bot') {
        // De AI geeft nu een object met een 'response' veld
        // en een 'tokens' veld.
        let content = micromark(data.response);
        if (data.cultural_note) {
            content += `<hr><p class="cultural-note">${micromark(data.cultural_note)}</p>`;
        }
        if (data.tokens) {
            content += `<p class="token-info">Tokens: ${data.tokens}</p>`;
        }
        bubble.innerHTML = content;
    } else {
        // Gebruikerstekst is gewoon een string
        bubble.textContent = data;
    }

    messages.appendChild(bubble);
    
    // Automatisch naar beneden scrollen
    messages.scrollTop = messages.scrollHeight;
}