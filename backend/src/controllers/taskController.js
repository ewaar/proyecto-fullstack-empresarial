const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { createHistory } = require('../utils/historyLogger');

const allowedPriorities = ['baja', 'media', 'alta'];
const allowedStatuses = ['pendiente', 'en progreso', 'completada'];

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

const validateProgress = (progress) => {
  const numericProgress = Number(progress);

  if (Number.isNaN(numericProgress)) {
    return null;
  }

  if (numericProgress < 0 || numericProgress > 100) {
    return null;
  }

  return numericProgress;
};

const validateTaskData = async (data, currentTaskId = null) => {
  const {
    title,
    description,
    responsible,
    priority,
    status,
    progress,
    project
  } = data;

  if (!title || !description || !responsible || !priority || !status || !project) {
    return {
      valid: false,
      statusCode: 400,
      message: 'Todos los campos son obligatorios'
    };
  }

  const normalizedTitle = normalizeText(title);
  const normalizedDescription = normalizeText(description);

  if (normalizedTitle.length < 2) {
    return {
      valid: false,
      statusCode: 400,
      message: 'El título debe tener al menos 2 caracteres'
    };
  }

  if (normalizedDescription.length < 5) {
    return {
      valid: false,
      statusCode: 400,
      message: 'La descripción debe tener al menos 5 caracteres'
    };
  }

  if (!allowedPriorities.includes(priority)) {
    return {
      valid: false,
      statusCode: 400,
      message: 'Prioridad no válida'
    };
  }

  if (!allowedStatuses.includes(status)) {
    return {
      valid: false,
      statusCode: 400,
      message: 'Estado de tarea no válido'
    };
  }

  const numericProgress = validateProgress(progress);

  if (numericProgress === null) {
    return {
      valid: false,
      statusCode: 400,
      message: 'El progreso debe estar entre 0 y 100'
    };
  }

  const existingProject = await Project.findById(project).populate('client');

  if (!existingProject) {
    return {
      valid: false,
      statusCode: 404,
      message: 'Proyecto no encontrado'
    };
  }

  const existingUser = await User.findById(responsible);

  if (!existingUser) {
    return {
      valid: false,
      statusCode: 404,
      message: 'Usuario responsable no encontrado'
    };
  }

  const duplicateFilter = {
    title: normalizedTitle,
    project
  };

  if (currentTaskId) {
    duplicateFilter._id = { $ne: currentTaskId };
  }

  const existingTask = await Task.findOne(duplicateFilter).collation({
    locale: 'en',
    strength: 2
  });

  if (existingTask) {
    return {
      valid: false,
      statusCode: 400,
      message: 'Ya existe una tarea con ese título en este proyecto'
    };
  }

  return {
    valid: true,
    normalizedData: {
      title: normalizedTitle,
      description: normalizedDescription,
      responsible,
      priority,
      status,
      progress: numericProgress,
      project
    },
    existingProject,
    existingUser
  };
};

const createTask = async (req, res) => {
  try {
    const validation = await validateTaskData(req.body);

    if (!validation.valid) {
      return res.status(validation.statusCode).json({
        message: validation.message
      });
    }

    const newTask = new Task(validation.normalizedData);

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
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Ya existe una tarea con ese título en este proyecto'
      });
    }

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

    const validation = await validateTaskData(req.body, req.params.id);

    if (!validation.valid) {
      return res.status(validation.statusCode).json({
        message: validation.message
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      validation.normalizedData,
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
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Ya existe una tarea con ese título en este proyecto'
      });
    }

    res.status(500).json({
      message: 'Error al actualizar tarea',
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
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