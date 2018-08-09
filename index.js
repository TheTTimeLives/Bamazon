var mysql = require('mysql');
var inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "bamazon"
});

con.connect(function(err) {

  if (err) throw err; // give us an error

  start();

  function start (){
    var sml = "SELECT * FROM bamazon.products";

  var sql = "SELECT id, artist, album, releasedate, data1, data2, data3, data4, data5 FROM top_songsdb.Top5000 WHERE artist LIKE 'Bing Crosby%'"; //these are the SQL commands
  var squeakql = "SELECT id, artist, COUNT(artist), album, releasedate, data1, data2, data3, data4, data5 FROM top_songsdb.Top5000GROUP BY artist HAVING COUNT(artist) > 1;";
  var spreakql = "SELECT id, artist, album, releasedate, data1, data2, data3, data4, data5 FROM top_songsdb.Top5000 WHERE id BETWEEN 1 and 300;";
  var smeakql = "SELECT id, artist, album, releasedate, data1, data2, data3, data4, data5 FROM top_songsdb.Top5000 WHERE album = 'White Christmas';";
  
  con.query(sml, function (err, result) {
    if (err) throw err;

    console.log(result);

    inquirer.prompt([
      {
        name: "decision",
        type: "rawlist",
        message: "Would you like to make a purchase?",
        choices: ["yes", "no"]
      }
      // }
    ]).then(function(answer) {
     
      if (answer.decision.toUpperCase() === "YES") {
        makepurchase();
      }
      else {

        console.log(answer);
      }
    });

    function makepurchase() {
      // prompt for info about the item being put up for auction
      inquirer
        .prompt([
          {
            name: "item",
            type: "rawlist",
            message: "What is the id of the item you would like to purchase?",
            choices: ["1", "2","3","4","5","6","7","8","9","10"]
            
          },
          {
            name: "amount",
            type: "input",
            message: "How many would you like to buy?",
            validate: function(value) {
                  if (isNaN(value) === false) {
                    return true;
                  }
                  return false;
                }
          }
        ])
        .then(function(answer) {
          var integer = parseInt(answer.item, 10);
          var stockQuantity = result[integer-1].stock_quantity;
          var currentId = result[integer - 1].item_id;

          if (stockQuantity < answer.amount){
            console.log('There are not enough items in innvetory.')

          }

          else {
            var databasestring = String('UPDATE products SET stock_quantity = ' + (stockQuantity - answer.amount) + ' WHERE item_id = ' + currentId);

          // when finished prompting, insert a new item into the db with that info
          con.query(databasestring, function(err) {
              if (err) throw err;
              console.log("Your purchase was made!");
              // re-prompt the user for if they want to bid or post
              start();
            });

          }

          
        });
    }


  });


  };

  
});

