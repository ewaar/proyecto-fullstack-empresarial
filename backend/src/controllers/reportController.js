const PDFDocument = require('pdfkit');
const Project = require('../models/Project');
const Task = require('../models/Task');
const GeneratedReport = require('../models/GeneratedReport');
const { createHistory } = require('../utils/historyLogger');

const MARGIN = 40;
const PRIMARY = '#0F4C97';
const PRIMARY_DARK = '#0B3970';
const LIGHT_BLUE = '#EAF2FB';
const BORDER = '#D8E1EC';
const TEXT = '#243447';
const MUTED = '#6B7C93';

const SUCCESS_BG = '#DDF3E4';
const SUCCESS_TEXT = '#1E7F42';
const WARNING_BG = '#FFF0CC';
const WARNING_TEXT = '#A56700';
const DANGER_BG = '#FDE1E1';
const DANGER_TEXT = '#C0392B';
const GRAY_BG = '#ECEFF3';
const GRAY_TEXT = '#5E6B78';
const BLUE_BG = '#DCEBFF';
const BLUE_TEXT = '#1E5FBF';

const getUserId = (req) => req.user?._id || req.user?.id || req.user?.userId;

const formatDate = (date) => {
  if (!date) return 'No definida';
  return new Date(date).toLocaleDateString('es-GT');
};

const safe = (value, fallback = 'No definido') => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

const truncate = (text, max = 32) => {
  const value = safe(text);
  return value.length > max ? value.substring(0, max) + '...' : value;
};

const getStatusColors = (status) => {
  const value = safe(status, '').toLowerCase();

  if (value.includes('complet')) return { bg: SUCCESS_BG, text: SUCCESS_TEXT };
  if (value.includes('progreso')) return { bg: BLUE_BG, text: BLUE_TEXT };
  if (value.includes('pend')) return { bg: GRAY_BG, text: GRAY_TEXT };

  return { bg: GRAY_BG, text: GRAY_TEXT };
};

const getPriorityColors = (priority) => {
  const value = safe(priority, '').toLowerCase();

  if (value.includes('alta')) return { bg: DANGER_BG, text: DANGER_TEXT };
  if (value.includes('media')) return { bg: WARNING_BG, text: WARNING_TEXT };
  if (value.includes('baja')) return { bg: SUCCESS_BG, text: SUCCESS_TEXT };

  return { bg: GRAY_BG, text: GRAY_TEXT };
};

const drawBadge = (doc, x, y, text, colors, width = 72) => {
  doc.roundedRect(x, y, width, 18, 8).fill(colors.bg);

  doc
    .fillColor(colors.text)
    .font('Helvetica-Bold')
    .fontSize(8)
    .text(safe(text), x, y + 5, {
      width,
      align: 'center'
    });
};

const drawProgressBar = (doc, x, y, progress, width = 72) => {
  const value = Math.max(0, Math.min(100, Number(progress) || 0));

  doc
    .fillColor(TEXT)
    .font('Helvetica-Bold')
    .fontSize(8)
    .text(`${value}%`, x - 32, y + 1, {
      width: 28,
      align: 'right'
    });

  doc.roundedRect(x, y + 3, width, 8, 4).fill('#D9DEE5');

  if (value > 0) {
    doc.roundedRect(x, y + 3, (width * value) / 100, 8, 4).fill('#1A73E8');
  }
};

const ensureSpace = (doc, needed) => {
  if (doc.y + needed > doc.page.height - 70) {
    doc.addPage();
    doc.y = 40;
  }
};

