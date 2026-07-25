"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require('../models/User');
const Gym = require('../models/Gym');
const Payment = require('../models/Payment');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const OwnerSubscription = require('../models/OwnerSubscription');
// @desc    Get Super Admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (super_admin)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalGyms = await Gym.countDocuments();
        const activeOwners = await User.countDocuments({ role: 'gym_owner', status: 'active' });
        const pendingOwners = await User.countDocuments({ role: 'gym_owner', status: 'pending' });
        const totalMembers = await User.countDocuments({ role: 'member' });
        // Calculate today's registration count
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayGymOwnersJoin = await User.countDocuments({
            role: 'gym_owner',
            createdAt: { $gte: todayStart }
        });
        const todayMembersJoin = await User.countDocuments({
            role: 'member',
            createdAt: { $gte: todayStart }
        });
        // Platform revenue calculation based on OwnerSubscriptions
        const subscriptions = await OwnerSubscription.find().populate('planId');
        let platformRevenue = 0;
        subscriptions.forEach(sub => {
            if (sub.paymentStatus === 'paid' && sub.planId) {
                platformRevenue += sub.planId.price;
            }
        });
        // Mock/Aggregate city-wise gyms
        const cityWiseGyms = await Gym.aggregate([
            { $group: { _id: '$city', count: { $sum: 1 } } },
            { $project: { city: '$_id', count: 1, _id: 0 } }
        ]);
        // Monthly growth simulation/aggregation (last 6 months)
        const monthlyGrowth = [
            { month: 'Dec', gyms: 5, members: 120, revenue: 1500 },
            { month: 'Jan', gyms: 8, members: 180, revenue: 2400 },
            { month: 'Feb', gyms: 12, members: 250, revenue: 3600 },
            { month: 'Mar', gyms: 15, members: 320, revenue: 4500 },
            { month: 'Apr', gyms: 19, members: 410, revenue: 5700 },
            { month: 'May', gyms: totalGyms || 22, members: totalMembers || 500, revenue: platformRevenue || 6600 }
        ];
        res.json({
            success: true,
            stats: {
                totalGyms,
                activeOwners,
                pendingOwners,
                totalMembers,
                platformRevenue,
                todayGymOwnersJoin,
                todayMembersJoin
            },
            cityWiseGyms,
            monthlyGrowth
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get all gym owners
// @route   GET /api/admin/owners
// @access  Private (super_admin)
exports.getOwners = async (req, res, next) => {
    try {
        const owners = await User.find({ role: 'gym_owner' }).select('-password').sort({ createdAt: -1 });
        // Populate gym info for each owner
        const ownersWithGym = await Promise.all(owners.map(async (owner) => {
            const gym = await Gym.findOne({ ownerId: owner._id });
            const subscription = await OwnerSubscription.findOne({ ownerId: owner._id }).populate('planId');
            return {
                ...owner._doc,
                gym: gym || null,
                subscription: subscription || null
            };
        }));
        res.json({
            success: true,
            owners: ownersWithGym
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Approve a gym owner
// @route   PATCH /api/admin/owners/:id/approve
// @access  Private (super_admin)
exports.approveOwner = async (req, res, next) => {
    try {
        const owner = await User.findById(req.params.id);
        if (!owner || owner.role !== 'gym_owner') {
            res.status(404);
            throw new Error('Gym owner not found');
        }
        owner.status = 'active';
        await owner.save();
        // Assign a basic/pro platform subscription by default to start with
        const plan = await SubscriptionPlan.findOne({ isActive: true });
        if (plan) {
            await OwnerSubscription.create({
                ownerId: owner._id,
                planId: plan._id,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                status: 'active',
                paymentStatus: 'paid'
            });
        }
        res.json({
            success: true,
            message: 'Gym owner approved successfully',
            owner
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Reject a gym owner
// @route   PATCH /api/admin/owners/:id/reject
// @access  Private (super_admin)
exports.rejectOwner = async (req, res, next) => {
    try {
        const owner = await User.findById(req.params.id);
        if (!owner || owner.role !== 'gym_owner') {
            res.status(404);
            throw new Error('Gym owner not found');
        }
        owner.status = 'rejected';
        await owner.save();
        res.json({
            success: true,
            message: 'Gym owner registration rejected',
            owner
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Block a gym owner
// @route   PATCH /api/admin/owners/:id/block
// @access  Private (super_admin)
exports.blockOwner = async (req, res, next) => {
    try {
        const owner = await User.findById(req.params.id);
        if (!owner || owner.role !== 'gym_owner') {
            res.status(404);
            throw new Error('Gym owner not found');
        }
        owner.status = 'blocked';
        await owner.save();
        res.json({
            success: true,
            message: 'Gym owner blocked successfully',
            owner
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get all gyms
// @route   GET /api/admin/gyms
// @access  Private (super_admin)
exports.getGyms = async (req, res, next) => {
    try {
        const gyms = await Gym.find().populate({ path: 'ownerId', select: 'name email phone status' }).sort({ createdAt: -1 });
        res.json({
            success: true,
            gyms
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get all members across platform
// @route   GET /api/admin/members
// @access  Private (super_admin)
exports.getMembers = async (req, res, next) => {
    try {
        const members = await User.find({ role: 'member' })
            .populate({ path: 'gymId', select: 'name city' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            members
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private (super_admin)
exports.getPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find()
            .populate('memberId', 'name email phone')
            .populate('gymId', 'name')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            payments
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get all platform reports
// @route   GET /api/admin/reports
// @access  Private (super_admin)
exports.getReports = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const gyms = await Gym.countDocuments();
        const activeSubs = await OwnerSubscription.countDocuments({ status: 'active' });
        res.json({
            success: true,
            reports: {
                totalUsers,
                gyms,
                activeSubs,
                generationTime: new Date()
            }
        });
    }
    catch (error) {
        next(error);
    }
};
// CRUD for SubscriptionPlan
exports.getSubscriptionPlans = async (req, res, next) => {
    try {
        const plans = await SubscriptionPlan.find().sort({ price: 1 });
        res.json({ success: true, plans });
    }
    catch (error) {
        next(error);
    }
};
exports.createSubscriptionPlan = async (req, res, next) => {
    try {
        const plan = await SubscriptionPlan.create(req.body);
        res.status(201).json({ success: true, plan });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSubscriptionPlan = async (req, res, next) => {
    try {
        const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!plan) {
            res.status(404);
            throw new Error('Plan not found');
        }
        res.json({ success: true, plan });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSubscriptionPlan = async (req, res, next) => {
    try {
        const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
        if (!plan) {
            res.status(404);
            throw new Error('Plan not found');
        }
        res.json({ success: true, message: 'Plan deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
