import axios from "axios";

export default async function handler(req, res) {
  const {
    resource = "search",
    query = "",
    limit = 10,
    offset = 0,
    filter = "",
    sort = "",
    field_list = "",
    api_detail_url = "",
  } = req.query;

  const API_KEY = "de2d10e13b5fca21fdf1b9c321676937e104e57b"; //  keep this safe!
  let baseUrl;

  const params = {
    api_key: API_KEY,
    format: "json",
    limit,
    offset,
  };

  // Use api_detail_url directly if passed
  if (api_detail_url) {
    try {
      const detailRes = await axios.get(api_detail_url, {
        params: {
          api_key: API_KEY,
          format: "json",
        },
      });
      return res.status(200).json(detailRes.data);
    } catch (error) {
      console.error("API Detail Error:", error.message);
      return res.status(error.response?.status || 500).json({
        error: "Failed to fetch detail data from Comic Vine.",
      });
    }
  }

  // Handle full resource paths like "person/4040-12345"
  if (resource.includes("/")) {
    baseUrl = `https://comicvine.gamespot.com/api/${resource}/`;
  } else {
    baseUrl = `https://comicvine.gamespot.com/api/${resource}/`;

    // Default useful fields for most endpoints
    const defaultFields = [
      "id",
      "name",
      "image",
      "description",
      "deck",
      "site_detail_url",
      "volume",
      "issue_number",
      "cover_date",
      "character_credits",
      "person_credits",
      "concept_credits",
      "publisher",
      "issues", // includes issues they worked on
    ].join(",");

    params.field_list = field_list || defaultFields;
    if (resource === "search") {
      if (!query) return res.status(400).json({ error: "Query is required for search." });
      params.query = query;
      params.resources = "issue";
    } else {
      if (filter) params.filter = filter;
      if (sort) params.sort = sort;
    }
  }

  try {
    const response = await axios.get(baseUrl, { params });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Proxy API Error:", error.message);
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch data from the ComicVine API.",
    });
  }
}
