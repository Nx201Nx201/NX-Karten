// api/geocode.js
export default async function handler(req, res) {
  const {
    search = "",
    limit = "1",
    multiple = "false",
    language = "de",
    lat,
    lon,
  } = req.query;

  // Nominatim‑URL zusammenbauen
  const url = new URL(
    lat && lon
      ? "https://nominatim.openstreetmap.org/reverse"
      : "https://nominatim.openstreetmap.org/search"
  );
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("accept-language", language);
  if (lat && lon) {
    url.searchParams.set("lat", lat);
    url.searchParams.set("lon", lon);
  } else {
    url.searchParams.set("q", String(search));
    url.searchParams.set("limit", multiple === "true" ? "6" : limit);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: { "User-Agent": "nx‑karten/1.0 (example@example.com)" },
    });
    if (!response.ok) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(response.status).json({ error: "Nominatim error" });
    }
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(data);
  } catch (e) {
    console.error
