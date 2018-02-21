var express = require('express');
var app = express();
var router = express.Router();

router.use(function(req, res, next){
  console.log("first use, declared before anything else");
  next();
});

router.get("/:foo", function(req, res, next){
  console.log("rendering foo");
  res.render('index', { title: 'Express' });
});

router.param("foo", function(req, res, next, id){
  console.log("Foo param requested", id);
  next();
});

router.use(function(req, res, next){
  console.log("second use, declared afte everything else");
  next();
});

app.listen(8000);
