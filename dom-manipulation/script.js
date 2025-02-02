const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Replace with your real API if available

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate Categories
function populateCategories() {
    let categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    let categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(category => {
        let option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    let savedFilter = localStorage.getItem("selectedCategory");
    if (savedFilter) categoryFilter.value = savedFilter;
}

// Filter Quotes
function filterQuotes() {
    let selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);

    let filteredQuotes = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length > 0) {
        let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        let quote = filteredQuotes[randomIndex];
        document.getElementById("quoteDisplay").innerHTML = `<p>"${quote.text}" - <strong>${quote.category}</strong></p>`;
    } else {
        document.getElementById("quoteDisplay").innerHTML = `<p>No quotes found in this category.</p>`;
    }
}

// Show Random Quote
function showRandomQuote() {
    filterQuotes();
}

// Restore Last Quote from Session Storage
function restoreLastQuote() {
    let lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
    if (lastQuote) {
        document.getElementById("quoteDisplay").innerHTML = `<p>"${lastQuote.text}" - <strong>${lastQuote.category}</strong></p>`;
    }
}

// Add a New Quote
function addQuote() {
    let quoteText = document.getElementById("newQuoteText").value.trim();
    let quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (!quoteText || !quoteCategory) {
        alert("Please enter both a quote and category!");
        return;
    }

    let newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("New quote added successfully!");
}

// Export Quotes as JSON
function exportQuotes() {
    const jsonData = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Import Quotes from JSON File
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid file format!");
            }
        } catch (error) {
            alert("Error reading JSON file!");
        }
    };
    
    fileReader.readAsText(event.target.files[0]);
}

// Sync with Server
async function syncWithServer() {
    document.getElementById("syncStatus").textContent = "Syncing with server...";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data from server.");

        const serverQuotes = await response.json();
        let newQuotes = serverQuotes.slice(0, 5).map(q => ({ text: q.title, category: "Server" }));

        let localQuotesText = new Set(quotes.map(q => q.text));
        let uniqueNewQuotes = newQuotes.filter(q => !localQuotesText.has(q.text));

        if (uniqueNewQuotes.length > 0) {
            quotes.push(...uniqueNewQuotes);
            saveQuotes();
            populateCategories();
            document.getElementById("syncStatus").textContent = "Sync complete! New quotes added.";
        } else {
            document.getElementById("syncStatus").textContent = "Sync complete! No new quotes.";
        }
    } catch (error) {
        document.getElementById("syncStatus").textContent = "Error syncing with server.";
    }
}

// Event Listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
document.getElementById("syncQuotes").addEventListener("click", syncWithServer);

// Initialize
populateCategories();
restoreLastQuote();
