	'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.add = (event, context, callback) => {
	const timestamp = new Date().getTime();
	const data = JSON.parse(event.body);
	data['id'] = uuid.v1();

	const params = {
		TableName: process.env.REMOTE_GOCD_SERVER_USAGE_DATA_TABLE,
		Item: data
	};

	// write the todo to the database
	dynamoDb.put(params, (error) => {
		// handle potential errors
		if (error) {
			console.error(error);
			callback(null, {
				statusCode: error.statusCode || 501,
				headers: {'Content-Type': 'text/plain'},
				body: 'Couldn\'t create the todo item. Possible cause' + error,
			});
			return;
		}

		// create a response
		const response = {
			statusCode: 200,
			body: JSON.stringify(params.Item),
		};

		callback(null, response);
	});
};