const drawHeader = (doc, user, title) => {
  const pageWidth = doc.page.width;
  const usableWidth = pageWidth - MARGIN * 2;

  doc.rect(MARGIN, 30, usableWidth, 105).fill('#FFFFFF');
  doc.rect(MARGIN + 10, 48, 48, 48).fill('#1B76D1');

  doc
    .fillColor('white')
    .font('Helvetica-Bold')
    .fontSize(25)
    .text('S', MARGIN + 10, 59, {
      width: 48,
      align: 'center'
    });

  doc
    .fillColor(PRIMARY_DARK)
    .font('Helvetica-Bold')
    .fontSize(12)
    .text('Soluciones Tecnológicas SA', MARGIN + 70, 53, {
      width: 170
    });

  doc
    .fillColor(MUTED)
    .font('Helvetica')
    .fontSize(8)
    .text('Desarrollamos el futuro, hoy.', MARGIN + 70, 70, {
      width: 170
    });

  doc
    .moveTo(MARGIN + 250, 48)
    .lineTo(MARGIN + 250, 100)
    .strokeColor(BORDER)
    .lineWidth(1)
    .stroke();

  doc
    .fillColor(PRIMARY_DARK)
    .font('Helvetica-Bold')
    .fontSize(22)
    .text(title, MARGIN + 270, 48, {
      width: usableWidth - 280
    });

  doc
    .fillColor(MUTED)
    .font('Helvetica')
    .fontSize(8)
    .text(`Generado por: ${safe(user?.name || user?.email, 'Usuario')}`, MARGIN + 270, 96, {
      width: 120
    });

  doc.text(`Rol: ${safe(user?.role)}`, MARGIN + 390, 96, { width: 70 });
  doc.text(`Fecha: ${formatDate(new Date())}`, MARGIN + 460, 96, { width: 90 });

  doc
    .moveTo(MARGIN, 142)
    .lineTo(pageWidth - MARGIN, 142)
    .strokeColor(PRIMARY)
    .lineWidth(1.5)
    .stroke();

  doc.y = 160;
};

const drawSectionBar = (doc, title) => {
  const usableWidth = doc.page.width - MARGIN * 2;

  ensureSpace(doc, 45);

  doc.roundedRect(MARGIN, doc.y, usableWidth, 28, 6).fill(PRIMARY);

  doc
    .fillColor('white')
    .font('Helvetica-Bold')
    .fontSize(11)
    .text(title, MARGIN + 12, doc.y + 8);

  doc.y += 28;
};

const drawProjectsSummary = (doc, projects) => {
  drawSectionBar(doc, 'RESUMEN DE PROYECTOS');

  const x = MARGIN;
  let y = doc.y;
  const cols = [145, 110, 85, 87, 88];
  const headers = ['Proyecto', 'Cliente', 'Estado', 'Inicio', 'Fin'];

  let currentX = x;

  headers.forEach((header, i) => {
    doc.rect(currentX, y, cols[i], 28).fillAndStroke(LIGHT_BLUE, BORDER);

    doc
      .fillColor(PRIMARY_DARK)
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(header, currentX + 6, y + 9, {
        width: cols[i] - 12,
        align: i >= 2 ? 'center' : 'left'
      });

    currentX += cols[i];
  });

  y += 28;

  projects.forEach((project, index) => {
    ensureSpace(doc, 35);

    const rowY = y;
    const rowColor = index % 2 === 0 ? '#FFFFFF' : '#F9FBFD';
    currentX = x;

    cols.forEach((col) => {
      doc.rect(currentX, rowY, col, 35).fillAndStroke(rowColor, BORDER);
      currentX += col;
    });

    doc
      .fillColor(TEXT)
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(truncate(project.name, 24), x + 6, rowY + 12, {
        width: cols[0] - 12
      });

    doc
      .fillColor(TEXT)
      .font('Helvetica')
      .fontSize(8)
      .text(truncate(project.client?.name, 22), x + cols[0] + 6, rowY + 12, {
        width: cols[1] - 12
      });

    drawBadge(
      doc,
      x + cols[0] + cols[1] + 9,
      rowY + 9,
      truncate(project.status, 12),
      getStatusColors(project.status),
      66
    );

    doc
      .fillColor(TEXT)
      .font('Helvetica')
      .fontSize(8)
      .text(formatDate(project.startDate), x + cols[0] + cols[1] + cols[2], rowY + 12, {
        width: cols[3],
        align: 'center'
      });

    doc.text(formatDate(project.endDate), x + cols[0] + cols[1] + cols[2] + cols[3], rowY + 12, {
      width: cols[4],
      align: 'center'
    });

    y += 35;
  });

  doc.y = y + 22;
};

