import axios from "axios";

export default async function handler(req, res) {
  const { resource = "search", query = "", limit = 10, offset = 0, filter = "", sort = "", field_list = "" } = req.query;

  const API_KEY = "de2d10e13b5fca21fdf1b9c321676937e104e57b"; // api key
  const baseUrl = `https://comicvine.gamespot.com/api/${resource}/`;

  const params = {
    api_key: API_KEY,
    format: "json",
    limit,
    offset,
  };

  // Add optional query/filtering if present
  if (resource === "search") {
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required for search." });
    }
    params.query = query;
    params.resources = "issue";
  } else {
    if (filter) params.filter = filter;
    if (sort) params.sort = sort;
    if (field_list) params.field_list = field_list;
  }

  try {
    const response = await axios.get(baseUrl, { params });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch data from the API.",
    });
  }
}
