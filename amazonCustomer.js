var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "amazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    displayItems();
});


function displayItems() {
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;
        console.table(res)
        orderPrompt();
    });
}

function orderPrompt() {
    inquirer.prompt([
        {
            name: "productSelection",
            type: "input",
            message: "Please enter the item id for the item you'd like to buy",
            filter: Number
        },
        {
            name: "productSelectionQuantity",
            type: "input",
            message: "How many items would you like to purchase?",
            filter: Number
        }

    ]).then(function (answer) {
        var requestedQuantity = answer.productSelectionQuantity;
        var requestedItem = answer.productSelection;
        placeOrder(requestedItem, requestedQuantity);
    });

}

function placeOrder(id, amount) {
    connection.query("SELECT * FROM products WHERE item_id = " + id, function (err, res) {
        if (err) throw err;
        if (amount <= res[0].stock_quantity) {
            var amountOwed = res[0].price * amount;
            console.log("Processing your order...");
            console.log("You owe: " + amountOwed + " dollars");
            console.log("-------------------------------\n")

           
            connection.query("UPDATE products SET stock_quantity = stock_quantity -" + amount + " WHERE item_id = " + id, function (err, res) {
            displayItems();
 
            });

            //   console.log(statement.sql);
        }
        else {
            console.log("Out of Stock");
            displayItems();
        }
    });
}