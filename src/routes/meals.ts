import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../../knex/schema';
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists';

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const meals = await knex('meals').select('*');

    if (meals.length === 0) {
      return reply.status(404).send({ message: 'Meals were not found' });
    }

    reply.status(200).send({ meals });
  });

  app.get('/:id', async (request, reply) => {
    const getMealSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getMealSchema.parse(request.params);

    const meal = await knex('meals').select('*').where({ id }).first();

    if (!meal) {
      return reply.status(404).send({ message: 'Meal not found' });
    }

    reply.status(200).send({ meal });
  });

  app.get(
    '/user/meals',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId;

      const meals = await knex('meals')
        .select('*')
        .where({ user_id: sessionId });

      if (meals.length === 0) {
        return reply.status(404).send({ message: 'Meals were not found' });
      }

      reply.status(200).send({ meals });
    },
  );

  app.get(
    '/user/meal/:id',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId;
      const getMealSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getMealSchema.parse(request.params);

      const meal = await knex('meals').select('*').where({ id }).first();

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found' });
      }

      if (meal?.user_id !== sessionId) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      reply.status(200).send({ meal });
    },
  );

  app.post(
    '/',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId;
      const createMealSchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.date(),
        in_diet: z.boolean(),
      });

      const { name, description, date, in_diet } = createMealSchema.parse(
        request.body,
      );

      const meal = await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        date,
        in_diet,
        user_id: sessionId,
      });

      reply.status(201).send({ meal });
    },
  );

  app.patch(
    '/user/meal/:id',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId;
      const updateMealSchema = z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string(),
        date: z.date(),
        in_diet: z.boolean(),
      });

      const { id, name, description, date, in_diet } = updateMealSchema.parse(
        request.body,
      );

      const meal = await knex('meals').where({ id }).first();

      if (meal?.user_id !== sessionId) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      await knex('meals')
        .where({ id })
        .update({ name, description, date, in_diet });

      reply.status(200).send();
    },
  );

  app.delete(
    '/user/meal/:id',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId;
      const deleteMealSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = deleteMealSchema.parse(request.params);

      const meal = await knex('meals').where({ id }).first();

      if (meal?.user_id !== sessionId) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      await knex('meals').where({ id }).delete();

      reply.status(204).send();
    },
  );
}
