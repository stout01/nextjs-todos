import { odata, TableClient, TablesSharedKeyCredential } from '@azure/data-tables';
import { getSession } from 'next-auth/client';

export default async (req, res) => {
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
  const todos = client.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${partitionKey}` },
  });

  const todoArray = [];
  for await (const todo of todos) {
    todoArray.push(todo);
  }

  res.statusCode = 200;
  res.json(todoArray);
};
