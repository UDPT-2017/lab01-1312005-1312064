var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");
app.listen(3000);
var pg = require("pg");
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var config = {
  user: 'postgres', //env var: PGUSER
  database: 'bt1', //env var: PGDATABASE
  password: '12345', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);



app.get("/",function(req,res){
    res.render("main");
});
app.get("/thongtin",function(req,res){
  pool.connect(function(err, client, done) {
    if (err) {

    }
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    client.query('SELECT * from taikhoan', function(err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);

      if(err) {
        req.end();
        return console.error('error running query', err);
      }
      // console.log(result.rows[0].hoten);
      res.render("thongtin.ejs",{danhsach:result});
      //output: 1
    });
  });

});
app.get("/taikhoan/dangki",function(req,res){
  res.render("dangki.ejs");
});
app.post("/taikhoan/dangki",urlencodedParser,function(req,res){
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var hoten=req.body.TXTten;
    var username=req.body.TXTusername;
    var password=req.body.TXTpassword;
    var email=req.body.TXTemail;


    //use the client for executing the query
    client.query("INSERT INTO taikhoan(hoten,username,password,email) VALUES('"+hoten+"','"+username+"','"+password+"','"+email+"')", function(err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done();

      if(err) {
        req.end();
        return console.error('error running query', err);
      }
      // console.log(result.rows[0].hoten);
        res.send("Đăng kí thành công");
      //output: 1
    });
  });
});
