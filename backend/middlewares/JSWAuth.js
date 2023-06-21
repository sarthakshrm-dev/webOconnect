const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const authToken = token.split(' ')[1]
      const decoded = jwt.verify(authToken, process.env.SECRET_KEY, { algorithm: 'HS256' });
  
      req.user = decoded;

      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
module.exports = authenticateJWT;
