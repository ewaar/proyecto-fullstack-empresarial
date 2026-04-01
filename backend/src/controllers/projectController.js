const Project = require('../models/Project');
const Client = require('../models/Client');

const validateDates = (startDate, endDate) => {
  return new Date(endDate) >= new Date(startDate);
};

const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status, client } = req.body;

    if (!name || !description || !startDate || !endDate || !client) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingClient = await Client.findById(client);

    if (!existingClient) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    if (!validateDates(startDate, endDate)) {
      return res.status(400).json({ message: 'La fecha de fin no puede ser menor a la fecha de inicio' });
    }

    const newProject = new Project({
      name: name.trim(),
      description: description.trim(),
      startDate,
      endDate,
      status,
      client
    });

    await newProject.save();

    const populatedProject = await Project.findById(newProject._id).populate('client');

    res.status(201).json({
      message: 'Proyecto creado correctamente',
      project: populatedProject
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear proyecto',
      error: error.message
    });
  }
};

const getProjects = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'client') {
      filter.client = req.user.clientId;
    }

    const projects = await Project.find(filter)
      .populate('client')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener proyectos',
      error: error.message
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('client');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    if (
      req.user.role === 'client' &&
      project.client._id.toString() !== req.user.clientId?.toString()
    ) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener proyecto',
      error: error.message
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status, client } = req.body;

    if (!name || !description || !startDate || !endDate || !client) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingClient = await Client.findById(client);

    if (!existingClient) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    if (!validateDates(startDate, endDate)) {
      return res.status(400).json({ message: 'La fecha de fin no puede ser menor a la fecha de inicio' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        description: description.trim(),
        startDate,
        endDate,
        status,
        client
      },
      { new: true, runValidators: true }
    ).populate('client');

    if (!updatedProject) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json({
      message: 'Proyecto actualizado correctamente',
      project: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar proyecto',
      error: error.message
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json({
      message: 'Proyecto eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar proyecto',
      error: error.message
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};