// eslint-disable-next-line
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      created_at: Date;
      updated_at: Date;
    };
    meals: {
      id: string;
      name: string;
      description: string;
      date: Date;
      created_at: Date;
      updated_at: Date;
      user_id: string;
    };
  }
}
