const mysql = require("mysql");
const inquirer = require("inquirer");

let start = () => {
  connection.query("SELECT * FROM products", (err, results) => {
    if (err) throw err;

    results.forEach(element => {
      console.log("--------------------");
      console.log("Product id: " + element.id);
      console.log("Product name: " + element.product_name);

      console.log("Price: $" + element.price);
      console.log("Stock: " + element.stock_quantity);
    });
    console.log("--------------------");
    purchasing();
  });
};

let purchasing = () => {
  inquirer
    .prompt([
      {
        type: "number",
        name: "product",
        message:
          "What is the id of the product that you would like to purchase?"
      },
      {
        type: "number",
        name: "quantity",
        message: "How many would you like to purchase?"
      }
    ])
    .then(answers => {
      changingTableData(answers.product, answers.quantity);
    });
};

let changingTableData = (productID, productQuantity) => {
  connection.query(
    "SELECT * FROM products WHERE id = " + productID,
    (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        console.log("Product not found. Use a different ID.");
        setTimeout(start, 3000);
      } else if (
        results[0].stock_quantity < productQuantity ||
        productQuantity < 0
      ) {
        console.log("Insufficient quantity.");
        setTimeout(start, 3000);
      }
    }
  );
};

let connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon_db"
});

connection.connect(err => {
  if (err) throw err;

  start();
});
