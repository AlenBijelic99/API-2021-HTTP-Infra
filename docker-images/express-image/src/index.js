const express = require('express')
const app = express()
const port = 3000

const Joke = require('give-me-a-joke');

app.get('/', (req, res) => {
  res.send('Go to /dad, /chucknorris, /custom?firstname=John&lastname=Smith or /category/[blonde, knock-knock, animal, jod]')
})

app.get('/dad', (req, res) =>{
  Joke.getRandomDadJoke (function(joke) {
    res.send(joke)
  });
})

app.get('/chucknorris', (req, res) =>{
  Joke.getRandomCNJoke (function(joke) {
    res.send(joke)
  });
})

app.get('/custom', (req, res) =>{
  var firstname = req.query.firstname
  var lastname = req.query.lastname
  Joke.getCustomJoke (firstname, lastname, function(joke) {
    res.send(joke)
  });
})

app.get('/category/:category', (req, res) =>{
  var category = req.params.category
  Joke.getRandomJokeOfTheDay (category, function(joke) {
    res.send(joke)
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})