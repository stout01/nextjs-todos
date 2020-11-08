import { getSession } from 'next-auth/client';

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401);
    res.end();
    return;
  }
  const applicationId = req.query.id;

  res.statusCode = 200;
  res.json([{ id: applicationId, name: 'VDP' }]);
};
