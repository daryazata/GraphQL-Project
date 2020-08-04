const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const mongoose = require('mongoose')
//const env = require('node-env-file');
require('dotenv').config({path: __dirname + '/.env'})


mongoose.connect(process.env.MONGODB_CONN,  { useNewUrlParser: true , useUnifiedTopology: true })
mongoose.connection.once('open', 
()=>{ console.log('Mongo DB Connected!')}
)
const schema = require("./schema/schema");
const type_schema = require("./schema/type__schema")
const cors =require('cors')
const app = express();
const port = process.env.PORT || 8080


app.use(cors())

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema

  })
);

//express object
app.listen(port, () => {
  console.log(`listening on port 8080`);
});
