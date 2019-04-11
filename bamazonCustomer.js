var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');
const yellow = chalk.bold.yellowBright;
const green = chalk.bold.greenBright;
const cyan = chalk.bold.cyanBright;
const red = chalk.redBright;
const magenta = chalk.bold.magentaBright;
//var Table = require('cli-table3');

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
   // var table = new Table({style:{border:[],header:[]}});

    
    var query = "SELECT item_id 'Item ID', product_name 'Product Name', price 'Price' from products GROUP BY item_id";
    connection.query(query, function(err, res) {
        console.log("\n");
        console.table(res);
    });
}


function search() {
    // *********************************Asking First Time************************************** 
    inquirer 
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "input",
                message: yellow("Please enter the ID of the product you would like to buy?"),
                name: "itemID",
            }, 
            {
                type: "input",
                message:green("How many units of the product do you would like to buy?"),
                name: "itemUnits"
            },
            {
                name: "confirm",
                type: "list",
                message: red("Are you sure you want to buy this product?"),
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
            console.log(red("Please enter valid integer or number for Product ID and Units"));
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
        console.log(yellow(quantity)+" | "+green(res[0].product_name)+cyan("  Price: $"+res[0].price));
        let subtotal =res[0].price * quantity;
        console.log(yellow("Subtotal: "+quantity+" x "+res[0].price+" = "+cyan("$"+(subtotal))));
        let gst = 0.13*res[0].price * quantity;
        console.log(yellow("GST/PST: "+cyan("$"+(gst))));
        console.log(yellow("Total: "+cyan("$"+(subtotal+gst))));
        console.log(magenta("Thanks for shopping with us Today!!"));

        updateQuantity(itemNum,quantity); 
        }else{
            console.log(magenta("Sorry we don't have stock at the moment. Please try again next week."));
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
            message: green("Do you still want to continue shopping with us?"),
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