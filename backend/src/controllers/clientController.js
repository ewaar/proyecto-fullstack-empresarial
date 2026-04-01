const Client = require('../models/Client');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

const createClient = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;

    if (!name || !email || !phone || !company) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingEmail = await Client.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingEmail) {
      return res.status(400).json({ message: 'Ya existe un cliente con ese correo' });
    }

    const existingNameCompany = await Client.findOne({
      name: name.trim(),
      company: company.trim()
    });

    if (existingNameCompany) {
      return res.status(400).json({ message: 'Ya existe un cliente con ese nombre en esa empresa' });
    }

    const newClient = new Client({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      company: company.trim(),
      status
    });

    await newClient.save();

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
      return res.status(404).json({ message: 'Cliente no encontrado' });
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
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingEmail = await Client.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.params.id }
    });

    if (existingEmail) {
      return res.status(400).json({ message: 'Ya existe un cliente con ese correo' });
    }

    const existingNameCompany = await Client.findOne({
      name: name.trim(),
      company: company.trim(),
      _id: { $ne: req.params.id }
    });

    if (existingNameCompany) {
      return res.status(400).json({ message: 'Ya existe un cliente con ese nombre en esa empresa' });
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

    if (!updatedClient) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
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
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const clientProjects = await Project.find({ client: client._id }).select('_id');
    const projectIds = clientProjects.map((project) => project._id);

    if (projectIds.length > 0) {
      await Task.deleteMany({ project: { $in: projectIds } });
      await Project.deleteMany({ client: client._id });
    }

    await User.deleteMany({ clientId: client._id, role: 'client' });

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