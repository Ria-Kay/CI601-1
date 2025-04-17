// pages/api/proxy-image.js
export default async function handler(req, res) {
    const { imageUrl } = req.query;
  
    if (!imageUrl) {
      return res.status(400).json({ error: 'Missing imageUrl param' });
    }
  
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`);
      }
  
      const arrayBuffer = await response.arrayBuffer();
  
      res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(Buffer.from(arrayBuffer));
    } catch (err) {
      console.error('Image proxy error:', err.message);
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  }
  