// required node packages
const fs = require('fs');
const uploadHelper = require('../../helper/upload.helper');

/**
 * Function for uploading files to the files/ directory
 * 
 * @param {object} req the node request parameter
 * @param {object} res the node response parameter
 * 
 * @returns {object} error or the successfully uploaded file
 */
exports.add = function (req, res) {
  
  // check if required parameters are given
  if (req.file === undefined) {
    return res.status(400).json({
      error: {
        code: 'ER_MISSING_PARAMS',
        message: 'ER_MISSING_PARAMS: Some parameters are missing. Required parameters: file'
      }
    });
  }

  // create a new upload object
  let newUpload = {
    name: req.file.originalname.split('.')[0],
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  }

  // read the files file
  fs.readFile(__basedir + '/data/files.json', 'utf8', function (err, data) {
    
    // error reading the file
    if (err) {
      return res.status(500).json({
        error: {
          code: 'ER_INTERNAL',
          message: err.message
        }
      });
    }

    // make js objects out of the json string
    let files = JSON.parse(data);

    // get highest id of the entries in the files.json file
    newUpload._id = uploadHelper.getHighestId(files) + 1;
    // add the object to the array
    files.push(newUpload);

    // write the file
    fs.writeFile(__basedir + '/data/files.json', JSON.stringify(files), function(err) {
      
      // writing error
      if (err) {
        return res.status(500).json({
          error: {
            code: 'ER_INTERNAL',
            message: err.message
          }
        });
      }

      // return file object
      return res.status(200).json(newUpload);

    });

  });

}