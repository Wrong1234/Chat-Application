// ============================================
// FILE: src/routes/index.js
// ============================================

import express from 'express';
import authRoutes  from '../auth/auth.routes.js';
// import userRoutes from './user.routes.js';
// import chatRoutes from './chat.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/chats', chatRoutes);

export default router;