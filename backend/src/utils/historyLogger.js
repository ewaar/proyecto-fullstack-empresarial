const History = require('../models/History');

const createHistory = async ({
  project = null,
  task = null,
  client = null,
  affectedUser = null,
  user,
  action,
  description,
  module,
  type,
  oldValue = '',
  newValue = ''
}) => {
  try {
    if (!user || !action || !description || !module || !type) {
      console.log('HISTORIAL NO CREADO. Faltan datos:', {
        user,
        action,
        description,
        module,
        type
      });

      return null;
    }

    const history = await History.create({
      project,
      task,
      client,
      affectedUser,
      user,
      action,
      description,
      module,
      type,
      oldValue,
      newValue
    });

    console.log('HISTORIAL CREADO:', history.action);

    return history;
  } catch (error) {
    console.error('ERROR AL CREAR HISTORIAL:', error.message);
    return null;
  }
};

module.exports = {
  createHistory
};