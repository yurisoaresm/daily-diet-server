import cookie from '@fastify/cookie';
import fastify from 'fastify';

import { env } from './env';
import { mealsRoutes, usersRoutes } from './routes';

export const app = fastify();
app.register(cookie);

// Routes
app.register(usersRoutes, { prefix: '/users' });
app.register(mealsRoutes, { prefix: '/meals' });

// Run the server
app
  .listen({ port: env.PORT ?? 3000 })
  .then(() => console.log(`🚀 Server is running on port ${env.PORT}`));
