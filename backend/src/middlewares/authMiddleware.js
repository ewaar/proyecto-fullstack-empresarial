const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No autorizado, token no proporcionado'
    });
  }

  try {
    token = token.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Error de configuración del servidor'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      _id: decoded.id,
      role: decoded.role,
      clientId: decoded.clientId || null
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Sesión inválida o expirada'
    });
  }
};

module.exports = protect;