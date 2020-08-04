const graphql = require("graphql");
const _ = require("lodash");
const User = require('../model/user')
const Post = require('../model/post')
const Hobby = require('../model/hobby')


const { GraphQLObjectType,GraphQLID, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList , GraphQLNonNull} = graphql;

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

        return Post.find({ userId: parent.id }) // find all elements where the condition is true: userId=parent.id, same as the lodash find condition
       // return _.filter(postsData, {userId: parent.id})
      }
    },

    hobbies:{
      type: new GraphQLList(HobbyType),
      resolve(parent, args){
        return Hobby.find({userId: parent.id})
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
        return User.find({id : parent.userId})
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
         User.find({id : parent.userId})
     
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

      args: { id: { type: GraphQLString } },
      resolve(parent, args) {

        return Hobby.findById(args.id)

      }
    },
    post: {
      type: PostType,
      //agrs are arguments that we are passing to the query
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        return Post.findById(args.id)

      }
    },
    //no arguments here to pass , just get all users
    users:{
      type: new GraphQLList(UserType),
      resolve(parents, args){
        return User.find({})
        
      }
    },
    hobbies:{
      type: new GraphQLList(HobbyType),
      resolve(parent,args){
        return Hobby.find({})
      }
    },
    posts:{
      type: new GraphQLList(PostType),
      resolve(parent, args){
        return Post.find({})
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
          name: { type: new GraphQLNonNull( GraphQLString) },
          age: { type: new GraphQLNonNull( GraphQLString) },
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
      //Update user
    
      updateUser:{
          type: UserType,
          args:{
            id: {type: new GraphQLNonNull( GraphQLID )}, 
            name: { type:  GraphQLString },
            age: { type:  GraphQLString },
            profession: {type: GraphQLString }
          },
          resolve(parent, args){
              return User.findByIdAndUpdate(args.id,{
                $set:{  name: args.name,
                        age: args.age,
                        profession: args.profession
                }
              }, {new :false} //send back the updated objectType
              
              )
          }
      },

      deleteUser:{
        type: UserType,
        args:{
          id: {type: new GraphQLNonNull( GraphQLID )}, 
        },
        resolve(parent, args){
          return User.findByIdAndRemove(args.id).exec()
        }
      },


      // Post mutation
      createPost:{
        type: PostType,
        args:{
   
          comment:{ type :new GraphQLNonNull(GraphQLString) },
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
      updatePost:{
        type: PostType,
        args:{
          id: {type: new GraphQLNonNull(GraphQLID)},
          comment:{ type :GraphQLString },
          userId: {type: GraphQLID}
        },
        resolve(parent, args){
          return Post.findByIdAndUpdate(args.id,{
            $set:{

              comment:args.comment,
           //   userId:args.userId
            }

          }, {new:true}
          )

        }


      },

      deletePost:{
        type: PostType,
        args:{
          id: {type: new GraphQLNonNull(GraphQLID)},
        }, 
        resolve(parent, args){
          return Post.findByIdAndRemove(args.id).exec()
        }
      },
      

      createHobby:{
        type: HobbyType,
        args:{
          title:{ type: new GraphQLNonNull( GraphQLString) },
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
      },

      updateHobby:{
        type: HobbyType,
        args:{

          id: {type: new GraphQLNonNull(GraphQLID)},
          title:{ type:  GraphQLString },
          description:{ type: GraphQLString },
        //  userId: {type: GraphQLID}
        },
        resolve(parent, args){
          return Hobby.findByIdAndUpdate(args.id, {
            $set:{

              title: args.title,
              description: args.description,
           //   userId: args.userId
            }
          }, {new: true }
          )
        }

      },
      deleteHobby:{
        type: HobbyType,
        args:{ 

          id: {type: new GraphQLNonNull(GraphQLID)},
        },
        resolve(parent, args){
          return Hobby.findByIdAndRemove(args.id).exec()
        }
      }

    }

})



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
