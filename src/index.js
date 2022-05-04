const express = require("express");
const investorRouter = require("./routers/investor");
const entrepreneurRouter = require("./routers/entrepreneur");
const projectRouter = require("./routers/project");
const coinsRouter = require("./routers/coins");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(investorRouter);
app.use(entrepreneurRouter);
app.use(projectRouter);
app.use(coinsRouter);

app.listen(port, () => {
    console.log("Server is up on the port " + port);
});
