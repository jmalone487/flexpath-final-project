create database if not exists flexpath_final;
use flexpath_final;

set foreign_key_checks = 0;

drop table if exists products;
drop table if exists categories;
drop table if exists roles;
drop table if exists users;

set foreign_key_checks = 1;


-- USERS
create table users (
    username varchar(255) primary key,
    password varchar(255) not null
);


-- ROLES
create table roles (
    username varchar(255) not null,
    role varchar(250) not null,
    primary key (username, role),
    foreign key (username)
        references users(username)
        on delete cascade
);


-- CATEGORIES
create table categories (
    id int auto_increment primary key,
    name varchar(255) not null,
    description varchar(500),
    is_public boolean default true,
    username varchar(255) not null,

    foreign key (username)
        references users(username)
        on delete cascade
);


-- PRODUCTS
create table products (
    id int auto_increment primary key,
    name varchar(255) not null,
    description varchar(500),
    price decimal(10, 2) not null,
    quantity int not null default 0,
    is_public boolean default true,
    username varchar(255) not null,
    category_id int,

    foreign key (username)
        references users(username)
        on delete cascade,

    foreign key (category_id)
        references categories(id)
        on delete set null
);


-- STARTER USERS
insert into users (username, password)
values (
    'admin',
    '$2a$10$tBTfzHzjmQVKza3VSa5lsOX6/iL93xPVLlLXYg2FhT6a.jb1o6VDq'
);

insert into roles (username, role)
values ('admin', 'ADMIN');


insert into users (username, password)
values (
    'user',
    '$2a$10$tBTfzHzjmQVKza3VSa5lsOX6/iL93xPVLlLXYg2FhT6a.jb1o6VDq'
);

insert into roles (username, role)
values ('user', 'USER');


-- STARTER CATEGORIES
insert into categories (name, description, is_public, username)
values
(
    'Electronics',
    'Phones, computers, accessories, and other electronics.',
    true,
    'admin'
),
(
    'Home & Living',
    'Products for the home and everyday living.',
    true,
    'admin'
),
(
    'Fashion',
    'Clothing, shoes, and accessories.',
    true,
    'admin'
);


-- STARTER PRODUCTS
insert into products
(name, description, price, quantity, is_public, username, category_id)
values
(
    'Wireless Headphones',
    'Bluetooth wireless headphones with comfortable ear cushions.',
    59.99,
    15,
    true,
    'admin',
    1
),
(
    'Laptop Backpack',
    'Durable backpack with a padded laptop compartment.',
    39.99,
    20,
    true,
    'admin',
    3
),
(
    'Coffee Maker',
    'Compact coffee maker designed for everyday home use.',
    49.99,
    10,
    true,
    'admin',
    2
);