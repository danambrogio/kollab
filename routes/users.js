var express = require('express');
var router = express.Router();

//SQL mapping
usercreate = function(req, res) {
  
  req.getConnection(function(err, connection){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
      username : input.username,
      password : input.password
    };

    var query = connection.query('INSERT INTO users set ? ', data, function(err, rows){

      if(err)
        console.log("Error usercreate : %s ", err);

      res.send('success');
      res.status(200); //send OK

    })
  })

};

userlist = function(req, res) {

  req.getConnection(function(err, connection){
    var query = connection.query('SELECT * FROM users', function(err, rows){

      if(err)
        console.log("Error userlist : %s ", err);

      res.json({rows});

    })
  })
};

userupdate = function(req, res) {

  req.getConnection(function(err, connection){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    var data = {
      username : input.username,
      password : input.password
    };

    var query = connection.query('UPDATE users set ? WHERE id = ? ', [data,id], function(err, rows){

      if(err)
        console.log("Error userupdate : %s ", err);

      res.send('success');
      res.status(200); //send OK

    })
  })

};

userdelete = function(req, res) {

  var id = req.params.id;
  req.getConnection(function(err, connection){

    var query = connection.query("DELETE FROM users WHERE id = ? ",[id], function(err, rows){

      if(err)
        console.log("Error deleting : %s ",err );

      res.send('success');
      res.status(200); //send OK

    });
  })

};

//endpoints
router.post('/', usercreate); //CREATE user
router.get('/', userlist); //READ users
router.put('/:id', userupdate); //UPDATE users
router.delete('/:id', userdelete); //DELETE user

module.exports = router;
