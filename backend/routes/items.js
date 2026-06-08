const express = require('express');
const { body } = require('express-validator');
const { query } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

// GET /api/items - list items with filter/search/sort
router.get('/', async (req, res, next) => {
  const { category, search, sort } = req.query;
  try {
    let sql = 'SELECT * FROM items WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sort mappings
    if (sort === 'price_asc') {
      sql += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      sql += ' ORDER BY price DESC';
    } else if (sort === 'date') {
      sql += ' ORDER BY date ASC';
    } else {
      sql += ' ORDER BY createdAt DESC';
    }

    const items = await query(sql, params);
    
    // For each item, attach average rating and review count
    const itemsWithRatings = await Promise.all(items.map(async (item) => {
      const stats = await query(
        'SELECT AVG(rating) as avgRating, COUNT(id) as reviewCount FROM reviews WHERE itemId = ?',
        [item.id]
      );
      return {
        ...item,
        averageRating: stats[0].avgRating ? parseFloat(parseFloat(stats[0].avgRating).toFixed(1)) : 0,
        reviewCount: stats[0].reviewCount || 0
      };
    }));

    res.json(itemsWithRatings);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id - single item details
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const items = await query('SELECT * FROM items WHERE id = ?', [id]);
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    const item = items[0];
    const stats = await query(
      'SELECT AVG(rating) as avgRating, COUNT(id) as reviewCount FROM reviews WHERE itemId = ?',
      [id]
    );

    item.averageRating = stats[0].avgRating ? parseFloat(parseFloat(stats[0].avgRating).toFixed(1)) : 0;
    item.reviewCount = stats[0].reviewCount || 0;

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Item validation schema for POST/PUT
const itemValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').escape(),
  body('description').trim().notEmpty().withMessage('Description is required').escape(),
  body('category').isIn(['food', 'lifestyle', 'education']).withMessage('Category must be food, lifestyle, or education'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('image').trim().notEmpty().withMessage('Image URL is required'),
  body('availability').isInt({ min: 0 }).withMessage('Availability must be a non-negative integer'),
  body('location').trim().notEmpty().withMessage('Location coordinates are required (e.g. "40.7128,-74.0060")').escape(),
  body('date').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Invalid date format (must be YYYY-MM-DD)'),
  validateRequest
];

// POST /api/items - create item (admin only)
router.post('/', authenticateToken, requireAdmin, itemValidation, async (req, res, next) => {
  const { title, description, category, price, image, availability, location, date } = req.body;
  const formattedDate = date || null;
  try {
    const result = await query(
      'INSERT INTO items (title, description, category, price, image, availability, location, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, category, price, image, availability, location, formattedDate]
    );
    res.status(201).json({
      message: 'Item created successfully',
      itemId: result.insertId,
      item: { id: result.insertId, title, description, category, price, image, availability, location, date: formattedDate }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/items/:id - update item (admin only)
router.put('/:id', authenticateToken, requireAdmin, itemValidation, async (req, res, next) => {
  const { id } = req.params;
  const { title, description, category, price, image, availability, location, date } = req.body;
  const formattedDate = date || null;
  try {
    const check = await query('SELECT id FROM items WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    await query(
      'UPDATE items SET title = ?, description = ?, category = ?, price = ?, image = ?, availability = ?, location = ?, date = ? WHERE id = ?',
      [title, description, category, price, image, availability, location, formattedDate, id]
    );

    res.json({
      message: 'Item updated successfully',
      item: { id, title, description, category, price, image, availability, location, date: formattedDate }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/items/:id - delete item (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const check = await query('SELECT id FROM items WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    await query('DELETE FROM items WHERE id = ?', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
