const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

const createTask = async (req, res) => {
  try {
    const { title, description, responsible, priority, status, progress, project } = req.body;

    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const existingUser = await User.findById(responsible);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario responsable no encontrado' });
    }

    const newTask = new Task({
      title,
      description,
      responsible,
      priority,
      status,
      progress,
      project
    });

    await newTask.save();

    const populatedTask = await Task.findById(newTask._id)
      .populate('responsible', 'name email role')
      .populate({
        path: 'project',
        populate: {
          path: 'client'
        }
      });

    res.status(201).json({
      message: 'Tarea creada correctamente',
      task: populatedTask
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear tarea',
      error: error.message
    });
  }
};

const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'client') {
      tasks = await Task.find()
        .populate('responsible', 'name email role')
        .populate({
          path: 'project',
          populate: {
            path: 'client'
          }
        })
        .sort({ createdAt: -1 });

      tasks = tasks.filter(
        (task) =>
          task.project &&
          task.project.client &&
          task.project.client._id.toString() === req.user.clientId?.toString()
      );
    } else {
      tasks = await Task.find()
        .populate('responsible', 'name email role')
        .populate({
          path: 'project',
          populate: {
            path: 'client'
          }
        })
        .sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener tareas',
      error: error.message
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('responsible', 'name email role')
      .populate({
        path: 'project',
        populate: {
          path: 'client'
        }
      });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (
      req.user.role === 'client' &&
      task.project?.client?._id.toString() !== req.user.clientId?.toString()
    ) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener tarea',
      error: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, responsible, priority, status, progress, project } = req.body;

    if (project) {
      const existingProject = await Project.findById(project);
      if (!existingProject) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
    }

    if (responsible) {
      const existingUser = await User.findById(responsible);
      if (!existingUser) {
        return res.status(404).json({ message: 'Usuario responsable no encontrado' });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, responsible, priority, status, progress, project },
      { new: true }
    )
      .populate('responsible', 'name email role')
      .populate({
        path: 'project',
        populate: {
          path: 'client'
        }
      });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json({
      message: 'Tarea actualizada correctamente',
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar tarea',
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json({
      message: 'Tarea eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar tarea',
      error: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};