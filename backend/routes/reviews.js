const express = require('express');
const { body } = require('express-validator');
const { query } = require('../database');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

// GET /api/reviews - get reviews for an item
router.get('/', async (req, res, next) => {
  const { itemId } = req.query;
  if (!itemId) {
    return res.status(400).json({ error: 'itemId query parameter is required' });
  }

  try {
    const reviews = await query(`
      SELECT r.*, u.name as userName 
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE r.itemId = ?
      ORDER BY r.createdAt DESC
    `, [itemId]);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews - submit review (authenticated users only, must have booked item)
router.post('/', authenticateToken, [
  body('itemId').isInt().withMessage('Invalid item ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment cannot be empty').escape(),
  validateRequest
], async (req, res, next) => {
  const { itemId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    // 1. Verify item exists
    const items = await query('SELECT title FROM items WHERE id = ?', [itemId]);
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    // 2. Verify user has booked/registered for this item
    const bookings = await query(
      'SELECT id FROM bookings WHERE userId = ? AND itemId = ? LIMIT 1',
      [userId, itemId]
    );

    if (bookings.length === 0) {
      return res.status(400).json({ 
        error: 'You can only leave reviews on items (workshops/events/products) that you have booked or purchased.' 
      });
    }

    // 3. Optional check: Has the user already reviewed this item?
    const existingReview = await query(
      'SELECT id FROM reviews WHERE userId = ? AND itemId = ? LIMIT 1',
      [userId, itemId]
    );
    if (existingReview.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this item.' });
    }

    // 4. Insert the review
    const result = await query(
      'INSERT INTO reviews (userId, itemId, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, itemId, rating, comment]
    );

    res.status(201).json({
      message: 'Review submitted successfully',
      reviewId: result.insertId,
      review: { id: result.insertId, userId, itemId, rating, comment, userName: req.user.name }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
