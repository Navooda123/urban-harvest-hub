const { validationResult } = require('express-validator');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.param || err.path,
        message: err.msg
      }))
    });
  }
  next();
}

module.exports = {
  validateRequest
};
