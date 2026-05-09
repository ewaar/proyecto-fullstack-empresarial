const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Client = require('../models/Client');
const { createHistory } = require('../utils/historyLogger');

const allowedRoles = ['admin', 'user', 'client'];

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.userId;
};

const safe = (value, fallback = 'No definido') => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

const normalizeText = (text) => {
  return text.trim().replace(/\s+/g, ' ');
};

const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const validateUserData = async (data, currentUserId = null, isUpdate = false) => {
  const { name, email, password, role, clientId, status } = data;

  if (!name || !email || !role) {
    return {
      valid: false,
      statusCode: 400,
      message: 'Nombre, correo y rol son obligatorios'
    };
  }

  if (!isUpdate && !password) {
    return {
      valid: false,
      statusCode: 400,
      message: 'La contraseña es obligatoria'
    };
  }

  const normalizedName = normalizeText(name);
  const normalizedEmail = email.toLowerCase().trim();

  if (normalizedName.length < 2) {
    return {
      valid: false,
      statusCode: 400,
      message: 'El nombre debe tener al menos 2 caracteres'
    };
  }

  if (!validateEmail(normalizedEmail)) {
    return {
      valid: false,
      statusCode: 400,
      message: 'Correo electrónico inválido'
    };
  }

  if (password && password.trim() !== '' && password.length < 6) {
    return {
      valid: false,
      statusCode: 400,
      message: 'La contraseña debe tener al menos 6 caracteres'
    };
  }

  if (!allowedRoles.includes(role)) {
    return {
      valid: false,
      statusCode: 400,
      message: 'Rol inválido'
    };
  }

  if (role === 'client' && !clientId) {
    return {
      valid: false,
      statusCode: 400,
      message: 'Debe seleccionar un cliente para el usuario cliente'
    };
  }

  let clientExists = null;

  if (role === 'client') {
    clientExists = await Client.findById(clientId);

    if (!clientExists) {
      return {
        valid: false,
        statusCode: 404,
        message: 'Cliente no encontrado'
      };
    }

    const existingClientUserFilter = {
      role: 'client',
      clientId
    };

    if (currentUserId) {
      existingClientUserFilter._id = { $ne: currentUserId };
    }

    const existingClientUser = await User.findOne(existingClientUserFilter);

    if (existingClientUser) {
      return {
        valid: false,
        statusCode: 400,
        message: 'Ese cliente ya tiene un usuario asignado'
      };
    }
  }

  const emailFilter = {
    email: normalizedEmail
  };

  if (currentUserId) {
    emailFilter._id = { $ne: currentUserId };
  }

  const existingEmail = await User.findOne(emailFilter);

  if (existingEmail) {
    return {
      valid: false,
      statusCode: 400,
      message: 'Ya existe un usuario con ese correo'
    };
  }

  return {
    valid: true,
    normalizedData: {
      name: normalizedName,
      email: normalizedEmail,
      role,
      clientId: role === 'client' ? clientId : null,
      status: typeof status === 'boolean' ? status : true
    },
    clientExists
  };
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
    const validation = await validateUserData(req.body, null, false);

    if (!validation.valid) {
      return res.status(validation.statusCode).json({
        message: validation.message
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      ...validation.normalizedData,
      password: hashedPassword
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
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Ya existe un usuario con ese correo'
      });
    }

    res.status(500).json({
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const oldUser = await User.findById(req.params.id)
      .select('-password')
      .populate('clientId', 'name email company');

    if (!oldUser) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    const validation = await validateUserData(req.body, req.params.id, true);

    if (!validation.valid) {
      return res.status(validation.statusCode).json({
        message: validation.message
      });
    }

    const updateData = {
      ...validation.normalizedData
    };

    if (req.body.password && req.body.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    })
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

    if (req.body.password && req.body.password.trim() !== '') {
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
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Ya existe un usuario con ese correo'
      });
    }

    res.status(500).json({
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
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

    const adminCount = await User.countDocuments({
      role: 'admin',
      status: true
    });

    if (userToDelete.role === 'admin' && adminCount <= 1) {
      return res.status(400).json({
        message: 'No puede eliminar el único administrador activo'
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