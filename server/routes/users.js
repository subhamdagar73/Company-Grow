import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Project from '../models/Project.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all users
router.get('/', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
router.put('/:userId/role', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user role' });
  }
});

// Assign project to user
router.post('/assign-project', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    project.assignedUsers.push({ user: userId });
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'Failed to assign project' });
  }
});

// Manage user courses
router.post('/:userId/courses', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { courseId, action } = req.body; // action can be 'enroll' or 'unenroll'
        const user = await User.findById(req.params.userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ error: 'User or Course not found' });
        }

        if (action === 'enroll') {
            course.enrolledUsers.push({ user: user._id });
            await course.save();
        } else if (action === 'unenroll') {
            course.enrolledUsers = course.enrolledUsers.filter(
                (enrollment) => enrollment.user.toString() !== user._id.toString()
            );
            await course.save();
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        res.json({ message: `User ${action}ed successfully` });
    } catch (error) {
        res.status(400).json({ error: `Failed to ${action} user` });
    }
});


export default router;