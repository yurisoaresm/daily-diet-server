import fastify from 'fastify';

import { env } from './env';
import { usersRoutes } from './routes/users';

const app = fastify();

// Routes
app.register(usersRoutes, { prefix: '/users' });

// Run the server
app
  .listen({ port: env.PORT ?? 3000 })
  .then(() => console.log(`🚀 Server is running on port ${env.PORT}`));
