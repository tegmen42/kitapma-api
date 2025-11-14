import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Kitapmatik API çalışıyor 📚🚀");
});

app.get("/fiyat", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ error: "Sorgu boş olamaz" });

    try {
        const url = `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${query}`;
        const html = await fetch(url).then(r => r.text());
        const fiyat = html.match(/class="price">₺([\d.,]+)/);

        return res.json({
            kitap: query,
            fiyat: fiyat ? fiyat[1] + " TL" : null
        });

    } catch (err) {
        return res.json({ error: "Bağlantı hatası." });
    }
});

app.listen(3000, () => console.log("API çalışıyor PORT 3000"));
