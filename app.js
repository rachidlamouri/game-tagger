require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Client } = require('pg');

app.use(bodyParser.json());

const client = new Client()
client.connect()

app.use(express.static('public'));

app.get('/games', (req, res) => {
  return client.query('select * from games')
    .then((response) => {
      res.send(response.rows);
    })
});

app.get('/tags', (req, res) => {
  return client.query('select * from tags')
    .then((response) => {
      res.send(response.rows);
    })
});

app.post('/relations', (req, res) => {
  const { gameId, tagId } = req.body;
  return client.query(`insert into tag_relations (game_id, tag_id) values ('${gameId}', '${tagId}')`)
    .then((response) => {
      res.send(response);
    })
})

app.listen(3000, () => {
  console.log('Listening...');
})
