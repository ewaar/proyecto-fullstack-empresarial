const Client = require('../models/Client');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { createHistory } = require('../utils/historyLogger');

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.userId;
};

const safe = (value, fallback = 'No definido') => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

const createClient = async (req, res) => {
  try {
    console.log('ENTRÓ A CREATE CLIENT');
    console.log('USUARIO EN TOKEN:', req.user);
    console.log('BODY RECIBIDO:', req.body);

    const { name, email, phone, company, status } = req.body;

    if (!name || !email || !phone || !company) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    const existingEmail = await Client.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingEmail) {
      return res.status(400).json({
        message: 'Ya existe un cliente con ese correo'
      });
    }

    const existingNameCompany = await Client.findOne({
      name: name.trim(),
      company: company.trim()
    });

    if (existingNameCompany) {
      return res.status(400).json({
        message: 'Ya existe un cliente con ese nombre en esa empresa'
      });
    }

    const newClient = new Client({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      company: company.trim(),
      status
    });

    await newClient.save();

    await createHistory({
      client: newClient._id,
      user: getUserId(req),
      action: 'Cliente creado',
      description: `Se creó el cliente "${newClient.name}" de la empresa "${newClient.company}"`,
      module: 'clients',
      type: 'client_created',
      newValue: newClient.name
    });

    res.status(201).json({
      message: 'Cliente creado correctamente',
      client: newClient
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear cliente',
      error: error.message
    });
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener clientes',
      error: error.message
    });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado'
      });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener cliente',
      error: error.message
    });
  }
};

const updateClient = async (req, res) => {
  try {
    console.log('ENTRÓ A UPDATE CLIENT');
    console.log('USUARIO EN TOKEN:', req.user);
    console.log('BODY RECIBIDO:', req.body);

    const { name, email, phone, company, status } = req.body;

    if (!name || !email || !phone || !company) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    const existingEmail = await Client.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.params.id }
    });

    if (existingEmail) {
      return res.status(400).json({
        message: 'Ya existe un cliente con ese correo'
      });
    }

    const existingNameCompany = await Client.findOne({
      name: name.trim(),
      company: company.trim(),
      _id: { $ne: req.params.id }
    });

    if (existingNameCompany) {
      return res.status(400).json({
        message: 'Ya existe un cliente con ese nombre en esa empresa'
      });
    }

    const oldClient = await Client.findById(req.params.id);

    if (!oldClient) {
      return res.status(404).json({
        message: 'Cliente no encontrado'
      });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        company: company.trim(),
        status
      },
      { new: true, runValidators: true }
    );

    const changes = [];

    if (safe(oldClient.name) !== safe(updatedClient.name)) {
      changes.push(`nombre de "${oldClient.name}" a "${updatedClient.name}"`);
    }

    if (safe(oldClient.email) !== safe(updatedClient.email)) {
      changes.push(`correo de "${oldClient.email}" a "${updatedClient.email}"`);
    }

    if (safe(oldClient.phone) !== safe(updatedClient.phone)) {
      changes.push(`teléfono de "${oldClient.phone}" a "${updatedClient.phone}"`);
    }

    if (safe(oldClient.company) !== safe(updatedClient.company)) {
      changes.push(`empresa de "${oldClient.company}" a "${updatedClient.company}"`);
    }

    if (safe(oldClient.status) !== safe(updatedClient.status)) {
      changes.push(`estado de "${oldClient.status}" a "${updatedClient.status}"`);
    }

    if (changes.length > 0) {
      await createHistory({
        client: updatedClient._id,
        user: getUserId(req),
        action: 'Cliente actualizado',
        description: `Se actualizó el cliente "${updatedClient.name}": ${changes.join(', ')}`,
        module: 'clients',
        type: 'client_updated',
        oldValue: oldClient.name,
        newValue: updatedClient.name
      });
    }

    res.json({
      message: 'Cliente actualizado correctamente',
      client: updatedClient
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar cliente',
      error: error.message
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    console.log('ENTRÓ A DELETE CLIENT');
    console.log('USUARIO EN TOKEN:', req.user);

    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado'
      });
    }

    const clientProjects = await Project.find({
      client: client._id
    }).select('_id name');

    const projectIds = clientProjects.map((project) => project._id);

    const relatedTasksCount = await Task.countDocuments({
      project: { $in: projectIds }
    });

    const relatedUsersCount = await User.countDocuments({
      clientId: client._id,
      role: 'client'
    });

    await createHistory({
      client: client._id,
      user: getUserId(req),
      action: 'Cliente eliminado',
      description: `Se eliminó el cliente "${client.name}" de la empresa "${client.company}". También se eliminaron ${projectIds.length} proyecto(s), ${relatedTasksCount} tarea(s) y ${relatedUsersCount} usuario(s) relacionados.`,
      module: 'clients',
      type: 'client_deleted',
      oldValue: client.name
    });

    if (projectIds.length > 0) {
      await Task.deleteMany({
        project: { $in: projectIds }
      });

      await Project.deleteMany({
        client: client._id
      });
    }

    await User.deleteMany({
      clientId: client._id,
      role: 'client'
    });

    await Client.findByIdAndDelete(client._id);

    res.json({
      message: 'Cliente y datos relacionados eliminados correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar cliente',
      error: error.message
    });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
};