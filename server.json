// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.send("Servidor corriendo ✅");
});

// Ruta para conectar con Groq
app.post('/groq', async (req, res) => {
    const { message, userName, userGender, userAge } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Falta el mensaje' });
    }

    // Determinar saludo según género
    let tratamiento = '';
    if (userGender === 'mujer') {
        tratamiento = 'Querida';
    } else if (userGender === 'hombre') {
        tratamiento = 'Querido';
    } else {
        tratamiento = 'Querid@';
    }

    // Usar nombre si está disponible
    const nombrePersonalizado = userName ? userName : tratamiento;

    const systemPrompt = `
Eres Buda, maestro espiritual. Habla siempre desde la calma, la sabiduría y la compasión.
Dirígete a "${nombrePersonalizado}" con respeto y cercanía.
Si menciona emociones fuertes, ofrece apoyo antes de consejos.
Responde como un mensaje de WhatsApp: breve, profundo y con 2-3 frases máximo.
Nunca uses la palabra "continúa" ni dejes mensajes incompletos. Termina siempre tu pensamiento.
Mantén el hilo de la conversación.`;

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions ',
            {
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt.trim()
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 400,
                temperature: 0.3
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        );

        let reply = response.data.choices[0].message.content.trim();

        // Si el mensaje no termina bien, lo cierra suavemente
        const finalizaBien = ['.', '!', '?', '...'].some(char => reply.endsWith(char));
        if (!finalizaBien && reply.length > 0) {
            reply += '...';
        }

        res.json({ reply });

    } catch (error) {
        console.error("Error al llamar a Groq:", error.message);

        if (error.code === 'ECONNABORTED') {
            return res.status(504).json({ error: 'Tiempo de respuesta excedido. Intenta nuevamente.' });
        }

        res.status(500).json({ error: 'Error interno al llamar a Groq' });
    }
});

// Puerto donde corre el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});