const versionEndpoint = 'https://ddragon.leagueoflegends.com/api/versions.json';
const itemsEndpoint = (version) => `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`;
const itemImageURL = (version, imageName) => `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${imageName}`;

// Fetch the latest version of the game
async function fetchLatestVersion() {
  const response = await fetch(versionEndpoint);
  const versions = await response.json();
  return versions[0]; // Latest version is the first one
}

// Fetch items from DDragon
async function fetchItems() {
  try {
    const latestVersion = await fetchLatestVersion();
    const response = await fetch(itemsEndpoint(latestVersion));
    const data = await response.json();
    const items = data.data; // Items data is within the 'data' field
    const parsedItems = parseItems(items, latestVersion); // Parse the raw item data for use
    return parsedItems;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

// Parse item data to extract relevant fields
function parseItems(items, version) {
  return Object.keys(items)
    .map((key) => {
      const item = items[key];
      // Check if the item is in store before including it
      if (item.inStore === false) {
        return null; // Exclude the item
      }
      return {
        id: key,
        name: item.name,
        ad: item.stats.FlatPhysicalDamageMod || 0,
        as: item.stats.PercentAttackSpeedMod ? item.stats.PercentAttackSpeedMod * 100 : 0,
        image: itemImageURL(version, item.image.full), // Get image from DDragon
      };
    })
    .filter(item => item !== null); // Filter out the excluded items
}
