/* Module dependencies */
var express = require('express'), // web framework
    mysql = require('mysql'), // database
    ejs = require('ejs'), // templates
    connect = require('connect'); // GET and POST request parser

/* Application initialization */
var app = express(); // initialize express
//app.use(connect.bodyParser()); // initialize request parser
app.use(express.bodyParser());
app.use(connect.urlencoded());
app.use(connect.json());
//app.use(express.static('public')); // configure static directory
app.use(express.static(__dirname+'/public'));

app.set('view engine', 'ejs'); // set .ejs as the default template extension.
app.set('views',__dirname + '/views'); // set where view templates are located

/* Database Configuration */
var connection = mysql.createConnection({
        host : 'localhost',
        user : 'jkubota',
        password : '3924172'
    });

/* create the ExampleDB if it does not exist. */
var createDatabaseQry = 'CREATE DATABASE IF NOT EXISTS jkubota';
connection.query(createDatabaseQry, function (err) {
    if(err) throw err;

    // use the database for any queries run
    var useDatabaseQry = 'USE jkubota';

    // create the user table if it is does not exist
    connection.query(useDatabaseQry, function(err) {
	if(err) throw err;

	var createTableQry = 'CREATE TABLE IF NOT EXISTS users('
            + 'CustomerID INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(CustomerID),'
            + 'Name VARCHAR(30),'
            + 'Street VARCHAR(30),'
            + 'City VARCHAR(30),'
            + 'State VARCHAR(30),'
            + 'Zip VARCHAR(30),'
            + 'Phone VARCHAR(30)'
            + ')';
	connection.query(createTableQry, function(err){
	    if(err) throw err;
        });
    });
});

/* Return the text Hello, World!. */
app.get('/hello', function(req, res) {
    res.send('Hello, World!');
});

/* subtitle values access via te header tempalte */
app.set('subtitle', 'Lab 18');


app.get('/lab18', function(req, res) {
    res.render('lab18');
});

app.get('/lab18-content', function(req, res) {
    res.render('lab18-content');
});


/* Main route sends our HTML file */
/*
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});
*/
/* index file that links to various examples */
app.get('/', function(req, res){
    res.render('index');
});

/* Eample 1 - HTML Form w/o Ajax or Database Interaction */
app.get('/simpleForm', function(req, res){
    res.render('simpleform.ejs', {action: '/displayFormData'});
});

/* Example 1 - Display form data submitted above */
app.post('/displayFormData', function(req, res) {
    res.render('displayFormData.ejs', req.body);
});

/* Example 2 - Submit data to the database */
app.get('/user/create', function(req, res){
res.render('simpleform.ejs', {action: '/user/create'});
});

/* Create a user. NOTE: Using app.post() */
app.post('/user/create', function(req,res){
   connection.query('INSERT INTO User SET?', req.body,
		    function(err,result){
			if(err) throw err;

			if(result.CustomerID != 'undefined'){
			    var placeHolderValues = {
				email: req.body.email,
				password: req.body.password
				};
			    res.render('displayUserInfo.ejs', placeHolderValues);
			}
			else{
			    res.send('User was not inserted.');
			}
		    });


/*
app.get('/mystyle.css', function(req, res) {
res.sendfile(__dirname + '/mystyle.css');
});
*/

app.get('/entercustomer.html', function(req, res) {
    res.sendfile(__dirname + '/entercustomer.html');
    });

app.get('/searchcustomer.html', function(req, res) {
    res.sendfile(__dirname + '/searchcustomer.html');
    });

app.get('/selectcustomer.html', function(req, res) {
    res.sendfile(__dirname + '/selectcustomer.html');
    });

app.get('/lab18', function(req, res) {
    res.render('/lab18');
    });



// Update MySQL database

// get user via POST
app.post('/user', function (req, res) {
    console.log(req.body);

    // get user by id
    if(typeof req.body.id != 'undefined') {
        connection.query('select * from users where CustomerID = ?', req.body.id,
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
                    var responseHTML = '<table class="users"><tr><th>ID</th><th>Name</th><th>Street</th><th>City</th><th>State</th><th>Zip</th><th>Phone</th></tr>';
                    responseHTML += '<tr><td>' + result[0].CustomerID + '</td>' +
                                    '<td>' + result[0].Name + '</td>' +
                                    '<td>' + result[0].Street + '</td>' +
                                    '<td>' + result[0].City + '</td>' +
                                    '<td>' + result[0].State + '</td>' +
                                    '<td>' + result[0].Zip + '</td>' +
                                    '<td>' + result[0].Phone + '</td>'
                                    '</tr></table>';
                    res.send(responseHTML);
                }
                else
                  res.send('User does not exist.');
            }
        );
    }
    //get user by username
    else if( typeof req.body.Name != 'undefined') {
        connection.query('select Name, Street, City, State, Zip, Phone from users where Name = ?', req.body.username,
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
		    res.send('Name: ' + result[0].Name + '<br />' +
			     'Street: ' + result[0].Street +
			     'City: ' + result[0].City +
'State: ' + result[0].State +
'Zip: ' + result[0].Zip +
'Phone: ' + result[0].Phone
                );
            }
            else
                res.send('User does not exist.');
});
    }
});

