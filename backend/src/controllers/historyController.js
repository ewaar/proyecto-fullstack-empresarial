const History = require('../models/History');
const Project = require('../models/Project');

const getHistories = async (req, res) => {
  try {
    const {
      projectId,
      clientId,
      module: historyModule,
      type
    } = req.query;

    let filter = {
      module: {
        $in: ['clients', 'projects', 'tasks', 'users', 'reports']
      },
      type: {
        $ne: 'manual_note'
      }
    };

    if (projectId) {
      filter.project = projectId;
    }

    if (clientId) {
      filter.client = clientId;
    }

    if (historyModule) {
      filter.module = historyModule;
    }

    if (type) {
      filter.type = type;
    }

    if (req.user.role === 'client') {
      const clientProjects = await Project.find({
        client: req.user.clientId
      }).select('_id');

      const projectIds = clientProjects.map((project) => project._id);

      filter.$or = [
        { project: { $in: projectIds } },
        { client: req.user.clientId }
      ];

      if (projectId) {
        const belongsToClient = projectIds.some(
          (id) => id.toString() === projectId.toString()
        );

        if (!belongsToClient) {
          return res.status(403).json({
            message: 'No tiene permiso para ver el historial de este proyecto'
          });
        }

        filter.project = projectId;
      }
    }

    const histories = await History.find(filter)
      .populate('project', 'name client')
      .populate('task', 'title status progress')
      .populate('client', 'name email company')
      .populate('affectedUser', 'name email role')
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.json(histories);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el historial',
      error: error.message
    });
  }
};

module.exports = {
  getHistories
};