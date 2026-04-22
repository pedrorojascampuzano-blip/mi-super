import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { errorHandler } from './middleware/errors.js';
import healthRoutes from './routes/health.js';
import accountRoutes from './routes/accounts.js';
import preferencesRoutes from './routes/preferences.js';
import { syncRouter, itemsRouter } from './routes/sync.js';
import actionRoutes from './routes/actions.js';
import contactRoutes from './routes/contacts.js';
import aiRoutes from './routes/ai.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/sync', syncRouter);
app.use('/api/items', itemsRouter);
app.use('/api/actions', actionRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/ai', aiRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start
app.listen(config.port, () => {
  console.log(`NexusAI server listening on port ${config.port}`);
});
