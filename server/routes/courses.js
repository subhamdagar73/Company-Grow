import express from 'express';
import Course from '../models/Course.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('enrolledUsers.user', 'firstName lastName');
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { title, description, durationHours, difficultyLevel } = req.body;
    
    const courseData = {
      title,
      description,
      durationHours: durationHours,
      difficultyLevel: difficultyLevel,
      createdBy: req.user._id
    };

    const course = new Course(courseData);
    await course.save();
    
    await course.populate('createdBy', 'firstName lastName');
    
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/enroll', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existingEnrollment = course.enrolledUsers.find(
      enrollment => enrollment.user.toString() === req.user._id.toString()
    );

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    course.enrolledUsers.push({
      user: req.user._id,
      enrolledAt: new Date(),
      progress: 0
    });

    await course.save();
    
    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { progress } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const enrollment = course.enrolledUsers.find(
      enrollment => enrollment.user.toString() === req.user._id.toString()
    );

    if (!enrollment) {
      return res.status(400).json({ error: 'Not enrolled in this course' });
    }

    enrollment.progress = Math.min(100, Math.max(0, progress));
    
    if (enrollment.progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }

    await course.save();
    
    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/user/enrolled', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find({
      'enrolledUsers.user': req.user._id
    }).populate('createdBy', 'firstName lastName');
    
    const enrolledCourses = courses.map(course => {
      const enrollment = course.enrolledUsers.find(
        enrollment => enrollment.user.toString() === req.user._id.toString()
      );
      
      return {
        ...course.toObject(),
        enrollment
      };
    });
    
    res.json(enrolledCourses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;