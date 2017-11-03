app.post('/post/:post_type/:post_number', isAuthenticated, function(req, res) {
    console.log('Call post end');
    // get values
    var content_body = req.body.changeSample;
    var post_type = req.params.post_type;
    var post_number = req.params.post_number;
    var post_title = req.body.content_title;
    var post_rewrite = req.body.rewrite;
    var query;
    var currentDate = new Date();
    var cur_date = currentDate.toFormat("YYYY-MM-DD HH24:MI:SS");
    console.log('current Date : ' + cur_date);

    // need to make transfer function
    // if post_type=Notice -> table's name POST_NOTICE
    // transfer string to string
    // How to setting post_authority
    // post_number, title, userid, date, exist_data, views, write_authority, read_authority
    transfer.transfer(post_type, function(type_name){
      var post = {
        'id'              : req.params.post_number,
        'title'           : req.body.content_title,
        'userid'          : req.user.id,
        'post_date'       : cur_date,
        'exist_data'      : false,
        'views'           : 0,
        'write_authority' : 3,
        'read_authority'  : 1
      }
        // query = "INSERT INTO " + type_name + " VALUES(" +
        // post_number+ ", \'"+ post_title +"\', \'" + req.user.userid + "\', \'" + cur_date + "\', false, default, 3, 1);";
        // query = 'INSERT INTO '+type_name+' set ?', post
      console.log("post_end's query : " + query);
      var folder_path = __dirname + '/../public/uploads/qa/' + post_type + '/' + post_number;
      var filePath = __dirname + '/../public/uploads/qa/' + post_type + '/' + post_number + '/' + post_number + ".txt";
      var changed =  content_body ;

      // file open<create file at First>
      fs.exists(folder_path, function(exists){
        if(!exists){
          fs.mkdir(folder_path, 0666, function(err){
            if(err) throw err;
          });
        }
      });

      //insert or update database
      connection.query('INSERT INTO '+type_name+' set ?', post, function(err, result){
        if(err) throw err;
        else {
          // if you remove directory
          // rmdir('folder_path', function(err){ if(err) throw err;})
          fs.open(filePath, 'w', function(err, fd){
            // console.log("file path : " + filePath);
              if(err) throw err;
              var file_buf = new Buffer(html);
              fs.write(fd, file_buf, 0, file_buf.length, null, function(err, written, buffer){
                if(err) throw err;
                console.log(err, written, buffer);
                fs.close(fd, function(){
                  console.log('file_update Success');
                  var temp_path = __dirname + '/../public/images/uploads/';
                  rmfunc.rmfs(temp_path, function(){
                    var url = '/post_menu/'+post_type+'/1';
                    res.redirect(url);
                  });
                });
              });
          });
        }
      });
    });
  });