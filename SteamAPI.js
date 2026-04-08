



export async function steamSearch(query)
{
  if (query == null || query.length < 2) {
    return null;
  }

  query = query.toLowerCase().trim();

  try {
    const response = await fetch(`https://store.steampowered.com/api/storesearch/?term=${query}&l=english&cc=CA`);

    if (!response.ok) {
      console.error("Error fetching from steam!");
      return [];
    }

    const data = await response.json();


    if (data && data.items) {
      return data.items.map(game => game.name);
    }

  }
  catch (err) {
    console.error("Error fetching steam games: ", err);
  }

  return [];
}