const drawGeneralSummary = (doc, projects) => {
  ensureSpace(doc, 180);

  const x = MARGIN;
  const y = doc.y;
  const usableWidth = doc.page.width - MARGIN * 2;

  const totalProjects = projects.length;
  const totalTasks = projects.reduce((sum, project) => sum + project.tasks.length, 0);

  const completedTasks = projects.reduce((sum, project) => {
    return (
      sum +
      project.tasks.filter((task) =>
        safe(task.status, '').toLowerCase().includes('complet')
      ).length
    );
  }, 0);

  const averageProgress =
    totalTasks > 0
      ? Math.round(
          projects.reduce((sum, project) => {
            return (
              sum +
              project.tasks.reduce(
                (taskSum, task) => taskSum + (Number(task.progress) || 0),
                0
              )
            );
          }, 0) / totalTasks
        )
      : 0;

  doc.fillColor(PRIMARY_DARK).font('Helvetica-Bold').fontSize(15).text('Indicadores generales', x, y);

  const cardY = y + 30;
  const gap = 12;
  const cardWidth = (usableWidth - gap * 3) / 4;
  const cardHeight = 75;

  const cards = [
    { title: 'Proyectos', value: totalProjects, subtitle: 'registrados' },
    { title: 'Seguimientos', value: totalTasks, subtitle: 'registrados' },
    { title: 'Completadas', value: completedTasks, subtitle: 'finalizadas' },
    { title: 'Avance', value: `${averageProgress}%`, subtitle: 'promedio' }
  ];

  cards.forEach((card, index) => {
    const cardX = x + index * (cardWidth + gap);

    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 10).fillAndStroke('#FFFFFF', '#B8D0EE');
    doc.roundedRect(cardX, cardY, cardWidth, 10, 10).fill(PRIMARY);

    doc
      .fillColor(PRIMARY_DARK)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(card.title, cardX + 12, cardY + 18, {
        width: cardWidth - 24,
        align: 'center'
      });

    doc
      .fillColor('#1A73E8')
      .font('Helvetica-Bold')
      .fontSize(22)
      .text(String(card.value), cardX + 12, cardY + 36, {
        width: cardWidth - 24,
        align: 'center'
      });

    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(8)
      .text(card.subtitle, cardX + 12, cardY + 60, {
        width: cardWidth - 24,
        align: 'center'
      });
  });

  doc.y = cardY + cardHeight + 35;
};

