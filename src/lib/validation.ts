import { z } from 'zod';

// Input validation schemas
export const courseFormSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .refine(val => val.trim().length > 0, 'Title cannot be empty'),
  
  subtitle: z.string()
    .max(300, 'Subtitle must be less than 300 characters')
    .optional(),
  
  description: z.string()
    .max(5000, 'Description must be less than 5000 characters')
    .optional(),
  
  learning_objectives: z.array(z.string().max(500, 'Learning objective too long'))
    .max(20, 'Maximum 20 learning objectives allowed')
    .optional(),
  
  skills_taught: z.array(z.string().max(100, 'Skill name too long'))
    .max(50, 'Maximum 50 skills allowed')
    .optional(),
  
  prerequisites: z.string()
    .max(2000, 'Prerequisites must be less than 2000 characters')
    .optional(),
  
  target_audience: z.array(z.string().max(200, 'Target audience item too long'))
    .max(10, 'Maximum 10 target audience items allowed')
    .optional(),
});

export const moduleFormSchema = z.object({
  name: z.string()
    .min(1, 'Module name is required')
    .max(200, 'Module name must be less than 200 characters'),
  
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  
  order_no: z.number()
    .min(1, 'Order must be at least 1')
    .max(999, 'Order cannot exceed 999'),
});

export const lessonFormSchema = z.object({
  title: z.string()
    .min(1, 'Lesson title is required')
    .max(200, 'Lesson title must be less than 200 characters'),
  
  content_text: z.string()
    .max(50000, 'Content must be less than 50,000 characters')
    .optional(),
  
  content_url: z.string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  
  duration_minutes: z.number()
    .min(1, 'Duration must be at least 1 minute')
    .max(600, 'Duration cannot exceed 10 hours')
    .optional(),
  
  lesson_type: z.enum(['video', 'text', 'quiz', 'assignment', 'interactive']),
  
  order_no: z.number()
    .min(1, 'Order must be at least 1')
    .max(999, 'Order cannot exceed 999'),
});

export const userFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .refine(val => val.trim().length > 0, 'Name cannot be empty'),
  
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),
  
  role: z.enum(['admin', 'staff', 'reviewer', 'student'], {
    errorMap: () => ({ message: 'Invalid role selected' })
  }),
});

export const feedbackFormSchema = z.object({
  message: z.string()
    .min(1, 'Message is required')
    .max(2000, 'Message must be less than 2000 characters')
    .refine(val => val.trim().length > 0, 'Message cannot be empty'),
});

// HTML sanitization function
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*"[^"]*"/gi, ''); // onclick, onload, etc.
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*'[^']*'/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  
  // Remove style attributes that could contain malicious CSS
  sanitized = sanitized.replace(/\s*style\s*=\s*"[^"]*"/gi, '');
  sanitized = sanitized.replace(/\s*style\s*=\s*'[^']*'/gi, '');
  
  return sanitized.trim();
}

// Input length validation helper
export function validateLength(input: string, maxLength: number, fieldName: string): string | null {
  if (!input) return null;
  if (input.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return null;
}

// Email validation helper
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// URL validation helper
export function validateUrl(url: string): boolean {
  if (!url) return true; // Optional URLs are valid
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Array validation helper
export function validateArray<T>(array: T[], maxItems: number, fieldName: string): string | null {
  if (!array) return null;
  if (array.length > maxItems) {
    return `${fieldName} cannot have more than ${maxItems} items`;
  }
  return null;
}