import rateLimit from 'express-rate-limit';

const make = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  });

export const apiLimiter = make(15, 200, 'Too many requests. Please try again later.');
export const loginLimiter = make(15, 10, 'Too many login attempts. Please try again in 15 minutes.');
export const contactLimiter = make(60, 5, 'Too many messages sent. Please try again later.');
