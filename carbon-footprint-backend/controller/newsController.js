import axios from "axios";

// ======================
// GDELT API Controller
// ======================
export const getGdeltNews = async (req, res) => {
  try {
    const query = "disaster OR environment OR flood OR wildfire OR earthquake";
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&format=json`;

    const response = await axios.get(url);
    const articles = response.data.articles || response.data;

    res.json({
      source: "GDELT",
      total: articles.length || 0,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching GDELT news:", error.message);
    res.status(500).json({ error: "Failed to fetch GDELT news" });
  }
};

// ======================
// NewsData.io Controller
// ======================
export const getNewsDataNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWSDATA_API_KEY;
    const query = "environment OR disaster OR flood OR wildfire OR pollution";
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=en&country=in`;

    const response = await axios.get(url);
    const articles = response.data.results || [];

    res.json({
      source: "NewsData.io",
      total: articles.length,
      data: articles.map(a => ({
        title: a.title,
        link: a.link,
        description: a.description,
        pubDate: a.pubDate,
        image_url: a.image_url,
        source: a.source_id,
      })),
    });
  } catch (error) {
    console.error("Error fetching NewsData.io:", error.message);
    res.status(500).json({ error: "Failed to fetch NewsData.io news" });
  }
};
