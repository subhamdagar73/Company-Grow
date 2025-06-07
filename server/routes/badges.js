import express from 'express';
import Badge from '../models/Badge.js';
import User from '../models/User.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const badges = await Badge.find().sort({ points: -1 });
    res.json(badges);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, description, icon, points, criteria, color } = req.body;
    
    const badge = new Badge({
      name,
      description,
      icon,
      points,
      criteria,
      color
    });

    await badge.save();
    res.status(201).json(badge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/award', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { userId } = req.body;
    const badge = await Badge.findById(req.params.id);
    
    if (!badge) {
      return res.status(404).json({ error: 'Badge not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.badges.includes(badge._id)) {
      return res.status(400).json({ error: 'User already has this badge' });
    }

    user.badges.push(badge._id);
    user.totalPoints += badge.points;
    await user.save();

    res.json({ message: 'Badge awarded successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('badges')
      .select('badges totalPoints');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/my-badges', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('badges')
      .select('badges totalPoints');
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;