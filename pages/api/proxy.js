import axios from "axios";

export default async function handler(req, res) {
    const { query, apiKey, endpoint } = req.query; // Example: dynamic query params
    const API_URL = `https://comicvine.gamespot.com/api/$search/?api_key=${de2d10e13b5fca21fdf1b9c321676937e104e57b }&format=json&sort=name:asc&resources=issue&query=${query}`;

    try {
        const response = await axios.get(API_URL);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(error.response?.status || 500).json({
            error: "Failed to fetch data from the API.",
        });
    }
}
