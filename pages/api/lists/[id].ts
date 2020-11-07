export default (req, res) => {
  const applicationId = req.query.id;

  res.statusCode = 200;
  res.json({ id: applicationId, name: 'VDP' });
};
