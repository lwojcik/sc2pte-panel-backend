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

router.post('/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;

    const {
      server,
      playerid,
      region,
      name,
      token,
    } = req.headers;

    const configObject = {
      channelId,
      server,
      playerid,
      region,
      name,
      token,
    };

    const response = await saveConfig(configObject);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(400).json({ status: 400, message: 'Bad request' });
  }
});

module.exports = router;
