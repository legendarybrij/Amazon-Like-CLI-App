drop database if exists bamazon;

CREATE database bamazon;
USE bamazon;
CREATE table products (
item_id INT not null auto_increment,
product_name varchar(200),
department_name varchar(200),
price FLOAT(10,2) null,
stock_quantity INT null,
primary key(item_id) 
);

-- USE bamazon;
-- CREATE table departments (
-- department_id INT not null auto_increment,
-- department_name varchar(200),
-- over_head_costs INT null
-- primary key(department_id) 
-- );


USE bamazon;
INSERT into products(product_name, department_name, price, stock_quantity)
values("Apple 13 MacBook Air", "Electronics", 1199.99, 10), 
("Microsoft Surface Laptop 2", "Electronics", 1399.99, 7),
("ASICS Mens JB Elite V2.0 Wrestling Shoe", "Shoes", 105.06, 5),
("Adidas Mens Combat Speed.5", "Shoes", 101.29, 0),
("Samsung Galaxy S10+", "Cell Phones", 1199.99, 1000),
("Apple iPhone X", "Cell Phones", 1199, 100),
("Samsung 75-inch Q90R QLED SMART 4k TV", "Televisions", 7499.98 , 6),
("Sony XBR70X830F 70-Inch 4K Ultra HD Smart LED TV", "Televisions", 1998.00, 50),
("Aquaman 2019", "Movies & TV Blu-ray", 24.99, 100000),
("Fantastic Beasts: The Crimes of Grindelwald 2018", "Movies & TV Blu-ray", 24.99, 1000000);
ALTER TABLE products ADD UNIQUE (product_name, department_name);

-- ******************To use proper name for column and sort it alphabetically**************
-- SELECT
--  product_name `Product Name`
-- FROM
--  products
-- ORDER BY
--  `Product Name`;
-- ******************To use proper name for column and sort it alphabetically**************

-- SELECT item_id, product_name, price from products where item_id=1;
-- SELECT product_name from products where product_name="apple 13 macbook air";
-- INSERT into products (product_name, department_name, price) VALUES ("Home Theater","Electronics",400);
SELECT * from products;






 