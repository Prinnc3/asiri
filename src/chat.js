document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const ipAddressElement = document.getElementById("ip-address");
    const logoutButton = document.getElementById("logout-btn");
    const sendButton = document.getElementById("send-btn");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

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
        window.location.href = "/login.html"; // Redirect to login page
    });

    // Handle Send Button Click
    sendButton.addEventListener("click", () => {
        const messageText = chatInput.value.trim();

        if (messageText === "") {
            alert("Please type a message!");
            return;
        }

        // Add the message to the chat area
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", "sent");
        messageElement.innerHTML = `<strong>You:</strong> ${messageText}`;
        chatMessages.appendChild(messageElement);

        // Scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Clear the input field
        chatInput.value = "";

        // Simulate receiving a reply (for testing)
        setTimeout(() => {
            const replyElement = document.createElement("div");
            replyElement.classList.add("message", "received");
            replyElement.innerHTML = `<strong>John:</strong> Got your message!`;
            chatMessages.appendChild(replyElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    });

    // Optional: Handle "Enter" key press to send messages
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendButton.click();
        }
    });
});
