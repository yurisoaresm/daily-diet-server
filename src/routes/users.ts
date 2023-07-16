import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../../knex/schema';
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists';

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const users = await knex('users').select('*');

    if (users.length === 0) {
      return reply.status(404).send({ message: 'Users were not found' });
    }

    reply.status(200).send({ users });
  });

  app.get('/:id', async (request, reply) => {
    const getUserSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getUserSchema.parse(request.params);

    const user = await knex('users').where({ id }).first();

    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    reply.status(200).send({ user });
  });

  app.get('/login', async (request, reply) => {
    const loginUserSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = loginUserSchema.parse(request.body);

    const user = await knex('users').where({ email }).first();

    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    if (user.password !== password) {
      return reply.status(401).send({ message: 'Invalid data' });
    }

    const sessionId = user.id;

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    reply.status(200).send({ user, sessionId });
  });

  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      first_name: z.string(),
      last_name: z.string(),
      email: z.string().email(),
      password: z.string(),
    });

    const { first_name, last_name, email, password } = createUserSchema.parse(
      request.body,
    );
    const id = randomUUID();
    const user = await knex('users').insert({
      id,
      first_name,
      last_name,
      email,
      password,
    });

    reply.status(201).send({ user });
  });

  app.delete(
    '/',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId;

      const user = await knex('users').where({ id: sessionId }).first();

      if (!user) {
        return reply.status(404).send({ message: 'User not found' });
      }

      await knex('users').where({ id: user.id }).del();

      reply.status(204).send();
    },
  );
}
