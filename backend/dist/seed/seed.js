"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Gym = require('../models/Gym');
const GymPlan = require('../models/GymPlan');
const Membership = require('../models/Membership');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const Announcement = require('../models/Announcement');
const ChatRoom = require('../models/ChatRoom');
const ChatMessage = require('../models/ChatMessage');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const OwnerSubscription = require('../models/OwnerSubscription');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gymflow');
        console.log('MongoDB Connected for seeding...');
    }
    catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};
const seedData = async (shouldConnect = true) => {
    try {
        if (shouldConnect) {
            await connectDB();
        }
        // Clear existing database collections
        console.log('Clearing database collections...');
        await User.deleteMany({});
        await Gym.deleteMany({});
        await GymPlan.deleteMany({});
        await Membership.deleteMany({});
        await Payment.deleteMany({});
        await Attendance.deleteMany({});
        await Announcement.deleteMany({});
        await ChatRoom.deleteMany({});
        await ChatMessage.deleteMany({});
        await SubscriptionPlan.deleteMany({});
        await OwnerSubscription.deleteMany({});
        console.log('Creating system subscription plans...');
        const liteSubPlan = await SubscriptionPlan.create({
            name: 'Lite SaaS Starter',
            price: 2500,
            durationInDays: 30,
            maxMembers: 50,
            maxTrainers: 2,
            description: 'Perfect for small local boutique gyms and trainers.',
            isActive: true
        });
        const proSubPlan = await SubscriptionPlan.create({
            name: 'Pro SaaS Enterprise',
            price: 4999,
            durationInDays: 30,
            maxMembers: 500,
            maxTrainers: 10,
            description: 'Ideal for multi-floor powerhouses and high traffic gyms.',
            isActive: true
        });
        console.log('Creating users...');
        // 1. Super Admin
        const superAdmin = await User.create({
            name: 'Super Admin',
            email: 'admin@gymflow.com',
            phone: '9999999999',
            password: 'Admin@123',
            role: 'super_admin',
            status: 'active'
        });
        // 2. Gym Owner (Approved)
        const approvedOwner = await User.create({
            name: 'Rohan Sharma',
            email: 'owner@gymflow.com',
            phone: '8888888888',
            password: 'Owner@123',
            role: 'gym_owner',
            status: 'active'
        });
        // 3. Gym Owner (Pending Approval)
        const pendingOwner = await User.create({
            name: 'Amit Patel',
            email: 'owner2@gymflow.com',
            phone: '7777777777',
            password: 'Owner@123',
            role: 'gym_owner',
            status: 'pending'
        });
        // Create Platform subscription for Rohan
        await OwnerSubscription.create({
            ownerId: approvedOwner._id,
            planId: proSubPlan._id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'active',
            paymentStatus: 'paid'
        });
        console.log('Creating gym...');
        // Create Gym for Rohan Sharma
        const gym = await Gym.create({
            ownerId: approvedOwner._id,
            name: 'Iron Forge Fitness',
            slug: 'iron-forge',
            logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200&auto=format&fit=crop',
            coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
            description: 'Unleash your inner strength with premium equipment and professional personal trainers.',
            address: 'Plot 45, Huda Heights, Jubilee Hills',
            city: 'Hyderabad',
            state: 'Telangana',
            phone: '0402324567',
            email: 'ironforge@gmail.com',
            openingTime: '05:00 AM',
            closingTime: '11:00 PM',
            facilities: ['Air Conditioning', 'Free Parking', 'Steam Shower Bath', 'Personal Lockers', 'Premium Supplement Store'],
            socialLinks: {
                facebook: 'https://facebook.com/ironforge',
                instagram: 'https://instagram.com/ironforge',
                twitter: '',
                website: 'https://ironforge.gym'
            },
            qrCodeUrl: `http://localhost:3000/gym/iron-forge`,
            isActive: true
        });
        // Update Owner user model with Gym ID
        approvedOwner.gymId = gym._id;
        await approvedOwner.save();
        console.log('Creating gym membership plans...');
        const monthlyPlan = await GymPlan.create({
            gymId: gym._id,
            name: 'Gold Monthly Split',
            description: 'Full facility access and 1 complimentary trainer assessment.',
            durationInDays: 30,
            price: 1500,
            isActive: true
        });
        const quarterlyPlan = await GymPlan.create({
            gymId: gym._id,
            name: 'Platinum Quarterly Shred',
            description: 'Unlimited workout access + diet guidance sheet.',
            durationInDays: 90,
            price: 4000,
            isActive: true
        });
        const yearlyPlan = await GymPlan.create({
            gymId: gym._id,
            name: 'Iron Forge Yearly Beast',
            description: 'Saves 35%, includes steam shower access & premium trainer support.',
            durationInDays: 365,
            price: 12000,
            isActive: true
        });
        console.log('Creating trainers...');
        // Create a Trainer
        const trainerUser = await User.create({
            name: 'Coach Vikram Singh',
            email: 'trainer@gymflow.com',
            phone: '6666666666',
            password: 'Trainer@123',
            role: 'trainer',
            gymId: gym._id,
            status: 'active'
        });
        console.log('Creating gym members...');
        // 1. Approved Active Member
        const activeMember = await User.create({
            name: 'Rahul Roy',
            email: 'member@gymflow.com',
            phone: '9876543210',
            password: 'Member@123',
            role: 'member',
            gymId: gym._id,
            status: 'active'
        });
        // Create Active Membership for Rahul
        const startDate = new Date();
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const activeMembership = await Membership.create({
            gymId: gym._id,
            memberId: activeMember._id,
            planId: monthlyPlan._id,
            startDate,
            endDate,
            status: 'active',
            paymentStatus: 'paid',
            amount: monthlyPlan.price,
            approvedBy: approvedOwner._id,
            approvedAt: new Date()
        });
        // Create Payment log for Rahul
        await Payment.create({
            gymId: gym._id,
            memberId: activeMember._id,
            ownerId: approvedOwner._id,
            membershipId: activeMembership._id,
            amount: monthlyPlan.price,
            mode: 'upi',
            status: 'approved',
            transactionId: 'TXN89123457193',
            paidAt: new Date()
        });
        // 2. Pending Member (Needs payment/join approval)
        const pendingMember = await User.create({
            name: 'Priya Sharma',
            email: 'member2@gymflow.com',
            phone: '9123456789',
            password: 'Member@123',
            role: 'member',
            gymId: gym._id,
            status: 'active'
        });
        const pendingMembership = await Membership.create({
            gymId: gym._id,
            memberId: pendingMember._id,
            planId: quarterlyPlan._id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            status: 'pending',
            paymentStatus: 'pending',
            amount: quarterlyPlan.price
        });
        await Payment.create({
            gymId: gym._id,
            memberId: pendingMember._id,
            ownerId: approvedOwner._id,
            membershipId: pendingMembership._id,
            amount: quarterlyPlan.price,
            mode: 'upi',
            status: 'pending',
            transactionId: 'TXN7716615523',
            screenshot: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop'
        });
        console.log('Creating attendance logs...');
        // Create attendance logs for Rahul
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        await Attendance.create({
            gymId: gym._id,
            memberId: activeMember._id,
            date: yesterdayStr,
            checkIn: new Date(yesterday.setHours(7, 30)),
            checkOut: new Date(yesterday.setHours(9, 0)),
            method: 'qr',
            status: 'present'
        });
        const todayStr = new Date().toISOString().split('T')[0];
        await Attendance.create({
            gymId: gym._id,
            memberId: activeMember._id,
            date: todayStr,
            checkIn: new Date(new Date().setHours(8, 0)),
            method: 'qr',
            status: 'present'
        });
        console.log('Creating announcements...');
        await Announcement.create({
            gymId: gym._id,
            title: 'Powerlifting Meet this Sunday! 🏋️',
            content: 'Gear up! Iron Forge is organizing a intra-gym powerlifting championship this Sunday at 10 AM. Winners get gym merch and premium protein isolate tubs!',
            targetRole: 'all',
            createdBy: approvedOwner._id
        });
        await Announcement.create({
            gymId: gym._id,
            title: 'New Steam Bath Timings',
            content: 'Please note the steam sauna session is now operational from 6 AM - 11 AM in the morning and 6 PM - 9 PM in the evenings.',
            targetRole: 'member',
            createdBy: approvedOwner._id
        });
        console.log('Creating chat room and initial messages...');
        const chatRoom = await ChatRoom.create({
            gymId: gym._id,
            name: 'General Discussion',
            type: 'group',
            members: [approvedOwner._id, trainerUser._id, activeMember._id]
        });
        await ChatMessage.create({
            roomId: chatRoom._id,
            senderId: approvedOwner._id,
            message: 'Welcome everyone to the official Iron Forge GymFlow chat! 💪 Ask queries, post workouts, and support each other.'
        });
        await ChatMessage.create({
            roomId: chatRoom._id,
            senderId: trainerUser._id,
            message: 'Excited to train with everyone here! Let me know if anyone needs workout split reviews.'
        });
        await ChatMessage.create({
            roomId: chatRoom._id,
            senderId: activeMember._id,
            message: 'Great app UI! Thanks for organizing the powerlifting meet, Rohan sir!'
        });
        console.log('Database seeded successfully! 🎉');
        if (shouldConnect) {
            process.exit(0);
        }
    }
    catch (error) {
        console.error('Seeding failed:', error);
        if (shouldConnect) {
            process.exit(1);
        }
    }
};
if (require.main === module) {
    seedData(true);
}
module.exports = seedData;
