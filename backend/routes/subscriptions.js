const express = require('express');
const { body } = require('express-validator');
const { query } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

// GET /api/subscriptions - Admin only, view all subscriptions
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const subscriptions = await query('SELECT * FROM subscriptions ORDER BY createdAt DESC');
    res.json(subscriptions);
  } catch (err) {
    next(err);
  }
});

// POST /api/subscriptions - subscribe to a recurring product box
router.post('/', [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('frequency').isIn(['weekly', 'monthly', 'biweekly']).withMessage('Frequency must be weekly, monthly, or biweekly'),
  validateRequest
], async (req, res, next) => {
  const { email, frequency } = req.body;
  try {
    // Check if email already subscribed
    const existing = await query('SELECT id FROM subscriptions WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'This email is already subscribed to a product box.' });
    }

    const result = await query(
      'INSERT INTO subscriptions (email, frequency) VALUES (?, ?)',
      [email, frequency]
    );

    res.status(201).json({
      message: 'Subscription created successfully! Welcome to the Urban Harvest Box.',
      subscriptionId: result.insertId,
      subscription: { id: result.insertId, email, frequency }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