const drawProjectDetail = (doc, project, tasks) => {
  ensureSpace(doc, 170);

  const x = MARGIN;
  const y = doc.y;
  const usableWidth = doc.page.width - MARGIN * 2;

  const latestTasks = tasks.filter((task) => task.isLatest);
  const latestCompletedTask =
  latestTasks.length > 0
    ? latestTasks[latestTasks.length - 1]
    : null;

const averageProgress = latestCompletedTask
  ? Number(latestCompletedTask.progress || 0)
  : 0;

  doc.roundedRect(x, y, usableWidth, 150, 8).fillAndStroke('#FFFFFF', '#B8D0EE');
  doc.roundedRect(x, y, usableWidth, 42, 8).fill('#EEF5FD');

  doc
    .fillColor(PRIMARY_DARK)
    .font('Helvetica-Bold')
    .fontSize(13)
    .text(`Detalle del proyecto: ${safe(project.name)}`, x + 15, y + 14, {
      width: usableWidth - 30
    });

  const leftX = x + 18;
  const rightX = x + 265;
  let infoY = y + 60;

  doc.fontSize(8);

  doc.fillColor(PRIMARY_DARK).font('Helvetica-Bold').text('Cliente:', leftX, infoY);
  doc.fillColor(TEXT).font('Helvetica').text(safe(project.client?.name), leftX + 75, infoY, { width: 150 });

  doc.fillColor(PRIMARY_DARK).font('Helvetica-Bold').text('Estado:', rightX, infoY);
  drawBadge(doc, rightX + 80, infoY - 4, safe(project.status), getStatusColors(project.status), 72);

  infoY += 25;

  doc.fillColor(PRIMARY_DARK).font('Helvetica-Bold').text('Fecha inicio:', leftX, infoY);
  doc.fillColor(TEXT).font('Helvetica').text(formatDate(project.startDate), leftX + 75, infoY);

  doc.fillColor(PRIMARY_DARK).font('Helvetica-Bold').text('Fecha fin:', rightX, infoY);
  doc.fillColor(TEXT).font('Helvetica').text(formatDate(project.endDate), rightX + 80, infoY);

  infoY += 25;

  doc.fillColor(PRIMARY_DARK).font('Helvetica-Bold').text('Progreso:', leftX, infoY);
  doc.fillColor(TEXT).font('Helvetica').text(`${averageProgress}%`, leftX + 75, infoY);

  doc.fillColor(PRIMARY_DARK).font('Helvetica-Bold').text('Seguimientos:', rightX, infoY);
  doc.fillColor(TEXT).font('Helvetica').text(`${tasks.length} registro(s)`, rightX + 80, infoY);

  doc.y = y + 170;
};

const groupTasksByParent = (tasks) => {
  const groups = {};

  tasks.forEach((task) => {
    const parentId = task.parentTask?._id?.toString() || task.parentTask?.toString() || task._id.toString();

    if (!groups[parentId]) {
      groups[parentId] = [];
    }

    groups[parentId].push(task);
  });

  return Object.values(groups).map((group) =>
    group.sort((a, b) => Number(a.version || 1) - Number(b.version || 1))
  );
};

