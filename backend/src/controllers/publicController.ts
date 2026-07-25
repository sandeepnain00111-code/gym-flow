const Gym = require('../models/Gym');
const GymPlan = require('../models/GymPlan');
const DemoBooking = require('../models/DemoBooking');

// @desc    Get all active gyms on the platform
// @route   GET /api/public/gyms
// @access  Public
exports.getPublicGyms = async (req, res, next) => {
  try {
    const gyms = await Gym.find({ isActive: true }).select('name slug logo coverImage city state facilities description');
    res.json({
      success: true,
      gyms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get details of a single gym by slug
// @route   GET /api/public/gym/:slug
// @access  Public
exports.getPublicGymBySlug = async (req, res, next) => {
  try {
    const gym = await Gym.findOne({ slug: req.params.slug, isActive: true });
    if (!gym) {
      res.status(404);
      throw new Error('Gym not found or has been deactivated');
    }

    const plans = await GymPlan.find({ gymId: gym._id, isActive: true });

    res.json({
      success: true,
      gym,
      plans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public plans list of a single gym by slug
// @route   GET /api/public/gym/:slug/plans
// @access  Public
exports.getPublicPlans = async (req, res, next) => {
  try {
    const gym = await Gym.findOne({ slug: req.params.slug, isActive: true });
    if (!gym) {
      res.status(404);
      throw new Error('Gym not found');
    }

    const plans = await GymPlan.find({ gymId: gym._id, isActive: true });
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a free demo class trial booking
// @route   POST /api/public/gym/:slug/demo-booking
// @access  Public
exports.createPublicDemoBooking = async (req, res, next) => {
  try {
    const { name, email, phone, date, timeSlot, notes } = req.body;
    const gym = await Gym.findOne({ slug: req.params.slug, isActive: true });

    if (!gym) {
      res.status(404);
      throw new Error('Gym not found');
    }

    const demo = await DemoBooking.create({
      gymId: gym._id,
      name,
      email,
      phone,
      date: new Date(date),
      timeSlot,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Demo booking requested! The gym team will reach out to you shortly to confirm your slot.',
      demo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit public contact form inquiry
// @route   POST /api/public/contact
// @access  Public
exports.submitContactForm = async (req, res, next) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    if (!firstName || !email || !message) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const { sendEmail } = require('../utils/email');
    await sendEmail({
      to: process.env.EMAIL_USER || 'hello@gymflow.com',
      subject: `⚡ New Lead: Inquiry from ${firstName} ${lastName || ''}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%); padding: 32px 28px; text-align: left; }
            .header-badge { display: inline-block; background: rgba(255, 255, 255, 0.18); color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 12px; border-radius: 50px; margin-bottom: 12px; backdrop-filter: blur(4px); }
            .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
            .body { padding: 28px; }
            .info-grid { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px; }
            .info-row { display: flex; margin-bottom: 10px; font-size: 14px; }
            .info-row:last-child { margin-bottom: 0; }
            .info-label { font-weight: 700; color: #64748b; width: 110px; flex-shrink: 0; }
            .info-value { font-weight: 600; color: #0f172a; }
            .info-value a { color: #059669; text-decoration: none; font-weight: 700; }
            .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 10px; }
            .message-box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; border-radius: 0 14px 14px 0; font-size: 15px; line-height: 1.6; color: #064e3b; font-weight: 500; margin-bottom: 28px; white-space: pre-wrap; }
            .action-btn { display: inline-block; background: #047857; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 12px; text-decoration: none; text-align: center; box-shadow: 0 4px 12px rgba(4, 120, 87, 0.25); }
            .footer { background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 28px; text-align: center; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="header-badge">GymFlow Support Center</div>
              <h1>📩 New Contact Inquiry Received</h1>
            </div>
            <div class="body">
              <div class="info-grid">
                <div class="info-row">
                  <div class="info-label">Sender Name</div>
                  <div class="info-value">${firstName} ${lastName || ''}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Email Address</div>
                  <div class="info-value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Received Date</div>
                  <div class="info-value">${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                </div>
              </div>

              <div class="section-title">Message Details</div>
              <div class="message-box">${message}</div>

              <div style="text-align: center;">
                <a href="mailto:${email}?subject=Re: GymFlow Inquiry" class="action-btn">Reply To Sender Direct</a>
              </div>
            </div>
            <div class="footer">
              Sent automatically from GymFlow Platform • Confidential Support System
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Inquiry from ${firstName} ${lastName || ''} (${email}):\n\n${message}`
    });

    // Also send an automated luxury confirmation email to the sender/visitor
    await sendEmail({
      to: email,
      subject: `✨ We received your message, ${firstName}! - GymFlow Support`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%); padding: 36px 28px; text-align: center; }
            .header-badge { display: inline-block; background: rgba(255, 255, 255, 0.2); color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 14px; border-radius: 50px; margin-bottom: 12px; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
            .body { padding: 32px 28px; text-align: left; }
            .greeting { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
            .text { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
            .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 28px; }
            .summary-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; }
            .summary-text { font-size: 14px; color: #334155; font-style: italic; margin: 0; }
            .cta-wrapper { text-align: center; margin-bottom: 12px; }
            .cta-btn { display: inline-block; background: linear-gradient(135deg, #047857, #10b981); color: #ffffff !important; font-weight: 800; font-size: 14px; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3); }
            .footer { background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 28px; text-align: center; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="header-badge">GymFlow SaaS Support</div>
              <h1>Thank You For Reaching Out!</h1>
            </div>
            <div class="body">
              <div class="greeting">Hi ${firstName},</div>
              <div class="text">
                We have successfully received your message! Our dedicated technical support and onboarding engineering team is currently reviewing your inquiry. We aim to respond within 24 hours.
              </div>

              <div class="summary-title">Copy of Your Inquiry</div>
              <div class="summary-card">
                <p class="summary-text">"${message}"</p>
              </div>

              <div class="cta-wrapper">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" class="cta-btn">Visit GymFlow Platform</a>
              </div>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} GymFlow SaaS. All rights reserved. • High Performance Gym Management Platform
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hi ${firstName},\n\nWe received your inquiry: "${message}". Our team will get back to you shortly.\n\nBest regards,\nGymFlow Team`
    });

    res.json({
      success: true,
      message: 'Thank you for contacting us! Your message has been sent successfully.'
    });
  } catch (error) {
    next(error);
  }
};

