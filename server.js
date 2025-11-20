const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); 
require('dotenv').config(); 

const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT p.id, p.name, s.qty 
            FROM products p 
            JOIN stocks s ON p.id = s.product_id
        `);
        const [purchases] = await db.query(`
            SELECT pur.id, p.name, pur.qty, pur.status, pur.created_at 
            FROM purchases pur 
            JOIN products p ON pur.product_id = p.id 
            ORDER BY pur.created_at DESC
        `);
        res.render('index', { products, purchases });
    } catch (err) {
        console.error(err);
        res.send("Error Database");
    }
});

app.post('/buy', async (req, res) => {
    const { product_id, qty } = req.body;
    const quantity = parseInt(qty);
    try {
        const [stockData] = await db.query('SELECT qty FROM stocks WHERE product_id = ?', [product_id]);
        if (stockData.length === 0 || stockData[0].qty < quantity) {
            return res.send('<script>alert("Stok kurang!"); window.location="/";</script>');
        }
        await db.query('UPDATE stocks SET qty = qty - ? WHERE product_id = ?', [quantity, product_id]);
        await db.query('INSERT INTO purchases (product_id, qty) VALUES (?, ?)', [product_id, quantity]);
        res.redirect('/'); 
    } catch (err) {
        console.error(err);
        res.send("Gagal transaksi");
    }
});

app.post('/cancel/:id', async (req, res) => {
    const purchaseId = req.params.id;
    try {
        const [purchase] = await db.query('SELECT product_id, qty, status FROM purchases WHERE id = ?', [purchaseId]);
        if (purchase.length === 0 || purchase[0].status === 'cancelled') return res.redirect('/');
        
        await db.query('UPDATE stocks SET qty = qty + ? WHERE product_id = ?', [purchase[0].qty, purchase[0].product_id]);
        await db.query('UPDATE purchases SET status = "cancelled" WHERE id = ?', [purchaseId]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send("Gagal cancel");
    }
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const apiKey = process.env.GROQ_API_KEY; 

    if (!apiKey) {
        return res.json({ reply: "Error: API Key Groq belum dipasang." });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", 
                messages: [
                    { role: "system", content: "Kamu adalah asisten toko yang ramah dan membantu." },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("❌ Error Groq:", data.error);
            return res.json({ reply: `Maaf, ada error: ${data.error.message}` });
        }

        if (data.choices && data.choices.length > 0) {
            const reply = data.choices[0].message.content;
            res.json({ reply });
        } else {
            res.json({ reply: "AI tidak merespon." });
        }

    } catch (error) {
        console.error("❌ Error Server:", error);
        res.json({ reply: "Server Error (Cek koneksi internet)." });
    }
});

app.listen(port, () => {
    console.log(`Server siap di http://localhost:${port}`);
});