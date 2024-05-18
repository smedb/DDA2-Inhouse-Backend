exports.validateToken = (req, res, next) => {
    const token = req.headers.authorization;
  console.log('1')
    if (!token) return res.status(401).json({ error: 'Unauthorized.' });
    console.log('2')
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized.' });
        req.user = decoded;
        console.log('3')
  
        next();
    });
  };