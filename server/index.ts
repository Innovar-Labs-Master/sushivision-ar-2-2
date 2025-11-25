
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {
  authenticateToken,
  AuthenticatedRequest,
  requireAdmin,
  requireAuth
} from './middleware/auth.js';

dotenv.config();

const app = express();
const port = 3002;
const dbPath = path.resolve(__dirname, 'db.json');

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:5173', 'http://localhost:3000', 'https://your-production-domain.com']
    : true,
  credentials: true
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Remove restrictive CSP in development
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.removeHeader('x-powered-by');
  } else {
    // Allow all in development for easier debugging
    res.removeHeader('Content-Security-Policy');
  }
  next();
});

// Helper function to read the database
const readDb = () => {
  const dbRaw = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(dbRaw);
};

// Helper function to write to the database
const writeDb = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Public routes (no authentication required)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected routes - Orders (authenticated users only)
app.get('/api/orders', authenticateToken as any, (req, res) => {
  const db = readDb();
  res.json(db.orders);
});

app.post('/api/orders', authenticateToken as any, (req, res) => {
  const db = readDb();
  const newOrder = req.body;
  db.orders.push(newOrder);
  writeDb(db);
  res.status(201).json(newOrder);
});

// Protected routes - Users (admin only)
app.get('/api/users', requireAdmin as any, (req, res) => {
  const db = readDb();
  res.json(db.users);
});

// Protected routes - Settings (admin only)
app.get('/api/settings', requireAdmin as any, (req, res) => {
  const db = readDb();
  res.json(db.settings);
});

// Update settings (admin only)
app.post('/api/settings', requireAdmin as any, (req: AuthenticatedRequest, res) => {
  const db = readDb();
  const newSettings = req.body;
  
  // Log who updated the settings
  console.log(`Settings updated by ${req.user?.username} (${req.user?.role})`);
  
  db.settings = { 
    ...db.settings, 
    ...newSettings,
    updatedBy: req.user?.username,
    updatedAt: new Date().toISOString()
  };
  writeDb(db);
  res.json(db.settings);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
