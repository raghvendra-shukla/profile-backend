const connectToMongo=require("./db");
connectToMongo();
const express = require('express');
const cors =require("cors");
const app = express();
const PORT =process.env.PORT || 5000;

//A middleWare to  use req.body
app.use(express.json());
app.use(
  cors({
    origin:"*"
  })
)
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));
//Avialable Routes
app.use("/api/auth",require("./routes/auth"));
app.use("/api/profile",require("./routes/profile"));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
})