const drawTasksTable = (doc, tasks) => {
  drawSectionBar(doc, 'SEGUIMIENTO COMPLETO DE TAREAS');

  if (!tasks || tasks.length === 0) {
    const x = MARGIN;
    const usableWidth = doc.page.width - MARGIN * 2;
    doc.rect(x, doc.y, usableWidth, 35).fillAndStroke('#FFFFFF', BORDER);
    doc.fillColor(TEXT).font('Helvetica').fontSize(8).text('Este proyecto no tiene tareas registradas.', x + 8, doc.y + 12);
    doc.y += 55;
    return;
  }

  const groupedTasks = groupTasksByParent(tasks);

  groupedTasks.forEach((group, groupIndex) => {
    const mainTitle = group[0]?.title || 'Tarea sin título';

    ensureSpace(doc, 50);

    doc
      .fillColor(PRIMARY_DARK)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(`Tarea ${groupIndex + 1}: ${mainTitle}`, MARGIN, doc.y + 10);

    doc.y += 30;

    const x = MARGIN;
    let y = doc.y;
    const cols = [45, 70, 135, 70, 70, 55, 70];
    const headers = ['Ver.', 'Fecha', 'Seguimiento', 'Resp.', 'Estado', 'Avance', 'Prioridad'];

    let currentX = x;

    headers.forEach((header, i) => {
      doc.rect(currentX, y, cols[i], 26).fillAndStroke(LIGHT_BLUE, BORDER);

      doc
        .fillColor(PRIMARY_DARK)
        .font('Helvetica-Bold')
        .fontSize(7)
        .text(header, currentX + 4, y + 9, {
          width: cols[i] - 8,
          align: i === 2 ? 'left' : 'center'
        });

      currentX += cols[i];
    });

    y += 26;

    group.forEach((task, index) => {
      if (y + 42 > doc.page.height - 70) {
        doc.addPage();
        doc.y = 40;
        y = doc.y;
      }

      const rowColor = index % 2 === 0 ? '#FFFFFF' : '#F9FBFD';
      currentX = x;

      cols.forEach((col) => {
        doc.rect(currentX, y, col, 42).fillAndStroke(rowColor, BORDER);
        currentX += col;
      });

      doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(7).text(`#${task.version || 1}`, x + 4, y + 14, {
        width: cols[0] - 8,
        align: 'center'
      });

      doc.fillColor(TEXT).font('Helvetica').fontSize(7).text(formatDate(task.followUpDate || task.createdAt), x + cols[0] + 4, y + 14, {
        width: cols[1] - 8,
        align: 'center'
      });

      doc.fillColor(TEXT).font('Helvetica').fontSize(7).text(truncate(task.description, 55), x + cols[0] + cols[1] + 4, y + 9, {
        width: cols[2] - 8,
        height: 28
      });

      doc.fillColor(TEXT).font('Helvetica').fontSize(7).text(truncate(task.responsible?.name, 12), x + cols[0] + cols[1] + cols[2] + 4, y + 14, {
        width: cols[3] - 8,
        align: 'center'
      });

      drawBadge(
        doc,
        x + cols[0] + cols[1] + cols[2] + cols[3] + 6,
        y + 12,
        safe(task.status),
        getStatusColors(task.status),
        58
      );

      doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(8).text(`${task.progress}%`, x + cols[0] + cols[1] + cols[2] + cols[3] + cols[4] + 4, y + 15, {
        width: cols[5] - 8,
        align: 'center'
      });

      drawBadge(
        doc,
        x + cols[0] + cols[1] + cols[2] + cols[3] + cols[4] + cols[5] + 7,
        y + 12,
        safe(task.priority),
        getPriorityColors(task.priority),
        56
      );

      y += 42;
    });

    doc.y = y + 18;
  });
};

const drawFooterOnAllPages = (doc) => {
  const range = doc.bufferedPageRange();

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);

    const footerLineY = doc.page.height - 85;
    const footerTextY = doc.page.height - 72;

    doc.save();

    doc
      .moveTo(MARGIN, footerLineY)
      .lineTo(doc.page.width - MARGIN, footerLineY)
      .strokeColor(PRIMARY)
      .lineWidth(1)
      .stroke();

    doc.circle(doc.page.width / 2, footerLineY, 2.5).fill(PRIMARY);

    doc
      .fillColor(PRIMARY_DARK)
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(`Página ${i - range.start + 1}`, MARGIN, footerTextY, {
        width: doc.page.width - MARGIN * 2,
        align: 'center',
        lineBreak: false
      });

    doc.restore();
  }
};

