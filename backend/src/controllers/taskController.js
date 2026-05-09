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

const getProgressByStatus = (status, progress) => {
  const numericProgress = Number(progress);

  if (status === 'pendiente') return 0;
  if (status === 'completada') return 100;

  if (Number.isNaN(numericProgress)) return null;

  if (status === 'en progreso') {
    if (numericProgress <= 0 || numericProgress >= 100) return null;
    return numericProgress;
  }

  return numericProgress;
};

const getActionType = (status) => {
  if (status === 'pendiente') return 'creacion';
  if (status === 'completada') return 'finalizacion';
  return 'seguimiento';
};

const validateTaskData = async (data) => {
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

  const finalProgress = getProgressByStatus(status, progress);

  if (finalProgress === null) {
    return {
      valid: false,
      statusCode: 400,
      message: 'Las tareas en progreso deben tener un porcentaje entre 1% y 99%'
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

  return {
    valid: true,
    normalizedData: {
      title: normalizedTitle,
      description: normalizedDescription,
      responsible,
      priority,
      status,
      progress: finalProgress,
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

    const existingInitialTask = await Task.findOne({
      title: validation.normalizedData.title,
      project: validation.normalizedData.project,
      version: 1
    }).collation({ locale: 'en', strength: 2 });

    if (existingInitialTask) {
      return res.status(400).json({
        message: 'Ya existe una tarea inicial con ese título en este proyecto'
      });
    }

    const newTask = new Task({
      ...validation.normalizedData,
      parentTask: null,
      previousTask: null,
      version: 1,
      followUpDate: new Date(),
      isLatest: true,
      actionType: getActionType(validation.normalizedData.status)
    });

    await newTask.save();

    newTask.parentTask = newTask._id;
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
      description: `Se creó la tarea "${populatedTask.title}" en estado "${populatedTask.status}" con ${populatedTask.progress}% de avance`,
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
    let filter = {};

    if (req.query.latest === 'true') {
      filter.isLatest = true;
    }

    if (req.query.project) {
      filter.project = req.query.project;
    }

    let tasks = await Task.find(filter)
      .populate('responsible', 'name email role')
      .populate({
        path: 'project',
        populate: {
          path: 'client'
        }
      })
      .populate('parentTask', 'title')
      .populate('previousTask', 'title status progress version followUpDate')
      .sort({ parentTask: 1, version: 1, followUpDate: 1 });

    if (req.user.role === 'client') {
      tasks = tasks.filter(
        (task) =>
          task.project &&
          task.project.client &&
          task.project.client._id.toString() === req.user.clientId?.toString()
      );
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
      })
      .populate('parentTask', 'title')
      .populate('previousTask', 'title status progress version followUpDate');

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

    const validation = await validateTaskData(req.body);

    if (!validation.valid) {
      return res.status(validation.statusCode).json({
        message: validation.message
      });
    }

    const parentTaskId = oldTask.parentTask || oldTask._id;

    const latestTask = await Task.findOne({
      parentTask: parentTaskId,
      isLatest: true
    });

    if (latestTask && latestTask._id.toString() !== oldTask._id.toString()) {
      return res.status(400).json({
        message: 'Solo puede dar seguimiento a la versión más reciente de la tarea'
      });
    }

    await Task.updateMany(
      { parentTask: parentTaskId },
      { isLatest: false }
    );

    const newVersion = Number(oldTask.version || 1) + 1;

    const newTaskVersion = new Task({
      ...validation.normalizedData,
      parentTask: parentTaskId,
      previousTask: oldTask._id,
      version: newVersion,
      followUpDate: new Date(),
      isLatest: true,
      actionType: getActionType(validation.normalizedData.status)
    });

    await newTaskVersion.save();

    const populatedTask = await Task.findById(newTaskVersion._id)
      .populate('responsible', 'name email role')
      .populate({
        path: 'project',
        populate: {
          path: 'client'
        }
      })
      .populate('previousTask', 'title status progress version followUpDate');

    const changes = [];

    if (safe(oldTask.title) !== safe(populatedTask.title)) {
      changes.push(`título de "${oldTask.title}" a "${populatedTask.title}"`);
    }

    if (safe(oldTask.description) !== safe(populatedTask.description)) {
      changes.push('descripción actualizada');
    }

    if (safe(oldTask.priority) !== safe(populatedTask.priority)) {
      changes.push(`prioridad de "${oldTask.priority}" a "${populatedTask.priority}"`);
    }

    if (safe(oldTask.status) !== safe(populatedTask.status)) {
      changes.push(`estado de "${oldTask.status}" a "${populatedTask.status}"`);
    }

    if (Number(oldTask.progress) !== Number(populatedTask.progress)) {
      changes.push(`progreso de ${oldTask.progress}% a ${populatedTask.progress}%`);
    }

    await createHistory({
      project: populatedTask.project?._id,
      client: populatedTask.project?.client?._id,
      task: populatedTask._id,
      user: getUserId(req),
      action: 'Seguimiento de tarea registrado',
      description: `Se registró seguimiento #${populatedTask.version} de la tarea "${populatedTask.title}": ${changes.length ? changes.join(', ') : 'sin cambios principales'}`,
      module: 'tasks',
      type: 'task_followup_created',
      oldValue: `${oldTask.status} - ${oldTask.progress}%`,
      newValue: `${populatedTask.status} - ${populatedTask.progress}%`
    });

    res.status(201).json({
      message: 'Seguimiento de tarea registrado correctamente',
      task: populatedTask
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al registrar seguimiento de tarea',
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Tarea no encontrada'
      });
    }

    const parentTaskId = task.parentTask || task._id;

    const deletedTasks = await Task.deleteMany({
      parentTask: parentTaskId
    });

    await createHistory({
      project: task.project,
      task: task._id,
      user: getUserId(req),
      action: 'Tarea eliminada',
      description: `Se eliminó la tarea "${task.title}" y todos sus seguimientos (${deletedTasks.deletedCount} registro/s)`,
      module: 'tasks',
      type: 'task_deleted',
      oldValue: task.title
    });

    res.json({
      message: `Tarea eliminada correctamente. Se eliminaron ${deletedTasks.deletedCount} seguimiento(s).`
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