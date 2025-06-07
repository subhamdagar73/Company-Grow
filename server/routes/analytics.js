import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Project from '../models/Project.js';
import Badge from '../models/Badge.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const enrolledCourses = await Course.countDocuments({
      'enrolledUsers.user': userId
    });
    
    const completedCourses = await Course.countDocuments({
      'enrolledUsers.user': userId,
      'enrolledUsers.completedAt': { $exists: true, $ne: null }
    });
    
    const assignedProjects = await Project.countDocuments({
      'assignedUsers.user': userId
    });
    
    const user = await User.findById(userId).select('badges totalPoints');
    const earnedBadges = user.badges.length;
    const totalPoints = user.totalPoints;
    
    res.json({
      totalEnrollments: enrolledCourses,
      completedCourses,
      assignedProjects,
      earnedBadges,
      totalPoints
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/admin', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalBadges = await Badge.countDocuments();
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyEnrollments = await Course.aggregate([
      { $unwind: '$enrolledUsers' },
      {
        $match: {
          'enrolledUsers.enrolledAt': { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$enrolledUsers.enrolledAt' },
            month: { $month: '$enrolledUsers.enrolledAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    const courseStats = await Course.aggregate([
      {
        $project: {
          title: 1,
          totalEnrollments: { $size: '$enrolledUsers' },
          completedEnrollments: {
            $size: {
              $filter: {
                input: '$enrolledUsers',
                cond: { $ne: ['$$this.completedAt', null] }
              }
            }
          }
        }
      },
      {
        $project: {
          title: 1,
          totalEnrollments: 1,
          completedEnrollments: 1,
          completionRate: {
            $cond: {
              if: { $eq: ['$totalEnrollments', 0] },
              then: 0,
              else: { $multiply: [{ $divide: ['$completedEnrollments', '$totalEnrollments'] }, 100] }
            }
          }
        }
      }
    ]);
    
    res.json({
      overview: {
        totalUsers,
        totalCourses,
        totalProjects,
        totalBadges
      },
      monthlyEnrollments,
      courseStats
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/progress/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (req.user._id.toString() !== userId && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const userCourses = await Course.find({
      'enrolledUsers.user': userId
    }).select('title enrolledUsers');
    
    const courseProgress = userCourses.map(course => {
      const enrollment = course.enrolledUsers.find(
        e => e.user.toString() === userId
      );
      return {
        courseTitle: course.title,
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt
      };
    });
    
    const userProjects = await Project.find({
      'assignedUsers.user': userId
    }).select('title assignedUsers');
    
    const projectProgress = userProjects.map(project => {
      const assignment = project.assignedUsers.find(
        a => a.user.toString() === userId
      );
      return {
        projectTitle: project.title,
        status: assignment.status,
        assignedAt: assignment.assignedAt,
        completedAt: assignment.completedAt
      };
    });
    
    res.json({
      courseProgress,
      projectProgress
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;