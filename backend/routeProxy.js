// ORS Route Proxy Kit
// Requisitos: npm i express cors node-fetch
// ENV: ORS_API_URL=https://api.openrouteservice.org/v2 ORS_API_KEY=xxxx

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const ORS_API_URL = process.env.ORS_API_URL || 'https://api.openrouteservice.org/v2';
const ORS_API_KEY = process.env.ORS_API_KEY || process.env.OPENROUTESERVICE_API_KEY;

app.post('/route', async (req, res) => {
  try {
    const { coordinates = [], profile = 'driving-car' } = req.body || {};
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return res
        .status(400)
        .json({ error: 'coordinates deve conter ao menos origem e destino [lng, lat]' });
    }
    if (!ORS_API_KEY) return res.status(400).json({ error: 'ORS_API_KEY não definida' });

    const url = `${ORS_API_URL}/directions/${profile}/geojson`;
    const orsRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: ORS_API_KEY },
      body: JSON.stringify({ coordinates }),
    });
    const data = await orsRes.json();
    if (!orsRes.ok) return res.status(orsRes.status).json(data);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Falha ao consultar ORS' });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`ORS proxy listening on http://localhost:${PORT}`));
