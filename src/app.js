require('dotenv').config();

const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy'
    });
});

app.get('/config-check', (req, res) => {
    res.json({
        adminConfigured: Boolean(process.env.ADMIN_PASSWORD),
        paymentConfigured: Boolean(process.env.PAYMENT_API_KEY),
        internalApiConfigured: Boolean(process.env.INTERNAL_TOKEN)
    });
});

app.listen(PORT, () => {
    console.log(`API Techstore is running on port ${PORT}`);
});