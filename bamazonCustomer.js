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
  });
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
