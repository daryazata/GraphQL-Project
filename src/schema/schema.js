const graphql = require("graphql");
const _ = require("lodash");
const User = require('../model/user')
const Post = require('../model/post')
const Hobby = require('../model/hobby')


const { GraphQLObjectType,GraphQLID, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = graphql;

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
       // return _.filter(postsData, {userId: parent.id})
      }
    },

    hobbies:{
      type: new GraphQLList(HobbyType),
      resolve(parent, args){
        
        return Hobby.find({userId:parent.id})
       // return _.filter(hobbiesData, {userId: parent.id})

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
        
       // return _.find(userData, { id: parent.userId });
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
      //  return _.find(userData, { id: parent.userId });
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
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        return User.findById(args.id)
      }
    },
    hobby: {
      type: HobbyType,
      //agrs are arguments that we are passing to the query
      args: { title: { type: GraphQLString } },

      resolve(parent, args) {
       // return _.find(hobbiesData, { title: args.title });
      }
    },
    post: {
      type: PostType,
      //agrs are arguments that we are passing to the query
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
      //  return _.find(postsData, { id: args.id });
      }
    },
    users:{
      type: new GraphQLList(UserType),
      resolve(parents, args){
        return User.find()
        
      }
    },
    hobbies:{
      type: new GraphQLList(HobbyType),
      resolve(parent,args){
        return hobbiesData
      }
    },
    posts:{
      type: new GraphQLList(PostType),
      resolve(parent, args){
        return postsData
      }
    }
  }
});

//Mutations
const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
      createUser:{
        type: UserType,
        args:{
          //id:{ type : GraphQLID}
          name: { type: GraphQLString },
          age: { type: GraphQLString },
          profession: {type: GraphQLString }
        },

        resolve(parent, args){
          let user = new User({
            name: args.name,
            age: args.age,
            profession: args.profession
          })
          // save to our db
          user.save()
          return user 
        }
      },
      //create Post mutation
      createPost:{
        type: PostType,
        args:{
          //id:{ type: GraphQLID},
          comment:{ type: GraphQLString },
          userId: {type: GraphQLID}
        },

        resolve(parent, args){
          let post = new Post( {
            comment: args.comment,
            userId: args.userId
          })
          post.save()
          return post
        }
      },
      createHobby:{
        type: HobbyType,
        args:{
          title:{ type: GraphQLString },
          description:{ type: GraphQLString },
          userId: {type: GraphQLID}
        },

        resolve(parent, args){
          let hobby = new Hobby( {
            title: args.title,
            description: args.description,
            userId: args.userId
          })
          hobby.save()
          return hobby
        }
      }

    }

})


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
