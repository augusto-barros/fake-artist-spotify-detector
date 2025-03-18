import { ApifyClient } from 'apify-client';

export default async function fetchInstagramProfile(artistData) {
  const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
  });

  // Destructure and process the name: convert to lowercase and remove spaces.
  const { name } = artistData;
  const username = name.toLowerCase().replace(/\s+/g, '');

  // Prepare Actor input using the old parameters along with the username.
  const input = {
    usernames: [username],
    searchLimit: 1,
    searchType: "user",
  };

  try {
    // Run the Actor and wait for it to finish
    const run = await client.actor("dSCLg0C3YEZ83HzYX").call(input);

    // Fetch Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    items.forEach((item) => {
      console.dir(item, { depth: null });
    });
    // Return the items from the dataset
    return items;
  } catch (error) {
    console.error('An error occurred:', error);
    return { error: error.message };
  }
}
