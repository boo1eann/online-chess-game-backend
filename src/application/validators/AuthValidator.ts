import * as z from "zod";

export const RegisterSchema = z.object({
	email: z.email('Invalid email format'),
	username: z.string().min(3).max(20),
	password: z.string().min(8, 'Password must be at least 8 characters')
})

export const LoginSchema = z.object({
	email: z.email('Invalid email format'),
	password: z.string().min(1, 'Password is required'),
});

export const RefreshTokenSchema = z.object({
	refreshToken: z.string().min(1, 'Refresh token is required'),
});

// export type RegisterSchema = z.infer<typeof RegisterSchema>;
// export type LoginSchema = z.infer<typeof LoginSchema>;
// export type RefreshTokenSchema = z.infer<typeof RefreshTokenSchema>;