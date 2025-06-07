import express from 'express';
import Project from '../models/Project.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'firstName lastName')
      .populate('assignedUsers.user', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('assignedUsers.user', 'firstName lastName');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { title, description, requiredSkills, deadline } = req.body;
    
    const project = new Project({
      title,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      deadline: deadline ? new Date(deadline) : null,
      createdBy: req.user._id
    });

    await project.save();
    await project.populate('createdBy', 'firstName lastName');
    
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/assign', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const existingAssignment = project.assignedUsers.find(
      assignment => assignment.user.toString() === userId
    );

    if (existingAssignment) {
      return res.status(400).json({ error: 'User already assigned to this project' });
    }

    project.assignedUsers.push({
      user: userId,
      assignedAt: new Date(),
      status: 'assigned'
    });

    await project.save();
    
    res.json({ message: 'User assigned to project successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isAssigned = project.assignedUsers.some(
      assignment => assignment.user.toString() === req.user._id.toString()
    );
    
    const isAuthorized = ['admin', 'manager'].includes(req.user.role) || isAssigned;
    
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }

    if (isAssigned && !['admin', 'manager'].includes(req.user.role)) {
      const assignment = project.assignedUsers.find(
        assignment => assignment.user.toString() === req.user._id.toString()
      );
      
      assignment.status = status;
      if (status === 'completed') {
        assignment.completedAt = new Date();
      }
    } else {
      project.status = status;
    }

    await project.save();
    
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/user/assigned', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({
      'assignedUsers.user': req.user._id
    }).populate('createdBy', 'firstName lastName');
    
    const assignedProjects = projects.map(project => {
      const assignment = project.assignedUsers.find(
        assignment => assignment.user.toString() === req.user._id.toString()
      );
      
      return {
        ...project.toObject(),
        assignment
      };
    });
    
    res.json(assignedProjects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    project.attachments.push({
      name: req.file.originalname,
      url: req.file.path,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    });

    await project.save();
    
    res.json({ message: 'File uploaded successfully', attachment: project.attachments[project.attachments.length - 1] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.deleteOne();
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;