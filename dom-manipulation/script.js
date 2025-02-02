// Load quotes from local storage or use default ones
const defaultQuotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
    { text: "Happiness depends upon ourselves.", category: "Happiness" }
];

let quotes = JSON.parse(localStorage.getItem("quotes")) || defaultQuotes;

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById("quoteDisplay").innerText = "No quotes available.";
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Save the last viewed quote in session storage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));

    document.getElementById("quoteDisplay").innerHTML = `
        <p><strong>${randomQuote.text}</strong></p>
        <p><em>Category: ${randomQuote.category}</em></p>
    `;
}

// Function to create the add quote form dynamically
function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    
    const inputText = document.createElement("input");
    inputText.setAttribute("id", "newQuoteText");
    inputText.setAttribute("type", "text");
    inputText.setAttribute("placeholder", "Enter a new quote");

    const inputCategory = document.createElement("input");
    inputCategory.setAttribute("id", "newQuoteCategory");
    inputCategory.setAttribute("type", "text");
    inputCategory.setAttribute("placeholder", "Enter quote category");

    const addButton = document.createElement("button");
    addButton.innerText = "Add Quote";
    addButton.addEventListener("click", addQuote);

    formContainer.appendChild(inputText);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);

    document.body.appendChild(formContainer);
}

// Function to add a new quote dynamically
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both a quote and category.");
        return;
    }

    // Add new quote to the array and update local storage
    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes();

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
}

// Function to export quotes as a JSON file
function exportToJsonFile() {
    const jsonData = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid JSON format.");
            }
        } catch (error) {
            alert("Error reading JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to restore last viewed quote from session storage
function restoreLastViewedQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastQuote) {
        document.getElementById("quoteDisplay").innerHTML = `
            <p><strong>${lastQuote.text}</strong></p>
            <p><em>Category: ${lastQuote.category}</em></p>
        `;
    }
}

// Attach event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Call functions on page load
createAddQuoteForm();
restoreLastViewedQuote();
