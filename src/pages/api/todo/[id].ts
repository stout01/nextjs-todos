import { TableClient, TablesSharedKeyCredential } from '@azure/data-tables';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401);
    res.end();
    return;
  }

  const account = 'nextjstodos';
  const accountKey = process.env.AZURE_STORAGE_KEY;
  const tableName = 'todos';

  const credential = new TablesSharedKeyCredential(account, accountKey);
  const client = new TableClient(`https://${account}.table.core.windows.net`, tableName, credential);

  if (req.method === 'PUT') {
    const todoItem = req.body;

    await client.updateEntity(todoItem, 'Merge');

    const updatedItem = await client.getEntity(todoItem.partitionKey, todoItem.rowKey);
    res.statusCode = 200;
    res.json(updatedItem);
  }
};