// get user via GET (same code as app.post('/user') above)
app.get('/user', function (req, res) {
    
    // get user by id
    if(typeof req.query.id != 'undefined') {
        connection.query('select * from users where CustomerID = ?', req.query.id,
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
                    var responseHTML = '<html><head><title>All Customers</title><link a href="/mystyle.css" rel="stylesheet"></head><body>';
                    responseHTML += '<div class="title">Customer Data</div>';
                    responseHTML += '<table class="users"><tr><th>ID</th><th>Name</th><th>Street</th><th>City</th><th>State</th><th>Zip</th><th>Phone</th></tr>';
                    responseHTML += '<tr><td>' + result[0].CustomerID + '</td>' +
                                    '<td>' + result[0].Name + '</td>' +
                                    '<td>' + result[0].Street + '</td>' +
                                    '<td>' + result[0].City + '</td>' +
                                    '<td>' + result[0].State + '</td>' +
                                    '<td>' + result[0].Zip + '</td>' +
                                    '<td>' + result[0].Phone + '</td>' +
                                    '</tr></table>';
                    responseHTML += '</body></html>';
                    res.send(responseHTML);
                }
                else
                  res.send('User does not exist.');
            }
        );
    }
    //get user by username
    else if( typeof req.query.username != 'undefined') {
        connection.query('select * from users where Name = ?', req.query.username,
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
res.send('Username: ' + result[0].Name + '<br />' +
'Street: ' + result[0].Street +
'Street: ' + result[0].City +
'Street: ' + result[0].State +
'Street: ' + result[0].Zip +
'Street: ' + result[0].Phone
                );
            }
            else
                res.send('User does not exist.');
});
    }
    else {
        res.send('no data for user in request');
    }
});


// return all users
app.get('/users', function (req, res) {
    connection.query('select * from users',
function (err, result) {
            return result;
}
);
});



/* View all users in <table> */
app.get('/user/all', function(req, res){
    connection.query('select CustomerID, Name FROM users',
		     function(err, result) {
			 res.render('displayUserTable.ejs', {rs: result});
		     });
});

app.get('/users', function(req, res) {
    var result = [
	{CustomerID: 1, Name: 'jkubota'},
	{CustomerID: 2, Name: 'test'}
    ];
    res.render('displayUserTable.ejs', {rs: result});
});

/* View a single user's infromation */
app.get('/user', function(req, res) {
    /* 
       NOTE:We are creating a query string here by appending the userID to a string. We are also using req.query instead of req.body because the userid was sent as a GET request not a POST. 
    */
    var query = 'SELECT CustomerID, Name FROM users WHERE CustomerID = ' + req.query.CustomerID;
    connection.query(query,
		     function(err, result){
			 if(result.length > 0){
			     // NOTE: We are using the same template here as for the view of all users.
			     res.render('displayUserTable.js', {rs: result});
			     }
			 else
			     res.send('No users exist.');
		     });
});


// get all users in a <table>

