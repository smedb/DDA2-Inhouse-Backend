const jwt = require('jsonwebtoken');

exports.validateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if(process.env.NODE_ENV == 'test') return next();
    if (!token) return res.status(401).json({ error: 'Unauthorized.' });
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized.' });
        req.user = decoded;
        next();
    });
  };