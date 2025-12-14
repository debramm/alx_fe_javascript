/* =======================
   DATA & STORAGE HELPERS
======================= */

// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "JavaScript is the language of the web.", category: "Programming" },
  { text: "Success is not final, failure is not fatal.", category: "Inspiration" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* =======================
   DOM REFERENCES
======================= */

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

/* =======================
   DISPLAY RANDOM QUOTE
======================= */

function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  // Store last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

/* =======================
   CREATE ADD QUOTE FORM
======================= */

function createAddQuoteForm() {
  const container = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  container.appendChild(quoteInput);
  container.appendChild(categoryInput);
  container.appendChild(addBtn);

  document.body.appendChild(container);
}

/* =======================
   ADD QUOTE FUNCTION
======================= */

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  showRandomQuote();
}

/* =======================
   JSON EXPORT
======================= */

function exportQuotesToJson() {
  const jsonBlob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(jsonBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

/* =======================
   JSON IMPORT
======================= */

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format.");
        return;
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      showRandomQuote();
      alert("Quotes imported successfully!");
    } catch {
      alert("Error reading JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

/* =======================
   UI CONTROLS
======================= */

const exportBtn = document.createElement("button");
exportBtn.textContent = "Export Quotes (JSON)";
exportBtn.addEventListener("click", exportQuotesToJson);

const importInput = document.createElement("input");
importInput.type = "file";
importInput.accept = ".json";
importInput.addEventListener("change", importFromJsonFile);

document.body.appendChild(exportBtn);
document.body.appendChild(importInput);

/* =======================
   EVENT LISTENERS
======================= */

newQuoteBtn.addEventListener("click", showRandomQuote);

/* =======================
   INITIALIZE APP
======================= */

createAddQuoteForm();

// Load last viewed quote (sessionStorage)
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const q = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `"${q.text}" <br><small>Category: ${q.category}</small>`;
} else {
  showRandomQuote();
}
