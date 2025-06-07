import express from 'express';
import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Badge from '../models/Badge.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { amount, badgeIds, description } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(),
        type: 'badge_bonus',
        badgeIds: JSON.stringify(badgeIds)
      }
    });

    const payment = new Payment({
      user: req.user._id,
      stripePaymentId: paymentIntent.id,
      amount,
      type: 'badge_bonus',
      badges: badgeIds,
      description,
      status: 'pending'
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const payment = await Payment.findOne({ stripePaymentId: paymentIntentId });
      if (payment) {
        payment.status = 'completed';
        await payment.save();
      }

      res.json({ message: 'Payment confirmed successfully' });
    } else {
      res.status(400).json({ error: 'Payment not successful' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/history', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('badges')
      .sort({ createdAt: -1 });
    
    res.json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/calculate-bonus', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('badges');
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const recentPayments = await Payment.find({
      user: req.user._id,
      createdAt: { $gte: thisMonth },
      status: 'completed'
    });

    const paidBadgeIds = recentPayments.flatMap(payment => payment.badges);
    const unpaidBadges = user.badges.filter(badge => !paidBadgeIds.includes(badge._id));
    
    const totalBonus = unpaidBadges.reduce((sum, badge) => sum + (badge.points * 0.1), 0);
    
    res.json({
      unpaidBadges,
      totalBonus: Math.round(totalBonus * 100) / 100,
      totalPoints: unpaidBadges.reduce((sum, badge) => sum + badge.points, 0)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;