const graphql = require("graphql");
const _ = require("lodash");


const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLSchema
  ,GraphQLNonNull

}= graphql


//Scalar Type
/*
String = GraphQLString
Boolean 
int
float
ID

*/ 
// GraphQL types that are used in graphql-express framework
const Person = new GraphQLObjectType({
  name:"Person",
  description:"descr",
  fields: ()=>({
    //these are scalar types in graph ql
    id:{ type: GraphQLID},
    // make field not nullable
    name : { type: new GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLInt},
    isMarried: { type: GraphQLBoolean},
    gpa: {type: GraphQLFloat},
    // these are object types
    justAType:{
      type: Person,
      resolve(parent, args){

      }
    }


  })

})
 


//RootQuery
const RootQuery = new GraphQLObjectType({
  name:"RootQueryType",
  description: "Description",
  fields: {
    person:{
      type:Person,
      resolve(parent, args){
       let personObj= {
          name:'Antonio',
          age: 34,
          isMarried: true,
          gpa: 4.0
        }
        return personObj
      }
    }
  }
});

//Mutations
/* const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
  

    }

}) */


module.exports = new GraphQLSchema({
  query: RootQuery,
  //mutation: Mutation
});
