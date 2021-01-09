import { Handler, response, database as db } from 'kretes';

const { OK } = response;

export const create: Handler = async ({ params }) => {
  const { name } = params;

  await db.from('task').insert({ name });

  return OK('Added');
}

