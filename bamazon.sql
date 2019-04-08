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

USE bamazon;
INSERT into products(product_name, department_name, price, stock_quantity)
values("Apple 13 MacBook Air", "Electronics", 1199.99, 10), 
("Microsoft Surface Laptop 2", "Electronics", 1399.99, 7),
("ASICS Men's JB Elite V2.0 Wrestling Shoe", "Shoes", 105.06, 5),
("Adidas Men's Combat Speed.5", "Shoes", 101.29, 0),
("Samsung Galaxy S10+", "Cell Phones", 1199.99, 1000),
("Apple iPhone X", "Cell Phones", 1199, 100),
("Samsung 75-inch Q90R QLED SMART 4k TV", "Televisions", 7499.98 , 6),
("Sony XBR70X830F 70-Inch 4K Ultra HD Smart LED TV", "Televisions", 1998.00, 50),
("Aquaman 2019", "Movies & TV Blu-ray", 24.99, 100000),
("Fantastic Beasts: The Crimes of Grindelwald 2018", "Movies & TV Blu-ray", 24.99, 1000000);

select * from products;






 