const buildProjectsPDFBuffer = async (req, projectsWithTasks, projectId) => {
  return new Promise((resolve, reject) => {
    try {
      const chunks = [];

      const doc = new PDFDocument({
        size: 'A4',
        margin: MARGIN,
        bufferPages: true
      });

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      if (projectId) {
        drawHeader(doc, req.user, 'INFORME DEL PROYECTO');
        drawProjectsSummary(doc, [projectsWithTasks[0]]);
        drawProjectDetail(doc, projectsWithTasks[0], projectsWithTasks[0].tasks);
        drawTasksTable(doc, projectsWithTasks[0].tasks);
      } else {
        drawHeader(doc, req.user, 'INFORME GENERAL DE PROYECTOS');
        drawProjectsSummary(doc, projectsWithTasks);
        drawGeneralSummary(doc, projectsWithTasks);

        projectsWithTasks.forEach((project) => {
          doc.addPage();
          doc.y = 40;

          drawHeader(doc, req.user, 'DETALLE DE PROYECTO');
          drawProjectsSummary(doc, [project]);
          drawProjectDetail(doc, project, project.tasks);
          drawTasksTable(doc, project.tasks);
        });
      }

      drawFooterOnAllPages(doc);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const generateProjectsPDF = async (req, res) => {
  try {
    const { projectId } = req.query;

    const projectFilter = {};

    if (req.user.role === 'client') {
      projectFilter.client = req.user.clientId;
    }

    if (projectId) {
      projectFilter._id = projectId;
    }

    const projects = await Project.find(projectFilter).populate('client').sort({ createdAt: -1 });

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron proyectos para generar el reporte'
      });
    }

    const projectsWithTasks = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id })
          .populate('responsible', 'name email role')
          .populate('parentTask', 'title')
          .populate('previousTask', 'title status progress version followUpDate')
          .sort({ parentTask: 1, version: 1, followUpDate: 1 });

        return {
          ...project.toObject(),
          tasks
        };
      })
    );

    const pdfBuffer = await buildProjectsPDFBuffer(req, projectsWithTasks, projectId);

    const isProjectReport = Boolean(projectId);
    const selectedProject = isProjectReport ? projectsWithTasks[0] : null;

    const reportTitle = isProjectReport
      ? `Informe del proyecto ${selectedProject.name}`
      : 'Informe general de proyectos';

    const fileName = isProjectReport
      ? `reporte_proyecto_${selectedProject._id}_${Date.now()}.pdf`
      : `reporte_general_proyectos_${Date.now()}.pdf`;

    const savedReport = await GeneratedReport.create({
      title: reportTitle,
      type: isProjectReport ? 'project' : 'general',
      fileName,
      contentType: 'application/pdf',
      pdf: pdfBuffer,
      size: pdfBuffer.length,
      project: selectedProject?._id || null,
      client: selectedProject?.client?._id || null,
      user: getUserId(req)
    });

    await createHistory({
      project: selectedProject?._id || null,
      client: selectedProject?.client?._id || null,
      user: getUserId(req),
      action: 'Informe generado',
      description: isProjectReport
        ? `Se generó un informe PDF del proyecto "${selectedProject.name}" con el seguimiento completo de tareas`
        : 'Se generó un informe PDF general de proyectos con seguimiento completo de tareas',
      module: 'reports',
      type: 'report_generated',
      newValue: reportTitle
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('X-Report-Id', savedReport._id.toString());

    return res.end(pdfBuffer);
  } catch (error) {
    console.error('ERROR AL GENERAR PDF:', error);

    res.status(500).json({
      message: 'Error al generar el PDF',
      error: error.message
    });
  }
};

const getGeneratedReports = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'client') {
      filter.$or = [{ user: getUserId(req) }, { client: req.user.clientId }];
    }

    const reports = await GeneratedReport.find(filter)
      .select('-pdf')
      .populate('project', 'name status')
      .populate('client', 'name company email')
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener informes generados',
      error: error.message
    });
  }
};

const downloadGeneratedReport = async (req, res) => {
  try {
    const report = await GeneratedReport.findById(req.params.id)
      .populate('project', 'name')
      .populate('client', 'name company')
      .populate('user', 'name email role');

    if (!report) {
      return res.status(404).json({
        message: 'Informe no encontrado'
      });
    }

    if (req.user.role === 'client') {
      const sameUser = report.user?._id?.toString() === getUserId(req)?.toString();
      const sameClient = report.client?._id?.toString() === req.user.clientId?.toString();

      if (!sameUser && !sameClient) {
        return res.status(403).json({
          message: 'No tiene permiso para descargar este informe'
        });
      }
    }

    res.setHeader('Content-Type', report.contentType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${report.fileName}`);
    res.setHeader('Content-Length', report.pdf.length);

    return res.end(report.pdf);
  } catch (error) {
    res.status(500).json({
      message: 'Error al descargar informe',
      error: error.message
    });
  }
};

module.exports = {
  generateProjectsPDF,
  getGeneratedReports,
  downloadGeneratedReport
};