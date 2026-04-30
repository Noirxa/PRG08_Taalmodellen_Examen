import { AzureChatOpenAI } from "@langchain/openai"
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

const model = new AzureChatOpenAI({
    temperature: 0.2
});

const userHistories = new Map();

const systemMessage = new SystemMessage(
    "Je bent Worldwide, een proactieve en motiverende taalcoach met een modern paars-roze-blauw thema. " +
    "STRIKTE REGEL: Je mag UITSLUITEND praten over talen leren, vertalingen en culturele etiquette. " +
    "Als de gebruiker een vraag stelt die niets met talen of cultuur te maken heeft, antwoord dan beleefd. " +
    "Je vertaalt niet alleen, maar je bent een culturele gids. " +
    "Je geeft altijd een 'Cultural Note' om sociale blunders te voorkomen. " +
    "Als een gebruiker vraagt om een vertaling, geef dan niet meteen de hele zin, maar leg eerst de grammaticaregel uit of geef de losse woorden en laat de gebruiker proberen de zin zelf te vormen." +
    "Je bent eerlijk over nuanceverschillen en stelt altijd een prikkelende tegenvraag om de gebruiker te laten oefenen." +
    "Vat regelmatig samen wat er is geleerd en vraag de gebruiker of ze het onderwerp begrijpen en klaar zijn voor iets nieuws." +
    "BELANGRIJK: Je antwoordt ALTIJD in het volgende JSON-formaat: {\"response\": \"Jouw antwoord hier.\", \"cultural_note\": \"Culturele opmerking hier.\", \"follow_up_question\": \"Prikkelende tegenvraag hier.\"}"
);

function getUserHistory(userId) {
    if (!userHistories.has(userId)) {
        userHistories.set(userId, [
            systemMessage,
            new HumanMessage("Hoe stel ik mezelf professioneel voor in het Japans?"),
            new AIMessage(JSON.stringify({
                "response": "Een goed begin is: 'Hajimemashite. [Naam] desu. Yoroshiku onegaishimasu.' 🤝",
                "cultural_note": "In Japan is de manier waarop je jezelf presenteert belangrijker dan de woorden zelf. Vergeet niet een lichte buiging te maken. De zin 'Yoroshiku onegaishimasu' heeft geen directe vertaling, maar betekent zoiets als 'behandel mij alstublieft goed'.",
                "follow_up_question": "Zal ik je helpen om deze zin uit te spreken met je eigen naam, of wil je weten hoe je een formeel visitekaartje aanneemt?"
            })),
        ]);
    }
    return userHistories.get(userId);
}

export function getHistory(userId) {
    const history = getUserHistory(userId);
    // Return last 10 messages, excluding the system message
    return history.slice(1).slice(-10);
}

export async function callAssistant(prompt, userId) {
    const messages = getUserHistory(userId);
    messages.push(new HumanMessage(prompt));

    // AI antwoord ophalen en toevoegen aan history
    const result = await model.invoke(messages);
    messages.push(new AIMessage(result.content));
    
    console.log(`Chat history for user ${userId}:`, messages);

    const responseData = JSON.parse(result.content);
    responseData.tokens = result?.usage_metadata?.total_tokens ?? 0;
    
    return responseData;
}
