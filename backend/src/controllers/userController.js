const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Client = require('../models/Client');
const { createHistory } = require('../utils/historyLogger');

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.userId;
};

const safe = (value, fallback = 'No definido') => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('clientId', 'name email company')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('clientId', 'name email company');

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

const createUser = async (req, res) => {
  try {
    console.log('ENTRÓ A CREATE USER');
    console.log('USUARIO EN TOKEN:', req.user);
    console.log('BODY RECIBIDO:', req.body);

    const { name, email, password, role, clientId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'Nombre, correo, contraseña y rol son obligatorios'
      });
    }

    if (!['admin', 'user', 'client'].includes(role)) {
      return res.status(400).json({
        message: 'Rol inválido'
      });
    }

    if (role === 'client' && !clientId) {
      return res.status(400).json({
        message: 'Debe seleccionar un cliente para el usuario cliente'
      });
    }

    if (role === 'client') {
      const clientExists = await Client.findById(clientId);

      if (!clientExists) {
        return res.status(404).json({
          message: 'Cliente no encontrado'
        });
      }
    }

    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingEmail) {
      return res.status(400).json({
        message: 'Ya existe un usuario con ese correo'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      clientId: role === 'client' ? clientId : null
    });

    await newUser.save();

    const userWithoutPassword = await User.findById(newUser._id)
      .select('-password')
      .populate('clientId', 'name email company');

    await createHistory({
      affectedUser: userWithoutPassword._id,
      client: userWithoutPassword.clientId?._id || null,
      user: getUserId(req),
      action: 'Usuario creado',
      description: `Se creó el usuario "${userWithoutPassword.name}" con rol "${userWithoutPassword.role}"`,
      module: 'users',
      type: 'user_created',
      newValue: userWithoutPassword.name
    });

    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: userWithoutPassword
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
    console.log('ENTRÓ A UPDATE USER');
    console.log('USUARIO EN TOKEN:', req.user);
    console.log('BODY RECIBIDO:', req.body);

    const { name, email, password, role, clientId } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        message: 'Nombre, correo y rol son obligatorios'
      });
    }

    if (!['admin', 'user', 'client'].includes(role)) {
      return res.status(400).json({
        message: 'Rol inválido'
      });
    }

    if (role === 'client' && !clientId) {
      return res.status(400).json({
        message: 'Debe seleccionar un cliente para el usuario cliente'
      });
    }

    if (role === 'client') {
      const clientExists = await Client.findById(clientId);

      if (!clientExists) {
        return res.status(404).json({
          message: 'Cliente no encontrado'
        });
      }
    }

    const oldUser = await User.findById(req.params.id)
      .select('-password')
      .populate('clientId', 'name email company');

    if (!oldUser) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.params.id }
    });

    if (existingEmail) {
      return res.status(400).json({
        message: 'Ya existe un usuario con ese correo'
      });
    }

    const updateData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role,
      clientId: role === 'client' ? clientId : null
    };

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('clientId', 'name email company');

    const changes = [];

    if (safe(oldUser.name) !== safe(updatedUser.name)) {
      changes.push(`nombre de "${oldUser.name}" a "${updatedUser.name}"`);
    }

    if (safe(oldUser.email) !== safe(updatedUser.email)) {
      changes.push(`correo de "${oldUser.email}" a "${updatedUser.email}"`);
    }

    if (safe(oldUser.role) !== safe(updatedUser.role)) {
      changes.push(`rol de "${oldUser.role}" a "${updatedUser.role}"`);
    }

    const oldClientName = oldUser.clientId?.name || 'No asignado';
    const newClientName = updatedUser.clientId?.name || 'No asignado';

    if (oldClientName !== newClientName) {
      changes.push(`cliente asociado de "${oldClientName}" a "${newClientName}"`);
    }

    if (password && password.trim() !== '') {
      changes.push('contraseña actualizada');
    }

    if (changes.length > 0) {
      await createHistory({
        affectedUser: updatedUser._id,
        client: updatedUser.clientId?._id || null,
        user: getUserId(req),
        action: 'Usuario actualizado',
        description: `Se actualizó el usuario "${updatedUser.name}": ${changes.join(', ')}`,
        module: 'users',
        type: 'user_updated',
        oldValue: oldUser.name,
        newValue: updatedUser.name
      });
    }

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
    console.log('ENTRÓ A DELETE USER');
    console.log('USUARIO EN TOKEN:', req.user);

    const userToDelete = await User.findById(req.params.id)
      .select('-password')
      .populate('clientId', 'name email company');

    if (!userToDelete) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    if (userToDelete._id.toString() === getUserId(req)?.toString()) {
      return res.status(400).json({
        message: 'No puede eliminar su propio usuario'
      });
    }

    await createHistory({
      affectedUser: userToDelete._id,
      client: userToDelete.clientId?._id || null,
      user: getUserId(req),
      action: 'Usuario eliminado',
      description: `Se eliminó el usuario "${userToDelete.name}" con rol "${userToDelete.role}"`,
      module: 'users',
      type: 'user_deleted',
      oldValue: userToDelete.name
    });

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
  getUserById,
  createUser,
  updateUser,
  deleteUser
};