const express = require("express")
const cors = require("cors");
const apiRoutes = require("./routes/api.routes");

require("dotenv").config();

require("./config/db")

const app = express()
app.use(express.json({ limit: "1mb" }));
app.use(express.json())
app.use(cors())

app.use('/api', apiRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("server started at http://localhost:" + PORT);
})