var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fileSystem = require('fs');


router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/uploads', (request, response) => {

  let form = new formidable.IncomingForm({    
    uploadDir: './uploads',
    keepExtensions: true
  });
 
  form.parse(request, (error, fields, files) => {   
    response.json({
      files
    });
  });

});

router.delete('/file', (request, response) => {
 
  let form = new formidable.IncomingForm({   
    uploadDir: './uploads',    
    keepExtensions: true
  });

  form.parse(request, (error, fields, files) => {

    let path = './' + fields.path;
   
    if (fileSystem.existsSync(path)) {      
      fileSystem.unlink(path, error => {
        if (error) {
          response.status(400).json({
            error
          });
        }
        else {         
          response.json({
            fields
          });
        }
      });
    }
    else {
      response.status(404).json({
        error: 'File not found.'
      });
    }

  });

});

router.get('/file', (request, response) => {
  let path = './' + request.query.path;

  if (fileSystem.existsSync(path)) {
    fileSystem.readFile(path, (error, data)=>{
      if (error) {
        console.log(error);
        response.status(400).json({
          error
        });
      }
      else{
        response.status(200).end(data);
      }
    });
  }
  else {
    response.status(404).json({
      error: 'File not found.'
    });
  }
});

module.exports = router;
