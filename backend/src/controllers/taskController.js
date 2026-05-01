const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { createHistory } = require('../utils/historyLogger');

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.userId;
};

const safe = (value, fallback = 'No definido') => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

const createTask = async (req, res) => {
  try {
    console.log('ENTRÓ A CREATE TASK');
    console.log('USUARIO EN TOKEN:', req.user);
    console.log('BODY RECIBIDO:', req.body);

    const {
      title,
      description,
      responsible,
      priority,
      status,
      progress,
      project
    } = req.body;

    if (!title || !description || !responsible || !priority || !status || project === undefined || !project) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    const existingProject = await Project.findById(project).populate('client');

    if (!existingProject) {
      return res.status(404).json({
        message: 'Proyecto no encontrado'
      });
    }

    const existingUser = await User.findById(responsible);

    if (!existingUser) {
      return res.status(404).json({
        message: 'Usuario responsable no encontrado'
      });
    }

    const newTask = new Task({
      title: title.trim(),
      description: description.trim(),
      responsible,
      priority,
      status,
      progress: Number(progress) || 0,
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

    await createHistory({
      project: populatedTask.project?._id,
      client: populatedTask.project?.client?._id,
      task: populatedTask._id,
      user: getUserId(req),
      action: 'Tarea creada',
      description: `Se creó la tarea "${populatedTask.title}" en el proyecto "${populatedTask.project?.name || 'No definido'}"`,
      module: 'tasks',
      type: 'task_created',
      newValue: populatedTask.title
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
      return res.status(404).json({
        message: 'Tarea no encontrada'
      });
    }

    if (
      req.user.role === 'client' &&
      task.project?.client?._id.toString() !== req.user.clientId?.toString()
    ) {
      return res.status(403).json({
        message: 'Acceso denegado'
      });
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
    console.log('ENTRÓ A UPDATE TASK');
    console.log('USUARIO EN TOKEN:', req.user);
    console.log('BODY RECIBIDO:', req.body);

    const {
      title,
      description,
      responsible,
      priority,
      status,
      progress,
      project
    } = req.body;

    if (!title || !description || !responsible || !priority || !status || !project) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    const existingProject = await Project.findById(project).populate('client');

    if (!existingProject) {
      return res.status(404).json({
        message: 'Proyecto no encontrado'
      });
    }

    const existingUser = await User.findById(responsible);

    if (!existingUser) {
      return res.status(404).json({
        message: 'Usuario responsable no encontrado'
      });
    }

    const oldTask = await Task.findById(req.params.id)
      .populate('responsible', 'name email role')
      .populate({
        path: 'project',
        populate: {
          path: 'client'
        }
      });

    if (!oldTask) {
      return res.status(404).json({
        message: 'Tarea no encontrada'
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description.trim(),
        responsible,
        priority,
        status,
        progress: Number(progress) || 0,
        project
      },
      { new: true, runValidators: true }
    )
      .populate('responsible', 'name email role')
      .populate({
        path: 'project',
        populate: {
          path: 'client'
        }
      });

    const changes = [];

    if (safe(oldTask.title) !== safe(updatedTask.title)) {
      changes.push(`título de "${oldTask.title}" a "${updatedTask.title}"`);
    }

    if (safe(oldTask.description) !== safe(updatedTask.description)) {
      changes.push('descripción actualizada');
    }

    if (safe(oldTask.priority) !== safe(updatedTask.priority)) {
      changes.push(`prioridad de "${oldTask.priority}" a "${updatedTask.priority}"`);
    }

    if (safe(oldTask.status) !== safe(updatedTask.status)) {
      changes.push(`estado de "${oldTask.status}" a "${updatedTask.status}"`);

      await createHistory({
        project: updatedTask.project?._id,
        client: updatedTask.project?.client?._id,
        task: updatedTask._id,
        user: getUserId(req),
        action: 'Estado de tarea actualizado',
        description: `Se cambió el estado de la tarea "${updatedTask.title}" de "${oldTask.status}" a "${updatedTask.status}"`,
        module: 'tasks',
        type: 'task_status_changed',
        oldValue: oldTask.status,
        newValue: updatedTask.status
      });
    }

    if (Number(oldTask.progress) !== Number(updatedTask.progress)) {
      changes.push(`progreso de ${oldTask.progress}% a ${updatedTask.progress}%`);

      await createHistory({
        project: updatedTask.project?._id,
        client: updatedTask.project?.client?._id,
        task: updatedTask._id,
        user: getUserId(req),
        action: 'Progreso de tarea actualizado',
        description: `Se cambió el progreso de la tarea "${updatedTask.title}" de ${oldTask.progress}% a ${updatedTask.progress}%`,
        module: 'tasks',
        type: 'task_progress_changed',
        oldValue: `${oldTask.progress}%`,
        newValue: `${updatedTask.progress}%`
      });
    }

    if (
      oldTask.responsible?._id?.toString() !== updatedTask.responsible?._id?.toString()
    ) {
      changes.push(
        `responsable de "${oldTask.responsible?.name || 'No asignado'}" a "${updatedTask.responsible?.name || 'No asignado'}"`
      );
    }

    if (oldTask.project?._id?.toString() !== updatedTask.project?._id?.toString()) {
      changes.push(
        `proyecto de "${oldTask.project?.name || 'No definido'}" a "${updatedTask.project?.name || 'No definido'}"`
      );
    }

    if (changes.length > 0) {
      await createHistory({
        project: updatedTask.project?._id,
        client: updatedTask.project?.client?._id,
        task: updatedTask._id,
        user: getUserId(req),
        action: 'Tarea actualizada',
        description: `Se actualizó la tarea "${updatedTask.title}": ${changes.join(', ')}`,
        module: 'tasks',
        type: 'task_updated',
        oldValue: oldTask.title,
        newValue: updatedTask.title
      });
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
    console.log('ENTRÓ A DELETE TASK');
    console.log('USUARIO EN TOKEN:', req.user);

    const deletedTask = await Task.findByIdAndDelete(req.params.id)
      .populate({
        path: 'project',
        populate: {
          path: 'client'
        }
      });

    if (!deletedTask) {
      return res.status(404).json({
        message: 'Tarea no encontrada'
      });
    }

    await createHistory({
      project: deletedTask.project?._id,
      client: deletedTask.project?.client?._id,
      task: deletedTask._id,
      user: getUserId(req),
      action: 'Tarea eliminada',
      description: `Se eliminó la tarea "${deletedTask.title}" del proyecto "${deletedTask.project?.name || 'No definido'}"`,
      module: 'tasks',
      type: 'task_deleted',
      oldValue: deletedTask.title
    });

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