app.get('/users/table', function (req, res) {
    connection.query('select * from users',
		     function (err, result) {

			 fs = require('fs');
			 var HTMLtemp = '';
			 fs.readFile('template.html', 'utf8', function (err,data) {
			     if (err) {
				 return console.log(err);
			     }
			     HTMLtemp = data;
			 });

//			 res.send(HTMLtemp);

			 if(result.length > 0) {

			     var responseHTML = '<html><head><title>All Customers</title><link a href="/mystyle.css" rel="stylesheet"></head><body>';
			     responseHTML += '<div class="title">Customer Table</div>';
			     responseHTML += '<table class="users"><tr><th>ID</th><th>Name</th></tr>';
			     for (var i=0; result.length > i; i++) {
				 responseHTML += '<tr>' +
                                     '<td><a href="/user/?id=' + result[i].CustomerID + '">' + result[i].CustomerID + "&nbsp;" + "&nbsp;" + result[i].Name + '</a></td>' +
                                     '</tr>';
                }
			     responseHTML += '</table>';
			     responseHTML += '</body></html>';
			     
//			     var responseHTML = HTMLtemp.replace('[CUSTOMERDATA]', tableHTML);
			     res.send(responseHTML);

			 }
			 else
			     res.send('No users exist.');

		     }

		    );

});



/*
app.get('/users/table', function (req, res) {
    connection.query('select * from users',
function (err, result) {
            if(result.length > 0) {
                var responseHTML = '<html><head><title>All Customers</title><link a href="/mystyle.css" rel="stylesheet"></head><body>';
                responseHTML += '<div class="title">Customer Table</div>';
                responseHTML += '<table class="users"><tr><th>ID</th><th>Name</th></tr>';
                for (var i=0; result.length > i; i++) {
                    responseHTML += '<tr>' +
                                    '<td><a href="/user/?id=' + result[i].CustomerID + '">' + result[i].CustomerID + "&nbsp;" + "&nbsp;" + result[i].Name + '</a></td>' +
                                    '</tr>';
                }
                responseHTML += '</table>';
                responseHTML += '</body></html>';
                res.send(responseHTML);
}
else
res.send('No users exist.');
}
);
});
*/

// get all users in a <select>
app.post('/users/select', function (req, res) {
    console.log(req.body);
    connection.query('select * from users',
function (err, result) {
console.log(result);
var responseHTML = '<select id="user-list">';
for (var i=0; result.length > i; i++) {
var option = '<option value="' + result[i].CustomerID + '">' + result[i].Name + '</option>';
console.log(option);
responseHTML += option;
}
            responseHTML += '</select>';
res.send(responseHTML);
});
});


// Create customer
app.post('/entercustomer', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO users SET ?', req.body,
        function (err, result) {
            if (err) throw err;
connection.query('SELECT Name, Street, City, State, Zip, Phone FROM users WHERE Name = ?', req.body.name,
function (err, result) {
console.log(result);
if(result.length > 0) {
res.send('Data successfully submitted');
/*
// res.send('Name: ' + result[0].Name + '<br />' +
// 'Street: ' + result[0].Street + '<br />' +
// 'City: ' + + result[0].City + '<br />' +
// 'State: ' + + result[0].State + '<br />' +
// 'Zip: ' + + result[0].Zip + '<br />' +
// 'Phone: ' + + result[0].Phone
// );
*/
}
else
res.send('Customer was not inserted.');
});
        }
    );
});

// Search customer
app.post('/searchcustomer', function (req, res) {
    console.log(req.body);
    connection.query('select * from users where name = ?', req.body.name,
                function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
                      res.send('Name: ' + result[0].Name + '<br />' +
'Street: ' + result[0].Street + '<br />' +
'City: ' + result[0].City + '<br />' +
'State: ' + result[0].State + '<br />' +
'Zip: ' + result[0].Zip + '<br />' +
                               'Phone: ' + result[0].Phone
                      );
                    }
                    else
                      res.send('Customer does not exist.');
                });
});



// Begin listening
app.set(8010);
app.listen(app.get());
console.log("Express server listening on port", app.get());
});
