import express from 'express'
import { callAssistant } from './chat.js'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static("public"));

app.get('/api/test', async (req, res) => {
    const response = await callAssistant("yoo broo, whats up!")
    res.json({ response })
})

app.post('/api/chat', async(req, res) => {
    const { message, userId } = req.body
    if (!userId) {
        return res.status(400).json({ error: 'User ID is missing' });
    }
    const response = await callAssistant(message, userId)
    res.json(response)
})

app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: "." });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})