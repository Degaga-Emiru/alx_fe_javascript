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
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").textContent = `${randomQuote.text} (Category: ${randomQuote.category})`;
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
    addButton.textContent = "Add Quote";
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

    // Refresh categories and filtering
    populateCategories();
    filterQuotes();

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
}

// Function to populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.textContent = ""; // Reset categories using textContent

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Categories";
    categoryFilter.appendChild(allOption);

    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categoryFilter.value = savedCategory;
        filterQuotes();
    }
}

// Function to display a random quote based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory); // Save filter preference

    const filteredQuotes = selectedCategory === "all" 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.textContent = ""; // Clear previous quotes using textContent

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }

    // Select a random quote from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    // Display the randomly selected quote
    const quoteElement = document.createElement("p");
    quoteElement.textContent = `${randomQuote.text} (Category: ${randomQuote.category})`;
    quoteDisplay.appendChild(quoteElement);

    // Save the last viewed quote in session storage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// Function to sync quotes with a simulated server
async function syncWithServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // Simulated API endpoint
        const serverQuotes = await response.json();
        
        // Merge new quotes and resolve conflicts (server data takes precedence)
        quotes = serverQuotes.concat(quotes);
        saveQuotes();
        alert("Quotes synced with server!");
    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}

// Attach event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("syncQuotes").addEventListener("click", syncWithServer);
document.addEventListener("DOMContentLoaded", () => {
    createAddQuoteForm();
    populateCategories();
    restoreLastViewedQuote();
    setInterval(syncWithServer, 60000); // Sync every minute
});
