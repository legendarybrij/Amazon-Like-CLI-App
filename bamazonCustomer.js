var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "mynameisb",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  display();
  search();
});

// Include the ids, names, and prices of products for sale.

function display() {
    var query = "SELECT item_id, product_name, price from products GROUP BY item_id";
    connection.query(query, function(err, res) {
        console.log("\n");
        for (var i = 0; i < res.length; i++) {
          console.log(chalk.bold.yellowBright(res[i].item_id)+" | "+chalk.bold.greenBright(res[i].product_name)+chalk.bold.cyanBright("  Price: $"+res[i].price));
        }
    });
}


function search() {
    // *********************************Asking First Time************************************** 
    inquirer 
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "input",
                message: chalk.yellowBright("Please enter the ID of the product you would like to buy?"),
                name: "itemID",
            }, 
            {
                type: "input",
                message:chalk.greenBright("How many units of the product do you would like to buy?"),
                name: "itemUnits"
            },
            {
                name: "confirm",
                type: "list",
                message: chalk.red("Are you sure you want to buy this product?"),
                choices: [
                    "YES",
                    "NO"
                ]
              }

        ]).then(function(response) {
        //console.log(isNaN(response.itemID)+" "+isNaN(response.itemUnits));
        if (response.confirm==="YES" && isNaN(response.itemID)===false && isNaN(response.itemUnits)===false && response.itemID.trim()!=="" && response.itemUnits.trim()!=="") {
          
           selectItem(parseFloat(response.itemID.trim()),parseFloat(response.itemUnits.trim()));
           
           // *********************************Asking Second Time************************************** 
           stillContinue();
           // *********************************Ending Asking Second Time************************************** 

        }else{
            // *********************************Asking First Time Continue if Yes**************************************
            display();
            search();
        }    
             
        });

    
    
}

function selectItem(itemNum,quantity){
    var query = "SELECT item_id, product_name, price, stock_quantity from products where item_id="+itemNum;
    
    connection.query(query, function(err, res) {
        console.log("\n");
        if(res[0].stock_quantity>=quantity)
        {    
        console.log(chalk.bold.yellowBright(quantity)+" | "+chalk.bold.greenBright(res[0].product_name)+chalk.bold.cyanBright("  Price: $"+res[0].price));
        let subtotal =res[0].price * quantity;
        console.log(chalk.bold.yellowBright("Subtotal: "+quantity+" x "+res[0].price+" = "+chalk.bold.cyanBright("$"+(subtotal))));
        let gst = 0.13*res[0].price * quantity;
        console.log(chalk.bold.yellowBright("GST/PST: "+chalk.bold.cyanBright("$"+(gst))));
        console.log(chalk.bold.yellowBright("Total: "+chalk.bold.cyanBright("$"+(subtotal+gst))));
        console.log(chalk.bold.magentaBright("Thanks for shopping with us Today!!"));

        updateQuantity(itemNum,quantity); 
        }else{
            console.log(chalk.bold.magentaBright("Sorry we have stock at the moment. Please try again next week."));
        }
    });
}

function updateQuantity(itemNum,quantity) {
    let currQuantity = 0;
    // let currQuantity = readQuantity(itemNum);
    // *********************************Reading Stock Query**************************************
    connection.query("SELECT stock_quantity FROM products where item_id="+itemNum, function(err, res) {
              if (err) throw err;
              currQuantity=res[0].stock_quantity;
              //console.log("Read Quantity: " +currQuantity);
              // *********************************Updating Query**************************************
                    var query = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                        {
                            stock_quantity: currQuantity - quantity
                        },
                        {
                            item_id: itemNum
                        }
                        ],
                        function(err, res) {
                        
                        });
            // *********************************Updating Query END**************************************
            });
    // *********************************Reading Stock Query END**************************************
    
   


}



function stillContinue(){
    // *********************************Asking Second Time************************************** 
    inquirer
    .prompt([
        // Here we create a basic text prompt.
        {
            name: "confirm",
            type: "list",
            message: chalk.greenBright("Do you still want to continue shopping with us?"),
            choices: [
                "YES",
                "NO"
            ]
            }

    ]).then(function(response) {
        if (response.confirm==="YES") {
            display();
            search();
        }else{
            connection.end();
        }
        
    });
}

// Modifiers
// reset
// bold
// dim
// italic (Not widely supported)
// underline
// inverse
// hidden
// strikethrough (Not widely supported)
// visible (Text is emitted only if enabled)

// Colors
// black
// red
// green
// yellow
// blue (On Windows the bright version is used since normal blue is illegible)
// magenta
// cyan
// white
// gray ("bright black")
// redBright
// greenBright
// yellowBright
// blueBright
// magentaBright
// cyanBright
// whiteBright

// Background colors
// bgBlack
// bgRed
// bgGreen
// bgYellow
// bgBlue
// bgMagenta
// bgCyan
// bgWhite
// bgBlackBright
// bgRedBright
// bgGreenBright
// bgYellowBright
// bgBlueBright
// bgMagentaBright
// bgCyanBright
// bgWhiteBright