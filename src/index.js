const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const mongoose = require('mongoose')
//const env = require('node-env-file');
require('dotenv').config()
//console.log('The value for FOO is:', process.env.MONGODB_CONN);

mongoose.connect("mongodb+srv://darya:nHohascDb0G6eF0u@cluster0.tt30o.mongodb.net/GraphQlDB?retryWrites=true&w=majority",  { useNewUrlParser: true , useUnifiedTopology: true })
mongoose.connection.once('open', 
()=> { console.log('Mongo DB Connected!')}
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
