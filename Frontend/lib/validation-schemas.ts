import { z } from 'zod';

// Auth schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])/, 'Password must contain lowercase letters')
    .regex(/^(?=.*[A-Z])/, 'Password must contain uppercase letters')
    .regex(/^(?=.*\d)/, 'Password must contain numbers'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])/, 'Password must contain lowercase letters')
    .regex(/^(?=.*[A-Z])/, 'Password must contain uppercase letters')
    .regex(/^(?=.*\d)/, 'Password must contain numbers'),
});

// User profile schema
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar_url: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

// Roadmap schemas
export const createRoadmapSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  topic: z.string().min(1, 'Topic is required').max(100),
  duration_days: z.number().positive('Duration must be positive'),
  generateAI: z.boolean().optional().default(false),
  modules: z.array(z.any()).optional(),
});

export const updateRoadmapSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['active', 'paused', 'completed']).optional(),
});

// Module schemas
export const completeModuleSchema = z.object({
  completion_date: z.string().datetime().optional(),
});

// Quiz schemas
export const submitQuizSchema = z.object({
  answers: z.array(z.object({
    question_id: z.string(),
    selected_answer: z.string(),
  })),
});

// Chat schemas
export const sendChatMessageSchema = z.object({
  message: z.string().min(1, 'Message is required').max(5000),
  roadmap_id: z.string().optional(),
});

// AI Generation schemas
export const generateRoadmapSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(200),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  duration_days: z.number().positive().default(30),
});

export const generateContentSchema = z.object({
  module_id: z.string().min(1),
  topic: z.string().min(1),
});

export const generateQuizSchema = z.object({
  topic: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  num_questions: z.number().min(1).max(20).default(5),
});

// Enrollment schemas
export const enrollCourseSchema = z.object({
  course_id: z.string().min(1, 'Course ID is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type CreateRoadmapInput = z.infer<typeof createRoadmapSchema>;
export type SendChatInput = z.infer<typeof sendChatMessageSchema>;
export type GenerateRoadmapInput = z.infer<typeof generateRoadmapSchema>;
