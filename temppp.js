console.log(req.query.name !== undefined);
  console.log(req.url);
  if(req.query.name !== undefined){
    // console.log(req.body.name);
    // console.log(req.body.username);
    // console.log(req.body.email);
    // console.log(req.body.password);
    let fname = req.body.name
    let uname = req.body.username
    let uemail = req.body.email
    let upassword = req.body.password
    let newUser = new User({'name' : fname,'username' : uname,
                            'email' : uemail, 'password' : upassword});
    User.createUser(newUser, function(err, userInfo) {
      if(err) {
        throw err;
      }
      res.render('index', {
       title: userInfo + ". Thank you for Registration",
      });
    //console.log("----->", userInfo);
    });
  }
  else{
    let uname = req.body.username;
    let upassword = req.body.password;
    let user = await User.getUser({'username' : uname, 'password' : upassword});
     console.log(">>>>>", user);
     if(!user){
      console.log("not found");
      let newUrl = "./index.html";;
      console.log(newUrl);
      //res.statusCode = 301;
      //res.setHeader('Content-Type', 'text/plain');
      res.writeHead(301, {'Location': newUrl});
      res.end('Redirecting to ' + newUrl);
     }
     res.render('index', {
      title: user,
     });
  }
