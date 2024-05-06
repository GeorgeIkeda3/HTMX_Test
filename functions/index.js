const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Request function
app.get("/users", async (req, res) => {
/*     const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
    ]; */
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    res.send(`
        <h1 class="text-2xl font-bold my-4">Users</h1>
        <ul>
            ${users.map(user => `<li>${user.name}</li>`).join("")}
        </ul>
    `);
});

// Search function
app.post('/search', async (req, res) => {
    const searchTerm = req.body.search.toLowerCase();

    if(!searchTerm) {
        return res.send("<tr></tr>");
    }

    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const contacts = await response.json();

    const searchResults = contacts.filter((contact) => {
        const name = contact.name.toLowerCase();
        const email = contact.email.toLowerCase();

        return name.includes(searchTerm) || email.includes(searchTerm);
    });

    setTimeout(() => {
        const searchResultsHTML = searchResults.map((contact) => `
            <tr>
                <td><div class="my-4 p-2">${contact.name}</div></td>
                <td><div class="my-4 p-2">${contact.email}</div></td>
            </tr>
        `).join("");
    
        res.send(searchResultsHTML);
    }, 1000);
});

// Email validation function
app.post('/contact/email', (req, res) => {
    const submittedEmail = req.body.email;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    const isValid = {
        message: 'Email is valid',
        class: 'text-green-500'
    };

    const isInvalid = {
        message: 'Email is invalid',
        class: 'text-red-500'
    };

    if (!emailRegex.test(submittedEmail)) {
        return res.send(`
            <div class="mb-4" hx-target="this" hx-swap="outerHTML">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
                <input
                    name="email"
                    hx-post="/contact/email"
                    class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                    type="email"
                    id="email"
                    value="${submittedEmail}"
                    required
                />
                <div class="${isInvalid.class}">${isInvalid.message}</div>
            </div>
        `);
    } else {
        return res.send(`
            <div class="mb-4" hx-target="this" hx-swap="outerHTML">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
                <input
                    name="email"
                    hx-post="/contact/email"
                    class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                    type="email"
                    id="email"
                    value="${submittedEmail}"
                    required
                />
                <div class="${isValid.class}">${isValid.message}</div>
            </div>
        `);
    
    }
});


exports.app = functions.https.onRequest(app);