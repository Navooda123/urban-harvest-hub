const express = require('express');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const { query } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'urban_harvest_hub_secret_key';

// GET /api/bookings - Admin only, view all bookings with item details
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const bookings = await query(`
      SELECT b.*, i.title as itemTitle, i.category as itemCategory 
      FROM bookings b
      JOIN items i ON b.itemId = i.id
      ORDER BY b.createdAt DESC
    `);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// POST /api/bookings - book a workshop/event or buy a product
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('itemId').isInt().withMessage('Invalid item ID'),
  body('date').isISO8601().withMessage('Invalid date (must be YYYY-MM-DD)'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  validateRequest
], async (req, res, next) => {
  const { name, email, itemId, date, quantity } = req.body;
  
  // Try to associate with a logged-in user if JWT token is passed in header
  let userId = null;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      // If token is expired or invalid, we still allow booking as a guest
    }
  }

  try {
    // 1. Check if the item exists and has enough availability
    const items = await query('SELECT title, availability, category FROM items WHERE id = ?', [itemId]);
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    const item = items[0];
    if (item.availability < quantity) {
      return res.status(400).json({ 
        error: `Insufficient availability. Only ${item.availability} slots/items left for "${item.title}".` 
      });
    }

    // 2. Insert the booking
    const result = await query(
      'INSERT INTO bookings (userId, itemId, name, email, date, quantity) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, itemId, name, email, date, quantity]
    );

    // 3. Decrement item availability
    await query('UPDATE items SET availability = availability - ? WHERE id = ?', [quantity, itemId]);

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: result.insertId,
      booking: { id: result.insertId, userId, itemId, name, email, date, quantity }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
