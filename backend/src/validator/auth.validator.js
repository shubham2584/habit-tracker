import {z} from zod;
export const regiesterSchema = z.object({
    email: z 
    .string()
    .trim()
    .toLowerCase()
    .email('Must be a valid email address')
    .max(128, 'Password to long'),
   password: z
   .string()
   .min(8, 'Password must be at least 8 character')
   .max(128, 'Password to long'),
});
