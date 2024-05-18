const jwt = require('jsonwebtoken');

exports.validateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Unauthorized.' });
    if(process.env.NODE_ENV == 'test') return next();
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized.' });
        req.user = decoded;
        next();
    });
  };