async function fetchItems() {
    try {
      const response = await fetch('items.json');
      if (!response.ok) {
        throw new Error(`Failed to load items.json: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  }
  