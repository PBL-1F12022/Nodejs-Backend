const express = require('express');
const investorRouter = require('./router/investor')
const entrepreneurRouter = require('./router/entrepreneur')
const projectRouter = require('./router/project')

const app = express();
const port = process.env.PORT

app.use(express.json())

app.listen(port, () => {
    console.log('Server is up on the port ' + port);
})