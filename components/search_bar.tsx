// Step 1 — Search
// Create a search bar that lets users search for medicines by brand name. On search, call:
//
// https://api.fda.gov/drug/label.json?search=openfda.brand_name:"SEARCH_INPUT"&limit=20
//
//     Example call
// https://api.fda.gov/drug/label.json?search=openfda.brand_name:advil&limit=20
//
//     Replace SEARCH_INPUT wit// 📍 Path: project-root/package.json
//
// {
//   "name": "medicine-directory",
//   "version": "1.0.0",
//   "private": true,
//   "scripts": {
//     "install:all": "npm install && npm install --prefix server && npm install --prefix client",
//     "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
//     "server": "npm run dev --prefix server",
//     "client": "npm run dev --prefix client",
//     "build": "npm run build --prefix client",
//     "start": "npm run start --prefix server"
//   },
//   "devDependencies": {
//     "concurrently": "^9.2.1"
//   }
// }h the user's query.
// Display the returned results as a list.

//     If the API returns nothing, show a clear "No results found" state.
//     Handle loading and API error states properly. The API can fail or return a 404 for an unknown brand — decide how your UI should behave in each case.

// SCREEN SHARING MUST BE ON ALL TIME!!!!
//
// Step 2 — Medicine result ca
// Show each medicine as a result card. Take the medicine information only from the results -> openfda object in the API response.
//     Choose and render the details that are actually useful to someone scanning a list, for example:
// Brand name [Comes under openFDA key from API response]
// Generic name
// Manufacturer
// Product type
//     Route
// Anything else useful available under openfda
//
// Note that fields under openfda are often arrays, and some are missing entirely for some medicines. Handle that. Keep the card design simple, clean and easy to scan.

async function searchBar({props}: {props: any}) {
    const query = props.query;
    const response = await fetch (`https://api.fda.gov/drug/label.json?search=openfda.brandh_name: ${query}&limit=20`)

    const data = await response.json()
    return data;
}

export default searchBar;