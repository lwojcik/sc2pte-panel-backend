/**
 * @file    v0 API status route file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-26
 */

const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'API online',
  });
});

module.exports = router;
