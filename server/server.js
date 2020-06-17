const express = require('express');
const morgan = require('morgan');

const serverConf =require('./config/server_conf');

const PORT = serverConf.port;

app = new express();
app.use(morgan('tiny'));


/**-----PUBLIC APIs---------*/


/**----FROM NOW ON ONLY PRIVATE API ----- */


app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
