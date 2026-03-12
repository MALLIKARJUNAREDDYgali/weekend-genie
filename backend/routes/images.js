const express = require('express');
const router = express.Router();

// Helper: search Wikipedia for a page image
async function searchWikipediaImage(query, fetch) {
          const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&format=json&pithumbsize=600&redirects=1`;
          const response = await fetch(searchUrl);
          const data = await response.json();

          if (data.query && data.query.pages) {
                    const pages = Object.values(data.query.pages);
                    for (const page of pages) {
                              if (page.thumbnail && page.thumbnail.source) {
                                        return page.thumbnail.source;
                              }
                    }
          }
          return null;
}

// Helper: search Wikimedia Commons for images
async function searchCommonsImage(query, fetch) {
          const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=600&format=json`;
          const response = await fetch(commonsUrl);
          const data = await response.json();

          if (data.query && data.query.pages) {
                    const pages = Object.values(data.query.pages);
                    for (const page of pages) {
                              if (page.imageinfo && page.imageinfo[0]) {
                                        const thumbUrl = page.imageinfo[0].thumburl || page.imageinfo[0].url;
                                        if (thumbUrl && !thumbUrl.includes('.svg')) {
                                                  return thumbUrl;
                                        }
                              }
                    }
          }
          return null;
}

// Helper: search Wikipedia by search API (for cases where exact title doesn't match)
async function searchWikipediaBySearch(query, fetch) {
          const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=pageimages&format=json&pithumbsize=600`;
          const response = await fetch(searchUrl);
          const data = await response.json();

          if (data.query && data.query.pages) {
                    const pages = Object.values(data.query.pages);
                    for (const page of pages) {
                              if (page.thumbnail && page.thumbnail.source) {
                                        return page.thumbnail.source;
                              }
                    }
          }
          return null;
}

// GET /api/images/place?query=Lalbagh+Botanical+Garden+Bangalore
// Uses Wikipedia/Wikimedia Commons API to find real place images — free, no API key
router.get('/place', async (req, res) => {
          try {
                    const { query } = req.query;
                    if (!query) {
                              return res.status(400).json({ error: 'Query parameter is required' });
                    }

                    const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

                    // Strategy 1: Try exact Wikipedia title match with the full query
                    let imageUrl = await searchWikipediaImage(query, fetch);
                    if (imageUrl) {
                              return res.json({ imageUrl, source: 'wikipedia' });
                    }

                    // Strategy 2: If query has multiple words, try without the last word (often a city name)
                    const words = query.trim().split(/\s+/);
                    if (words.length > 2) {
                              // Try removing the last word (city name)
                              const withoutCity = words.slice(0, -1).join(' ');
                              imageUrl = await searchWikipediaImage(withoutCity, fetch);
                              if (imageUrl) {
                                        return res.json({ imageUrl, source: 'wikipedia' });
                              }
                    }

                    // Strategy 3: Use Wikipedia search API (fuzzy match)
                    imageUrl = await searchWikipediaBySearch(query, fetch);
                    if (imageUrl) {
                              return res.json({ imageUrl, source: 'wikipedia-search' });
                    }

                    // Strategy 4: Search Wikimedia Commons
                    imageUrl = await searchCommonsImage(query, fetch);
                    if (imageUrl) {
                              return res.json({ imageUrl, source: 'commons' });
                    }

                    // No image found
                    return res.json({ imageUrl: null, source: 'none' });

          } catch (error) {
                    console.error('Image fetch error:', error.message);
                    return res.json({ imageUrl: null, source: 'error' });
          }
});

module.exports = router;
