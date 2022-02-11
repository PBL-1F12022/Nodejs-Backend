const express = require('express');
const investorRouter = require('./routers/investor')
const entrepreneurRouter = require('./routers/entrepreneur')
const projectRouter = require('./routers/project')

const app = express();
const port = process.env.PORT

app.use(express.json())
app.use(investorRouter)
app.use(entrepreneurRouter)
app.use(projectRouter)

app.listen(port, () => {
    console.log('Server is up on the port ' + port);
})