export default (req, res) => {
  res.statusCode = 200;
  res.json([
    { id: 1, name: 'VDP' },
    { id: 2, name: 'Watchlist' },
    { id: 3, name: 'Search' },
  ]);
};
