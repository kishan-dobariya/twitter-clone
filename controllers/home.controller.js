exports.homePageGet = function(req, res) {
  console.log(">111>>>>>", req.cookies['test18@gmail.com']);
  res.render("home", {
    title : "name"
  });
}
