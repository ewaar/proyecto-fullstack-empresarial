const Project = require('../models/Project');
const Client = require('../models/Client');
const { createHistory } = require('../utils/historyLogger');

const validateDates = (startDate, endDate) => {
  return new Date(endDate) >= new Date(startDate);
};

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.userId;
};

const formatDate = (date) => {
  if (!date) return 'No definida';
  return new Date(date).toLocaleDateString('es-GT');
};

const safe = (value, fallback = 'No definido') => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

const createProject = async (req, res) => {
  try {
    console.log('ENTRÓ A CREATE PROJECT');
    console.log('USUARIO EN TOKEN:', req.user);
    console.log('BODY RECIBIDO:', req.body);
    const { name, description, startDate, endDate, status, client } = req.body;

    if (!name || !description || !startDate || !endDate || !client) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    const existingClient = await Client.findById(client);

    if (!existingClient) {
      return res.status(404).json({
        message: 'Cliente no encontrado'
      });
    }

    if (!validateDates(startDate, endDate)) {
      return res.status(400).json({
        message: 'La fecha de fin no puede ser menor a la fecha de inicio'
      });
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

    await createHistory({
  project: populatedProject._id,
  client: populatedProject.client?._id,
  user: getUserId(req),
  action: 'Proyecto creado',
  description: `Se creó el proyecto "${populatedProject.name}" para el cliente "${populatedProject.client?.name || 'No definido'}"`,
  module: 'projects',
  type: 'project_created',
  newValue: populatedProject.name
});

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
      return res.status(404).json({
        message: 'Proyecto no encontrado'
      });
    }

    if (
      req.user.role === 'client' &&
      project.client._id.toString() !== req.user.clientId?.toString()
    ) {
      return res.status(403).json({
        message: 'Acceso denegado'
      });
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
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    const existingClient = await Client.findById(client);

    if (!existingClient) {
      return res.status(404).json({
        message: 'Cliente no encontrado'
      });
    }

    if (!validateDates(startDate, endDate)) {
      return res.status(400).json({
        message: 'La fecha de fin no puede ser menor a la fecha de inicio'
      });
    }

    const oldProject = await Project.findById(req.params.id).populate('client');

    if (!oldProject) {
      return res.status(404).json({
        message: 'Proyecto no encontrado'
      });
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

    const changes = [];

    if (safe(oldProject.name) !== safe(updatedProject.name)) {
      changes.push(`nombre de "${oldProject.name}" a "${updatedProject.name}"`);
    }

    if (safe(oldProject.description) !== safe(updatedProject.description)) {
      changes.push('descripción actualizada');
    }

    if (formatDate(oldProject.startDate) !== formatDate(updatedProject.startDate)) {
      changes.push(
        `fecha inicio de ${formatDate(oldProject.startDate)} a ${formatDate(updatedProject.startDate)}`
      );
    }

    if (formatDate(oldProject.endDate) !== formatDate(updatedProject.endDate)) {
      changes.push(
        `fecha fin de ${formatDate(oldProject.endDate)} a ${formatDate(updatedProject.endDate)}`
      );
    }

    if (safe(oldProject.status) !== safe(updatedProject.status)) {
      changes.push(`estado de "${oldProject.status}" a "${updatedProject.status}"`);
    }

    if (
      oldProject.client?._id?.toString() !== updatedProject.client?._id?.toString()
    ) {
      changes.push(
        `cliente de "${oldProject.client?.name || 'No definido'}" a "${updatedProject.client?.name || 'No definido'}"`
      );
    }

    if (changes.length > 0) {
      await createHistory({
        project: updatedProject._id,
        client: updatedProject.client?._id,
        user: getUserId(req),
        action: 'Proyecto actualizado',
        description: `Se actualizó el proyecto "${updatedProject.name}": ${changes.join(', ')}`,
        module: 'projects',
        type: 'project_updated',
        oldValue: oldProject.name,
        newValue: updatedProject.name
      });
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
    const deletedProject = await Project.findByIdAndDelete(req.params.id).populate('client');

    if (!deletedProject) {
      return res.status(404).json({
        message: 'Proyecto no encontrado'
      });
    }

    await createHistory({
      project: deletedProject._id,
      client: deletedProject.client?._id,
      user: getUserId(req),
      action: 'Proyecto eliminado',
      description: `Se eliminó el proyecto "${deletedProject.name}"`,
      module: 'projects',
      type: 'project_deleted',
      oldValue: deletedProject.name
    });

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