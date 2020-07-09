const { Pool } = require('pg')
const pool = new Pool()

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}

const { Client } = require('pg').Client
const client = new Client()


module.exports = {
    query: (queryText, params, callback) => {
        client.connect()
        client.query(queryText, params, callback) 
          .then(result => retu(result)) // your callback here
          .catch(e => console.error(e.stack)) // your callback here
          .then(() => client.end())
    }
}