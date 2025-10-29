const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const bodyParser = require("body-parser");
const validUrl = require("valid-url");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/resolve", async (req, res) => {
  const { url } = req.body;
  if (!url || !validUrl.isWebUri(url)) {
    return res.json({ error: "Invalid URL." });
  }
  try {
    // Only resolve http(s) links
    const MAX_REDIRECTS = 10;
    let currentUrl = url;
    let finalUrl = url;
    let redirects = 0;
    let response;
    while (redirects < MAX_REDIRECTS) {
      response = await fetch(currentUrl, {
        method: "HEAD",
        redirect: "manual",
        headers: { "User-Agent": "Mozilla/5.0 (RedirectResolver/1.0)" }
      });
      if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
        let loc = response.headers.get('location');
        // Support for relative redirects
        if (!/^https?:\/\//i.test(loc)) {
          const u = new URL(currentUrl);
          loc = u.origin + loc;
        }
        currentUrl = loc;
        redirects++;
      } else {
        finalUrl = currentUrl;
        break;
      }
    }
    if (redirects >= MAX_REDIRECTS) {
      return res.json({ error: "Too many redirects." });
    }
    res.json({ finalUrl });
  } catch (e) {
    res.json({ error: "Failed to resolve URL." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on port", PORT));
