import { odata, TableClient, TablesSharedKeyCredential } from '@azure/data-tables';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { v4 as uuidv4 } from 'uuid';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401);
    res.end();
    return;
  }

  // Enter your storage account name and shared key
  const account = 'nextjstodos';
  const accountKey = process.env.AZURE_STORAGE_KEY;
  const tableName = 'todos';

  // Use TablesSharedKeyCredential with storage account and account key
  // TablesSharedKeyCredential is only available in Node.js runtime, not in browsers
  const credential = new TablesSharedKeyCredential(account, accountKey);
  const client = new TableClient(`https://${account}.table.core.windows.net`, tableName, credential);

  const partitionKey = session.user.email;

  if (req.method === 'GET') {
    const todos = client.listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${partitionKey}` },
    });

    const todoArray = [];
    for await (const todo of todos) {
      todoArray.push(todo);
    }

    res.statusCode = 200;
    res.json(todoArray);
  } else if (req.method === 'POST') {
    const todo = req.body;
    todo.partitionKey = partitionKey;
    todo.rowKey = uuidv4();

    await client.createEntity(todo);
    const createdTodo = await client.getEntity(todo.partitionKey, todo.rowKey);

    res.status(200);
    res.json(createdTodo);
  } else {
    res.status(404);
    res.end();
  }
};
