import { FastifyInstance } from 'fastify';

import { knex } from '../../knex/schema';

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('sqlite_schema').select('*');

    return { users };
  });
}
