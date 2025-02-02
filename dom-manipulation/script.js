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

// Function to display quotes based on the selected category
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

    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement("p");
        quoteElement.textContent = `${quote.text} (Category: ${quote.category})`;
        quoteDisplay.appendChild(quoteElement);
    });
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
        option.textContent = category; // Use textContent instead of innerText
        categoryFilter.appendChild(option);
    });

    // Restore last selected category
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categoryFilter.value = savedCategory;
        filterQuotes();
    }
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

// Function to restore last viewed quote from session storage
function restoreLastViewedQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastQuote) {
        document.getElementById("quoteDisplay").textContent = `${lastQuote.text} (Category: ${lastQuote.category})`;
    }
}

// Attach event listeners
document.getElementById("newQuote").addEventListener("click", filterQuotes);

// Call functions on page load
createAddQuoteForm();
populateCategories();
restoreLastViewedQuote();
