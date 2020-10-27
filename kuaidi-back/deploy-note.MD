ng prod -> dist folder -> put 
app.use(express.static(path.join(__dirname, 'kuaidi-front')));

app.all('/*', function(req, res, next) {
   // Just send the index.html for other files to support HTML5Mode
   res.sendFile('kuaidi-front/index.html', { root: __dirname });
});
