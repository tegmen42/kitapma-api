import express from "express";
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Kitapma API çalışıyor! 🚀");
});

// ----------- BKM KİTAP ----------- //
async function scrapeBkm(query) {
  try {
    const url = `https://www.bkmkitap.com/arama?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const price = $(".current-price").first().text().trim();
    return price || null;
  } catch (err) {
    return null;
  }
}

// ----------- KİTAPYURDU ----------- //
async function scrapeKitapyurdu(query) {
  try {
    const url = `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const price = $(".price-new").first().text().trim();
    return price || null;
  } catch (err) {
    return null;
  }
}

// ----------- ANA API ----------- //
app.get("/fiyat", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json({ error: "Sorgu boş olamaz!" });

  const bkm = await scrapeBkm(q);
  const ky = await scrapeKitapyurdu(q);

  res.json({
    kitap: q,
    fiyatlar: {
      bkm: bkm || "Bulunamadı",
      kitapyurdu: ky || "Bulunamadı"
    }
  });
});

app.listen(PORT, () => {
  console.log(`Kitapma API çalışıyor → PORT: ${PORT}`);
});
