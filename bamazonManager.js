var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');
const yellow = chalk.bold.yellowBright;
const green = chalk.bold.greenBright;
const cyan = chalk.bold.cyanBright;
const red = chalk.redBright;
const blue = chalk.bold.blueBright;
const magenta = chalk.bold.magentaBright;

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
  menuOptions();
});

function menuOptions() {
    
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: yellow("What would you like to do?"),
      choices: [
        green("View Products for Sale"),
        red("View Low Inventory"),
        blue("Add to Inventory"),
        cyan("Add New Product"),
        magenta("exit")
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case green("View Products for Sale"):
        viewProducts();
        break;

      case red("View Low Inventory"):
        viewLowInventory();
        break;

      case blue("Add to Inventory"):
        addInventory();
        break;

      case cyan("Add New Product"):
        addNewProduct();
        break;
          
      case magenta("exit"):
        connection.end();
        break;
      }
    });
}



function viewProducts(){
         
         var query = "SELECT item_id, product_name, price, stock_quantity from products GROUP BY item_id";
         connection.query(query, function(err, res) {
             console.log("\n");
             for (var i = 0; i < res.length; i++) {
               console.log(yellow(res[i].item_id)+" | "+green(res[i].product_name)+cyan("  Price: $"+res[i].price)+magenta("  Quantity: "+res[i].stock_quantity));
             }
         });
         back();
}


function viewLowInventory(){
         
    var query = "SELECT item_id, product_name, price, stock_quantity from products GROUP BY item_id having stock_quantity<6";
    connection.query(query, function(err, res) {
        console.log("\n");
        for (var i = 0; i < res.length; i++) {
          console.log(yellow(res[i].item_id)+" | "+green(res[i].product_name)+cyan("  Price: $"+res[i].price)+magenta("  Quantity: "+res[i].stock_quantity));
        }
    });
    back();

}

function back() {
    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: yellow("What would you like to do now?"),
      choices: [
        green("Go Back to Menu Options"),
        magenta("exit")
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case green("Go Back to Menu Options"):
       menuOptions();
        break;
          
      case magenta("exit"):
        connection.end();
        break;
      }
    });
}

function addInventory(){
    inquirer
    .prompt([
        {
            name: "add",
            type: "input",
            message: green("Which item would you like to add? Please write its ID.")
        },
        {
            name: "addQuantity",
            type: "input",
            message: magenta("How many quantity would you like to add?")
        }
    ])
    .then(function(answer) {
      if(isNaN(answer.add.trim())===false && answer.add.trim()!=="" && isNaN(answer.addQuantity.trim())===false && answer.addQuantity.trim()!=="")
      {
        let itemID = answer.add.trim();
        let quantity = parseFloat(answer.addQuantity.trim());
        // *********************************Reading Stock Query**************************************
            connection.query("SELECT stock_quantity FROM products where item_id="+itemID, function(err, res) {
                if (err) throw err;
                let currQuantity=res[0].stock_quantity;
                //console.log("Read Quantity: " +currQuantity);
                // *********************************Updating Query**************************************
                    var query = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                        {
                            stock_quantity: currQuantity + quantity
                        },
                        {
                            item_id: itemID
                        }
                        ],
                        function(err, res) {
                            console.log("\nUpdated Rows: "+res.affectedRows);
                        });
            // *********************************Updating Query END**************************************
            });
        // *********************************Reading Stock Query END**************************************
        back();
      }else{
        console.log(red("Please enter only integer or number"));
          addInventory();
      }
    });

}


function addNewProduct(){
    
    inquirer
    .prompt([
        {
            name: "name",
            type: "input",
            message: green("What is the name of the product?")
        },
        {
            name: "department",
            type: "input",
            message: magenta("Which department will the product go?")
        },
        {
            name: "price",
            type: "input",
            message: cyan("What is the price of the product in integer/number?")
        }
    ])
    .then(function(answer) {
        console.log("Price: "+answer.price.trim()+" Name: "+answer.name.trim()+" DEpartment: "+answer.department.trim());
        if(isNaN(answer.price.trim())===false && answer.price.trim()!=="" && isNaN(answer.name.trim())===true && answer.name.trim()!=="" && isNaN(answer.department.trim())===true && answer.department.trim()!=="" )
        {
            var query = connection.query(
                "INSERT into products (product_name, department_name, price) VALUES (?,?,?)",
                [
                {
                     product_name: answer.name.trim()
                },
                {
                     department_name: answer.department.trim()
                },
                {
                     price: answer.price.trim()
                }
                ],
                function(err, res) {
                    console.log("\nUpdated Rows: "+res.affectedRows);
                });
            back();    
        }else {
            console.log(red("Please enter valid input"));
            addNewProduct();
        }
    });
}
