const express = require('express');

function main() {
    const app = express();

    app.use('/js', express.static('dist'));

    app.get('/', function (req, res) {
      res.send('Hello World!');
    });

    var server = app.listen(29684, 'localhost', function () {
      var host = server.address().address;
      var port = server.address().port;

      console.log('Example app listening at http://%s:%s', host, port);

    });
}

main();
