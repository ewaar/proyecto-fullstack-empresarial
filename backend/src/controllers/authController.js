const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Correo y contraseña son obligatorios'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({
        message: 'Correo electrónico inválido'
      });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Error de configuración del servidor'
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).populate(
      'clientId',
      'name email company status'
    );

    if (!user) {
      return res.status(400).json({
        message: 'Correo o contraseña incorrectos'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Correo o contraseña incorrectos'
      });
    }

    if (!user.status) {
      return res.status(403).json({
        message: 'Usuario inactivo. Comuníquese con el administrador'
      });
    }

    if (user.role === 'client' && !user.clientId) {
      return res.status(403).json({
        message: 'Este usuario cliente no tiene un cliente asignado'
      });
    }

    if (user.role === 'client' && user.clientId && user.clientId.status === false) {
      return res.status(403).json({
        message: 'El cliente asociado a este usuario está inactivo'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        clientId: user.clientId?._id || null
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clientId: user.clientId?._id || null,
        client: user.clientId || null,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

module.exports = {
  login
};