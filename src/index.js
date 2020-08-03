const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema/schema");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema
  })
);

//express object
app.listen(8080, () => {
  console.log(`listening on port 8080`);
});
