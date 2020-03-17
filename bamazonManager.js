const mysql = require("mysql");
const inquirer = require("inquirer");

const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "start-list",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add/Subtract from Inventory",
          "Add New Product"
        ],
        message: "Choose an option."
      }
    ])
    .then(answer => {
      switch (answer["start-list"]) {
        case "View Products for Sale":
          return viewProducts();
        case "View Low Inventory":
          return viewLowInventory();
        case "Add/Subtract from Inventory":
          return addInventory();
        case "Add New Product":
          return addProduct();
      }
    });
};

const viewProducts = () => {
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
    return exitFunction();
  });
};

const viewLowInventory = () => {
  connection.query("SELECT * FROM products", (err, results) => {
    if (err) throw err;

    results.forEach(element => {
      if (element.stock_quantity <= 5) {
        console.log("--------------------");
        console.log("Product id: " + element.id);
        console.log("Product name: " + element.product_name);

        console.log("Price: $" + element.price);
        console.log("Stock: " + element.stock_quantity);
      }
    });
    console.log("--------------------");
    return exitFunction();
  });
};

const addInventory = () => {
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

    inquirer
      .prompt([
        {
          type: "number",
          name: "id",
          message:
            "What is the id number of the product you want to add stock to?"
        },
        {
          type: "number",
          name: "stock",
          message:
            "How many more units would you like to add/subtract to the current units?"
        }
      ])
      .then(answers => {
        connection.query(
          "SELECT id, stock_quantity, product_name FROM products where id = " +
            answers.id,
          (err, results) => {
            if (err) throw err;

            let productName = results[0].product_name;

            if (results.length === 0) {
              console.log("There is no product with that id.");
              return exitFunction();
            } else {
              let tempQuantity = results[0].stock_quantity;
              connection.query(
                "UPDATE products SET stock_quantity = " +
                  (tempQuantity + answers.stock) +
                  " WHERE id = " +
                  answers.id +
                  ";",
                (err, results) => {
                  if (err) throw err;

                  console.log(
                    "The stock for " + productName + " is now updated"
                  );
                  return exitFunction();
                }
              );
            }
          }
        );
      });
  });
};

const addProduct = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the new products name?"
      },
      {
        type: "input",
        name: "department",
        message: "What the department for the product you want to add?"
      },
      {
        type: "number",
        name: "price",
        message: "What is the price of the product that you want to add?"
      },
      {
        type: "number",
        name: "stock",
        message:
          "What is the current stock of the product that you would like to add?"
      }
    ])
    .then(answers => {
      if (isNaN(answers.price)) {
        console.log("The price you inputted wasn't a number.");
        return exitFunction();
      } else if (isNaN(answers.stock)) {
        console.log("The stock quantity that you inputted wasn't a number.");
        return exitFunction();
      } else {
        connection.query(
          "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" +
            answers.name +
            "', '" +
            answers.department +
            "', " +
            answers.price +
            ", " +
            answers.stock +
            ");",
          (err, results) => {
            if (err) throw err;
            console.log("Product has been successfully added.");
            return exitFunction();
          }
        );
      }
    });
};

const exitFunction = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "exit",
        message: "Would you like to exit the program?"
      }
    ])
    .then(answer => {
      if (answer.exit === false) {
        return start();
      } else {
        console.log("Goodbye.");
        process.exit();
      }
    });
};

const connection = mysql.createConnection({
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
