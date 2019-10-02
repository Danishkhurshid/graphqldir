/**
 * This is where we define our schema.It describes
 * object types,the relationship betweeen those object types.
 * And it describes how we can reach into the graph to interact with that data.
 */
const graphql = require('graphql');
// library 
const _= require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

// destructring, grabbing all the different properties from graphql package.
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
} = graphql;

// //dummy data
// var books = [
// 	{name:'Game of thrones',genre:'fantasy',id:'1', authorid:'1'},
// 	{name:'haunting of the hill',genre:'horror',id:'2',authorid:'2'},
// 	{name:'sense of ending',genre:'romance',id:'3',authorid:'3'},
// 	{name:'the half mother',genre:'conflict',id:'4',authorid:'2'},
// 	{name:'the curfwed night',genre:'conflict',id:'5',authorid:'2'},
// ]
// var authors = [
// 	{name:'jk rowling',age:100,id:'1'},
// 	{name:'George martin',age: 50,id:'2'},
// 	{name:'julian barnes',age:40,id:'3'}
// ]

//defining the object type.

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: {
			type: GraphQLID
		},
		name: {
			type: GraphQLString
		},
		genre: {
			type: GraphQLString
		},
		author:{
			type: AuthorType,
			resolve(parent,args){
				//return _.find(authors,{id:parent.authorid});
				return Author.findById(parent.authorId);
			}
		}
	})
});


const AuthorType = new GraphQLObjectType({
	name: 'AuthorS',
	fields: () => ({
		id: {
			type: GraphQLID
		},
		name: {
			type: GraphQLString
		},
		age: {
			type: GraphQLInt
		},
		books:{
			//GraphqlList type helps us return a list of books.
			type: GraphQLList(BookType),
			resolve(parent,args){
				//return _.filter(books,{authorid:parent.id})
				return Book.find({authorId:parent.id });
			}
		}
	})
});

//Root queries are bascially how to get into the graph to grab the data.

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		//This name matters. This is identifies how we can grab our data from the front end. 
		book: {
			type: BookType,
			// To query a patricular book user should pass some arguments along it.
			// GraphqlID is a graphql type. We can't simply use id here because graphql won't understand that.  
			args: {
				id: {
					type: GraphQLID
				}
			},

			// This is the function where we write our code get what ever data we need to get from our data source.
			resolve(parent, args) {
				//code to get the data from database
				//return _.find(books,{id:args.id });
				return Book.findById(args.id);

			}
		},

		author:{
			type: AuthorType,
			args: {
				id:{
					type: GraphQLID
				}
			},
			resolve(parent, args){
				//return _.find(authors, {id:args.id});
				return Author.findById(args.id);
			}
		},
		books:{
			type: GraphQLList(BookType),
			resolve(parent,args){
				//return books;
				return Book.find({});
			}
		},
		authors:{
			type: GraphQLList(AuthorType),
			resolve(parent,args){
				//return authors;
				return Author.find({});
			}
		},
	}
});


//Mutating the data

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor:{
			type: AuthorType,
			args:{
				name: {type: new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parent,args){
				//creating a new local instance of author data type and saving it to the database.
				let author = new Author({
					name: args.name,
					age: args.age,
				});
				return author.save();
			}
		},
		addBook: {
			type: BookType,
			args:{
				name: {type: new GraphQLNonNull(GraphQLString)},
				genre: {type: new GraphQLNonNull(GraphQLString)},
				authorId: {type: new GraphQLNonNull(GraphQLID)},
			},
			resolve(parent,args){
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId
				});
				return book.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})
