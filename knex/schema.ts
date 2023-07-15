import { knex as setupKnex, Knex } from 'knex';

import { env } from '../src/env';

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './knex/migrations',
  },
};

export const knex = setupKnex(config);
