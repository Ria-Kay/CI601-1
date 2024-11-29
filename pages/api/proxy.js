import axios from "axios";

export default async function handler(req, res) {
    const { query } = req.query; // Extract the 'query' parameter

    if (!query) {
        res.status(400).json({ error: "Query parameter is required." });
        return;
    }

    //  API 
    const API_KEY = "de2d10e13b5fca21fdf1b9c321676937e104e57b"; // API key
    //const API_URL = `https://comicvine.gamespot.com/api/search/?api_key=${API_KEY}&format=json&sort=name:asc&resources=issue&query=${query}`;
    const API_URL = `https://comicvine.gamespot.com/api/search/?api_key=${API_KEY}&format=json&query=${query}`;

    try {
        // Fetch data from the ComicVine API
        const response = await axios.get(API_URL);
        res.status(200).json(response.data); // Forward the response to the client
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(error.response?.status || 500).json({
            error: "Failed to fetch data from the API.",
        });
    }
}
