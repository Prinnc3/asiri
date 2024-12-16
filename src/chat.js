document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const ipAddressElement = document.getElementById("ip-address");
    const logoutButton = document.getElementById("logout-btn");
    const sendButton = document.getElementById("send-btn");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");
    const chatTitle = document.getElementById("chat-title");

    // WebSocket setup
    const socket = new WebSocket("ws://localhost:8080"); // Adjust URL as needed

    socket.addEventListener("open", () => {
        console.log("Connected to WebSocket server");
        // Notify server of user's presence (optional)
        const initMessage = JSON.stringify({ type: "status", content: "User connected" });
        socket.send(initMessage);
    });

    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "message") {
            // Display incoming message
            const messageElement = document.createElement("div");
            messageElement.classList.add("message", "received");
            messageElement.innerHTML = `<strong>${data.username}:</strong> ${data.content}`;
            chatMessages.appendChild(messageElement);

            // Scroll to the latest message
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    socket.addEventListener("close", () => {
        console.log("WebSocket connection closed");
    });

    socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
    });

    // Fetch and display the user's live IP address
    async function fetchIPAddress() {
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            ipAddressElement.textContent = data.ip;
        } catch (error) {
            console.error("Failed to fetch IP address:", error);
            ipAddressElement.textContent = "Unavailable";
        }
    }

    fetchIPAddress();

    // Handle Logout Button Click
    logoutButton.addEventListener("click", () => {
        alert("Logging out...");
        // Placeholder for actual logout logic (e.g., API call)
        socket.close();
        window.location.href = "/login.html"; // Redirect to login page
    });

    // Handle Send Button Click
    sendButton.addEventListener("click", () => {
        const messageText = chatInput.value.trim();

        if (messageText === "") {
            alert("Please type a message!");
            return;
        }

        // Send the message to the WebSocket server
        const messageData = {
            type: "message",
            username: "You", // Replace with dynamic username if available
            content: messageText,
        };
        socket.send(JSON.stringify(messageData));

        // Display the sent message in the chat area
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", "sent");
        messageElement.innerHTML = `<strong>You:</strong> ${messageText}`;
        chatMessages.appendChild(messageElement);

        // Scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Clear the input field
        chatInput.value = "";
    });

    // Handle "Enter" key press to send messages
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendButton.click();
        }
    });

    // Dynamic Chat Header Update
    document.querySelectorAll("#user-list li").forEach((user) => {
        user.addEventListener("click", () => {
            const username = user.textContent.trim();
            chatTitle.textContent = `Chat with ${username}`;
        });
    });
});
