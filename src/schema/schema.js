const graphql = require("graphql");
const _ = require("lodash");

//dummy data
let userData = [
  { id: "1", age: 43, name: "Alex", profession: "Hunter" },
  { id: "2", age: 25, name: "Nina", profession: "Programmer" },
  { id: "3", age: 28, name: "Sam", profession: "Teacher" },
  { id: "4", age: 29, name: "Olga", profession: "Painter" },
  { id: "5", age: 21, name: "Natalie", profession: "Writer" }
];

let hobbiesData = [
  {
    id: "1",
    title: "Swimming",
    description: "going to swim every monday",
    userId: "2"
  },
  {
    id: "2",
    title: "Chess",
    description: "playing chess every tuesday",
    userId: "3"
  },
  {
    id: "3",
    title: "TV",
    description: "watching TV every wednesday",
    userId: "3"
  },
  {
    id: "4",
    title: "Jogging",
    description: "jogging every thursday",
    userId: "4"
  },
  {
    id: "5",
    title: "Bouldering",
    description: "bouldering every friday",
    userId: "4"
  }
];

let postsData = [
  { id: "1", comment: "Great blog", userId: "1" },
  { id: "2", comment: "I really like your course", userId: "1" },
  { id: "3", comment: "Make more courses like this", userId: "2" },
  { id: "4", comment: "cool blog", userId: "3" }
];

const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = graphql;

//create types
const UserType = new GraphQLObjectType({
  name: "User",
  description: "Documentation for user!",
  //fields are the actuall data
  fields: () => ({
    id: { type: GraphQLString },
    age: { type: GraphQLInt },
    name: { type: GraphQLString },
    profession: { type: GraphQLString },

    posts:{
      type: new GraphQLList(PostType),
      resolve(parent, args){
        return _.filter(postsData, {userId: parent.id})
      }
    },

    hobbies:{
      type: new GraphQLList(HobbyType),
      resolve(parent, args){
        return _.filter(hobbiesData, {userId: parent.id})

      }
    }
  })
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "this are hobbies",
  fields: () => ({
    // not field!!!
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(userData, { id: parent.userId });
      }
    }
  })
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post description...",
  fields: () => ({
    id: { type: GraphQLString },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(userData, { id: parent.userId });
      }
    }
  })
});

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    user: {
      type: UserType,
      args: { name: { type: GraphQLString } },

      resolve(parent, args) {
        //we resolve with data
        //get and return data from a data source

        return _.find(userData, { name: args.name });
      }
    },
    hobby: {
      type: HobbyType,
      //agrs are arguments that we are passing to the query
      args: { title: { type: GraphQLString } },

      resolve(parent, args) {
        return _.find(hobbiesData, { title: args.title });
      }
    },
    post: {
      type: PostType,
      //agrs are arguments that we are passing to the query
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        return _.find(postsData, { id: args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
