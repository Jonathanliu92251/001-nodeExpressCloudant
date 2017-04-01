var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
  var db = req.db; 
  var collection;
  var testArray = [];


 

  db.list( {include_docs : true}, function(err, body) {
    if ( !err ) {
    	body.rows.forEach( function( row) {
         collection += JSON.stringify(row.doc);
       // res.render("userlist", { "userlist": row.doc})
      });
    }  
   res.render('userlist', { title: collection });
  });

        /*
       		var collection = { "usename": row.doc.username, "email": row.doc.email};
       		console.log( collection);
       		res.render('userlist', {
            "userlist" : collection
          });
       		console.log(row);
       		response.write("<ul> href=""" + "mailto:" + row.email +"""+ row.username +"</ul>");
      		res.render('userlist', {"username":row.username, "email":row.email}); 
      		
    
    	
    	collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
      });
    }
  
  res.write( "output: " + collection );
 
 });

res.end();
       */


});

module.exports = router;
