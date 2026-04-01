const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Client = require('../models/Client');

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('clientId', 'name company email')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role, clientId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (!['admin', 'user', 'client'].includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    if (req.user.role === 'user' && role === 'admin') {
      return res.status(403).json({ message: 'Un usuario normal no puede crear administradores' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    let relatedClientId = null;

    if (role === 'client') {
      if (!clientId) {
        return res.status(400).json({ message: 'El cliente es obligatorio para el rol client' });
      }

      const existingClient = await Client.findById(clientId);

      if (!existingClient) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      const clientAlreadyLinked = await User.findOne({ clientId, role: 'client' });

      if (clientAlreadyLinked) {
        return res.status(400).json({ message: 'Ese cliente ya tiene un usuario asignado' });
      }

      relatedClientId = clientId;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      clientId: relatedClientId
    });

    await newUser.save();

    const populatedUser = await User.findById(newUser._id)
      .populate('clientId', 'name company email')
      .select('-password');

    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: populatedUser
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role, status, clientId } = req.body;

    const userToEdit = await User.findById(req.params.id);

    if (!userToEdit) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.params.id }
    });

    if (existingEmail) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    let newRole = userToEdit.role;
    let newClientId = userToEdit.clientId || null;

    if (req.user.role === 'admin') {
      if (role && !['admin', 'user', 'client'].includes(role)) {
        return res.status(400).json({ message: 'Rol inválido' });
      }

      newRole = role || userToEdit.role;

      if (newRole === 'client') {
        if (!clientId) {
          return res.status(400).json({ message: 'El cliente es obligatorio para el rol client' });
        }

        const existingClient = await Client.findById(clientId);
        if (!existingClient) {
          return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const clientAlreadyLinked = await User.findOne({
          clientId,
          role: 'client',
          _id: { $ne: req.params.id }
        });

        if (clientAlreadyLinked) {
          return res.status(400).json({ message: 'Ese cliente ya tiene un usuario asignado' });
        }

        newClientId = clientId;
      } else {
        newClientId = null;
      }
    }

    if (req.user.role === 'user') {
      if (role && role !== userToEdit.role) {
        return res.status(403).json({ message: 'Un usuario normal no puede cambiar roles' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: newRole,
        clientId: newClientId,
        status
      },
      { new: true, runValidators: true }
    )
      .populate('clientId', 'name company email')
      .select('-password');

    res.json({
      message: 'Usuario actualizado correctamente',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo el administrador puede eliminar usuarios' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  createUserByAdmin,
  updateUser,
  deleteUser
};