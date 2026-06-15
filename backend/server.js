const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library'); // FIXED: Loaded Google OAuth Engine
require('dotenv').config();

const User = require('./models/User');

const app = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- MIDDLAWARES ---
app.use(cors()); // Blocks Cross-Origin errors between React (port 3000) and Server (port 5000)
app.use(express.json()); // Parses incoming JSON request bodies

// --- DATABASE HANDSHAKE ---
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('📡 Connected to MongoDB Atlas Cloud Database successfully.'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// --- API AUTHENTICATION ENDPOINTS ---

// 1. SIGN UP (REGISTER NODE)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      password, 
      role, 
      domain, 
      commitment, 
      experience, 
      learningStyle 
    } = req.body;

    // Check if email already exists in system database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Identity Node already active with this email address.' 
      });
    }

    // Secure Password Hashing (Blowfish Cryptography)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save and register User metadata profile to MongoDB cluster
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'Student',
      domain: domain || 'Programming',
      commitment: commitment || '1 Hour',
      experience: experience || 'Beginner',
      learningStyle: learningStyle || 'Videos'
    });

    await newUser.save();

    res.status(201).json({ 
      success: true, 
      message: 'Workspace credentials initialized! User Node compiled successfully.' 
    });

  } catch (error) {
    console.error('Registration process crashed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Symmetric internal system compile error during registration.' 
    });
  }
});

// 2. SIGN IN (LOGIN NODE)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search user matching verified email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address or unauthorized credentials setup.' 
      });
    }

    // Protection for Google-Only registered profiles attempting standard login without password
    if (!user.password && user.googleId) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please click the Google button to access.'
      });
    }

    // Decrypt and compare target input password with MongoDB hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address or unauthorized credentials setup.' 
      });
    }

    // Sign Secure JWT Authentication Token (Valid for 24 hours session)
    const sessionToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token: sessionToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        domain: user.domain
      }
    });

  } catch (error) {
    console.error('Login process crashed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Symmetric internal system compile error during login.' 
    });
  }
});

// 3. SECURE GOOGLE OAUTH HANDSHAKE HANDLER
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Google identification token missing.' });
    }

    // Verify token identity payload integrity signatures directly with Google cryptographic servers
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Find if user cluster map already exists via email or googleId
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Naya profile compile karein (Bachi hui UI details form preferences se aayengi)
      user = new User({
        fullName: name,
        email: email,
        googleId: googleId,
        // Default placeholders jab tak step 2 & 3 complete na ho frontend pe
        role: 'Student',
        domain: 'Programming'
      });
      await user.save();
    } else if (!user.googleId) {
      // Agar email system mein local entry se tha, toh google ID link kardo telemetry ke liye
      user.googleId = googleId;
      await user.save();
    }

    // Sign Application Cluster Web Token
    const sessionToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token: sessionToken,
      isNewUser,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        domain: user.domain
      }
    });

  } catch (error) {
    console.error('Google Auth Handshake Error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Cryptographic signature validation failed or unauthorized entity.' 
    });
  }
});

// Port Handshake Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server online on port ${PORT}`));