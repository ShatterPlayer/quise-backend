'use strict'
const { MongoClient, ObjectId } = require('mongodb')
const uri = `mongodb+srv://${process.env.MONGODB_LOGIN}:${process.env.MONGODB_PASSWORD}@cluster0.fhn5j.mongodb.net/main?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

module.exports = { client, ObjectId }
