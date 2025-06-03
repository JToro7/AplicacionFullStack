import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Aqui solo seextrae el token del encabezado Authorization
  
  //miramos si el token existe
  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    
    req.userId = user.userId;
    next();
  });
};