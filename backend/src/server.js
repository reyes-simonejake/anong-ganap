import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import planRoutes from './routes/planRoutes.js';
import outfitRoutes from './routes/outfitRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import placesRoutes from './routes/placesRoutes.js';
import invitationRoutes from './routes/invitationRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
    cors({
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/plan', planRoutes);
app.use('/api/outfit', outfitRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/invitation', invitationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Anong Ganap API is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// ── Error handling (must be last) ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});
