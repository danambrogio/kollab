var express = require('express');
var router = express.Router();

//SQL mapping
taskcreate = function(req, res) {
  
  req.getConnection(function(err, connection){
    
    var input = JSON.parse(JSON.stringify(req.body));

    var data = {
      title : input.title,
      description : input.description,
      status : input.status,
      creationDate : new Date().toISOString().slice(0, 19).replace('T', ' '),
      estimatedCompletion : input.estimatedCompletion,
      completionDate : input.completionDate,
      tags : input.tags
    };

    var query = connection.query('INSERT INTO tasks set ? ', data, function(err, rows){

      if(err) {
        res.send(err);
        res.status(422);
      } else {
        res.send('success');
        res.status(200); //send OK
      }

    })
  })

};

tasklist = function(req, res) {

  req.getConnection(function(err, connection){
    var query = connection.query('SELECT * FROM tasks', function(err, rows){

      if(err) {
        console.log("Error tasklist : %s ", err);
      } else {
        res.json({rows}); //send task list
      }

    })
  })
};

taskupdate = function(req, res) {

  req.getConnection(function(err, connection){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

    //TODO: generate hash of the password here with input.password

    var data = {
      title : input.title,
      description : input.description,
      status : input.status,
      creationDate : new Date().toISOString().slice(0, 19).replace('T', ' '),
      estimatedCompletion : input.estimatedCompletion,
      completionDate : input.completionDate,
      tags : input.tags
    };

    var query = connection.query('UPDATE tasks set ? WHERE id = ? ', [data,id], function(err, rows){

      if(err) {
        console.log("Error taskupdate : %s ", err);
      } else {
        res.send('success');
        res.status(200); //send OK
      }



    })
  })

};

taskdelete = function(req, res) {

  var id = req.params.id;
  req.getConnection(function(err, connection){

    var query = connection.query("DELETE FROM tasks WHERE id = ? ",[id], function(err, rows){

      if(err) {
        console.log("Error deleting : %s ",err );
      } else {
        res.send('success');
        res.status(200); //send OK
      }

    });
  })

};

//endpoints
router.post('/', taskcreate); //CREATE task
router.get('/', tasklist); //READ tasks
router.put('/:id', taskupdate); //UPDATE tasks
router.delete('/:id', taskdelete); //DELETE task

module.exports = router;
