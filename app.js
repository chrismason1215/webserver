var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');

var apiKey = '7b6095742f408225327ffd45ffb11e50';

var app = express();

// var logger = function(req, res, next){
//   console.log('logging...');
//   next();
// }
//
// app.use(logger);

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

var users = [
   {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'jd@gmail.com',
   }
]

app.get('/', function(req, res){
  res.render('index', {
    title: 'CustomersApplication',
    users: users
  })
});

app.get('/users/add', function(req, res){
  res.status(404).render('error404');
});

app.post('/users/add', function(req,res){
   console.log("FORM SUBMITTED!")

   var newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
   }

   console.log(newUser);
});

app.post('/submit', function (req, res) {
   let city = req.body.city;
   let url = 'http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}'

   request(url, function(err, response, body){
      if(err){
         res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
         let weather = JSON.parse(body)

         if(weather.main == undefined){
            res.render('index', {weather: null, error: 'Error, please try again', title: 'Thank you for your submission!', users: users});
         } else {
            let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
            res.render('index', {weather: weatherText, error: null, title: 'Thank you for your submission!', users: users});
         }
      }
   });

   // res.render('index', {
   //    title: 'Thank you for your submission!',
   //    users: users
   // });

  console.log(req.body.city)
})

app.listen(3011, function(){
  console.log("Server started!");
})
