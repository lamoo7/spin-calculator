const itemModal = document.getElementById("itemModal");
const modalContent = document.querySelector(".modal-body");
let selectedSlot = null;
const itemSlots = document.querySelectorAll(".item");
let allItems = []; // This will store all fetched items for searching
const searchInput = document.getElementById("itemSearch"); // Reference to the search input

// Event listeners for item slots
itemSlots.forEach((slot, index) => {
  slot.addEventListener("click", () => {
    selectedSlot = index;
    openModal();
  });
});

// Open the item modal
function openModal() {
  itemModal.showModal();
  displayItems(); // Display all items initially
}

// Close the item modal
function closeModal() {
  itemModal.close();
  selectedSlot = null;
  clearSearch(); // Clear search bar and show all items
}

// Clear the search bar and reset the item display
function clearSearch() {
  searchInput.value = ""; // Clear the search bar
  displayItems(allItems); // Reset the item display to show all items
}

// Fetch and display items in the modal
function displayItems(items = allItems) {
  modalContent.innerHTML = ""; // Clear previous items

  if (!items.length) {
    modalContent.innerHTML = "<p>No items found.</p>";
    return;
  }

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("item-option");
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <span>${item.name}</span>
    `;
    modalContent.appendChild(itemElement);

    // Add click event listener to select the item
    itemElement.addEventListener("click", () => {
      selectItem(item);
    });
  });
}

// Fetch the items and set up search functionality
async function fetchItemsAndSetUpSearch() {
  try {
    const items = await fetchItems(); // Fetch the items from the API
    allItems = items; // Store all items for filtering
    displayItems(); // Initially display all items

    // Set up search functionality
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredItems = allItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      );
      displayItems(filteredItems); // Display filtered items
    });
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

// Select an item from the modal and display it in the selected slot
function selectItem(item) {
  if (selectedSlot !== null) {
    const itemSlot = itemSlots[selectedSlot];
    // Use the correct image URL from DDragon
    itemSlot.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
    selectedItems[selectedSlot] = item;
    updateStats();
    closeModal();
  }
}

// Close the modal if clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target === itemModal) {
    closeModal();
  }
});

// Call the fetch and search setup function once the page is loaded
fetchItemsAndSetUpSearch();
