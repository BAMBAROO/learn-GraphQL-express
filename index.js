const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema, GraphQLObjectType, GraphQLNonNull } = require("graphql");
const app = express();

const datas = {
  say: "say",
  hi: "hi"
}

const data =  new GraphQLObjectType({
  name: "sayHello",
  fields: () => ({
    say: { type: GraphQLString },
    hi: { type: GraphQLString }
  })
});

const authorType = new GraphQLObjectType({
  name: "authors",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    authorsBook: {
      type: new GraphQLList(bookType),
      resolve: (parent) => {
        return books.filter((book) => book.authorId === parent.id)
      }
    }
  })
})

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
];

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
];

const bookType = new GraphQLObjectType({
  name: "books",
  description: "bunch of books",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    authorId: { type: GraphQLInt },
    authors : {
      type: authorType,
      resolve: (parent) => { 
        return authors.find((author) => author.id === parent.authorId)
      }
    }
  })
})


const rootQuery = new GraphQLObjectType({
  name: "query",
  description: "root query",
  fields: () => ({
    books: {
      type: new GraphQLList(bookType),
      resolve: () => books 
    },
    authors: {
      type: new GraphQLList(authorType),
      resolve: () => authors
    },
    message: {
      type: data,
      resolve: () => datas
    }
  })
})

const schema = new GraphQLSchema({
  query: rootQuery
})

app.use("/graphql", graphqlHTTP({
  schema: schema,
  graphiql: true
}));

// app.get("/", (req, res) => {
//   res.end("Hello World!")
// });

app.listen(4000, () => {
  console.log("YOUR APP IS RUNNING AT PORT 4000")
});