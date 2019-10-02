const express = require("express");
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//Allow cross origin requests.
app.use(cors());





//connect to mongodb database
const config = {
	useNewUrlParser: true,
};

//create a database connection
//connecting to mlab database.
mongoose.connect('', config);

mongoose.connection.once('open',() => {
 console.log("now connected to database");
});

//setting up an endpoint
//This is a middlewear function where we
//are passing a schema that tells the express how our data will look.
app.use('/graphql', graphqlHTTP({
	//cuz both names are the same we can only use the name here-Es6.
	schema,
	graphiql: true
}));

//setting up the server
app.listen(4001, () => {
	console.log("now listening for requests on port 4001");
})