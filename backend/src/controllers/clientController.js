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

const normalizeText = (text) => {
  return text.trim().replace(/\s+/g, ' ');
};

const createClient = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;

    if (!name || !email || !phone || !company) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    const normalizedName = normalizeText(name);
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();
    const normalizedCompany = normalizeText(company);

    const existingEmail = await Client.findOne({
      email: normalizedEmail
    });

    if (existingEmail) {
      return res.status(400).json({
        message: 'Ya existe un cliente con ese correo'
      });
    }

    const existingPhone = await Client.findOne({
      phone: normalizedPhone
    });

    if (existingPhone) {
      return res.status(400).json({
        message: 'Ya existe un cliente con ese teléfono'
      });
    }

    const existingNameCompany = await Client.findOne({
      name: normalizedName,
      company: normalizedCompany
    }).collation({ locale: 'en', strength: 2 });

    if (existingNameCompany) {
      return res.status(400).json({
        message: 'Ya existe un cliente con ese nombre en esa empresa'
      });
    }

    const newClient = new Client({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      company: normalizedCompany,
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
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Ya existe un cliente con esos datos'
      });
    }

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
    const { name, email, phone, company, status } = req.body;

    if (!name || !email || !phone || !company) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    const normalizedName = normalizeText(name);
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();
    const normalizedCompany = normalizeText(company);

    const existingEmail = await Client.findOne({
      email: normalizedEmail,
      _id: { $ne: req.params.id }
    });

    if (existingEmail) {
      return res.status(400).json({
        message: 'Ya existe un cliente con ese correo'
      });
    }

    const existingPhone = await Client.findOne({
      phone: normalizedPhone,
      _id: { $ne: req.params.id }
    });

    if (existingPhone) {
      return res.status(400).json({
        message: 'Ya existe un cliente con ese teléfono'
      });
    }

    const existingNameCompany = await Client.findOne({
      name: normalizedName,
      company: normalizedCompany,
      _id: { $ne: req.params.id }
    }).collation({ locale: 'en', strength: 2 });

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
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
        company: normalizedCompany,
        status
      },
      {
        new: true,
        runValidators: true
      }
    );

    await createHistory({
      client: updatedClient._id,
      user: getUserId(req),
      action: 'Cliente actualizado',
      description: `Se actualizó el cliente "${updatedClient.name}"`,
      module: 'clients',
      type: 'client_updated',
      oldValue: oldClient.name,
      newValue: updatedClient.name
    });

    res.json({
      message: 'Cliente actualizado correctamente',
      client: updatedClient
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Ya existe un cliente con esos datos'
      });
    }

    res.status(500).json({
      message: 'Error al actualizar cliente',
      error: error.message
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado'
      });
    }

    const projects = await Project.find({
      client: client._id
    });

    const projectIds = projects.map((project) => project._id);

    const totalProjects = projects.length;

    const totalTasks = await Task.countDocuments({
      project: { $in: projectIds }
    });

    await Task.deleteMany({
      project: { $in: projectIds }
    });

    await Project.deleteMany({
      client: client._id
    });

    await Client.findByIdAndDelete(req.params.id);

    await createHistory({
      client: client._id,
      user: getUserId(req),
      action: 'Cliente eliminado',
      description: `Se eliminó el cliente "${client.name}" y también se eliminaron sus relaciones asociadas: ${totalProjects} proyecto(s) y ${totalTasks} tarea(s).`,
      module: 'clients',
      type: 'client_deleted',
      oldValue: client.name,
      newValue: `Relaciones eliminadas: ${totalProjects} proyecto(s), ${totalTasks} tarea(s)`
    });

    res.json({
      message: 'Cliente eliminado correctamente',
      deletedRelations: {
        projects: totalProjects,
        tasks: totalTasks
      }
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