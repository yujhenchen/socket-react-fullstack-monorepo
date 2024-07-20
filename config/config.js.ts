import { z } from 'zod';

const envVarsSchema = z.object({
    SERVER_PORT: z.number().default(3000)
});

// TODO: use the right way to validate schema and handle errors
const envVars = envVarsSchema.parse(process.env);

export const config = {
    port: envVars.SERVER_PORT,
};
