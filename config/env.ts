import { z } from 'zod';

const envSchema = z.object({
    env: z.enum(['development', 'production', 'test']).default('development'),
    port: z.number().default(3000)
});

const envServer = envSchema.safeParse({
    env: process.env.NODE_ENV,
    port: process.env.SERVER_PORT,
});

if (!envServer.success) {
    console.error(envServer.error.issues);
    throw new Error('There is an error with the server environment variables');
    // process.exit(1);  // won't reach here
}

export const env = envServer.data;

export type Environment = z.infer<typeof envSchema>;
