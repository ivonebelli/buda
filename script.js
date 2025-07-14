// script.js

document.addEventListener("DOMContentLoaded", function () {
    const chatMessages = document.getElementById("chatMessages");
    const typingIndicator = document.getElementById("typingIndicator");

    // Manejar inicio de sesión
    document.getElementById("startButton").addEventListener("click", function () {
        const name = document.getElementById("userName").value.trim();
        const age = document.getElementById("userAge").value.trim();
        const gender = document.getElementById("userGender").value.trim();

        if (!name || !age || !gender) {
            mostrarError("Por favor, completa todos los campos.");
            return;
        }

        // Ocultar pantalla de login
        document.getElementById("loginScreen").style.display = "none";
        // Mostrar chat
        document.getElementById("chatContainer").style.display = "flex";

        // Enviar mensaje de bienvenida automático desde Buda
        setTimeout(() => {
            addMessage(`Hola, ${name}. Soy Buda. Cuéntame cómo puedo ayudarte en tu camino espiritual.`, "received");
        }, 1000);
    });

    // Función para mostrar errores
    function mostrarError(mensaje) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message animate__animated animate__fadeIn";
        errorDiv.textContent = mensaje;

        const loginForm = document.querySelector(".login-form");
        loginForm.prepend(errorDiv);

        setTimeout(() => {
            errorDiv.classList.add("fade-out");
            setTimeout(() => errorDiv.remove(), 500);
        }, 3000);
    }

    // Manejar envío de mensajes
    document.getElementById("sendButton").addEventListener("click", async () => {
        const input = document.getElementById("userInput");
        const message = input.value.trim();
        if (!message) return;

        addMessage(message, "sent");
        input.value = "";

        // Mostrar indicador de escritura
        typingIndicator.style.display = "flex";
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch("https://buda-52jr.onrender.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message,
                    userName: document.getElementById("userName").value.trim(),
                    userGender: document.getElementById("userGender").value.trim(),
                    userAge: document.getElementById("userAge").value.trim()
                })
            });

            const data = await response.json();

            // Ocultar indicador de escritura
            typingIndicator.style.display = "none";

            // Agregar respuesta
            addMessage(data.reply, "received");
        } catch (error) {
            console.error("Error:", error);
            typingIndicator.style.display = "none";
            addMessage("Hubo un error al obtener la respuesta.", "received");
        }
    });

    // Permitir enviar con Enter
    document.getElementById("userInput").addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            document.getElementById("sendButton").click();
        }
    });

    // Botón de retroceso (volver a login)
    document.getElementById("backButton").addEventListener("click", () => {
        document.getElementById("chatContainer").style.display = "none";
        document.getElementById("loginScreen").style.display = "flex";
    });

    // Alternar modo oscuro
    document.getElementById("darkModeToggle").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // Abrir perfil de Buda
    document.getElementById("profileButton").addEventListener("click", () => {
        document.getElementById("profileModal").style.display = "flex";
    });
    document.getElementById("profileButton2").addEventListener("click", () => {
        document.getElementById("profileModal").style.display = "flex";
    });

    // Cerrar perfil de Buda
    document.getElementById("closeProfileButton").addEventListener("click", () => {
        document.getElementById("profileModal").style.display = "none";
    });

    // Emoji picker
    const emojiPicker = document.getElementById("emojiPicker");
    document.getElementById("emojiButton").addEventListener("click", () => {
        emojiPicker.style.display = emojiPicker.style.display === "none" ? "block" : "none";
    });

    // Seleccionar emoji y agregar al input
    emojiPicker.addEventListener("emoji-click", (event) => {
        const input = document.getElementById("userInput");
        input.value += event.detail.unicode;
        input.focus();
    });

    // Detectar si se abre el picker de adjuntos
    document.getElementById("attachmentButton").addEventListener("click", () => {
        alert("Función de adjuntar archivos no implementada aún.");
    });

    // Función para añadir mensajes al chat
    function addMessage(text, type) {
        const msg = document.createElement("div");
        msg.className = `message ${type}`;
        msg.innerHTML = `<span>${text}</span><small class="message-time">${new Date().toLocaleTimeString()}</small>`;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Inicializar Particles.js
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 }},
            "color": { "value": "#ffffff" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.3, "random": false },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.2, "width": 1 },
            "move": { "enable": true, "speed": 0.5, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": true, "mode": "grab" },
                "onclick": { "enable": true, "mode": "push" },
                "resize": true
            },
            "modes": {
                "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } },
                "push": { "particles_nb": 4 }
            }
        },
        "retina_detect": true
    });
});