CREATE DATABASE zontli;

DROP DATABASE zontli;

USE zontli;

CREATE TABLE user(
  user_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  curp VARCHAR(18) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  password VARCHAR(255) NOT NULL,
  register_date DATETIME NOT NULL,
  PRIMARY KEY(user_id)
);

CREATE TABLE address (
  address_id BIGINT AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  street VARCHAR(255) NOT NULL,
  external_number VARCHAR(10) NOT NULL,
  internal_number VARCHAR(10),
  neighborhood VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  state VARCHAR(255) NOT NULL,
  PRIMARY KEY(address_id),
  FOREIGN KEY(user_id) REFERENCES user(user_id)
);

CREATE TABLE accounts(
  account_id BIGINT AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  account_type ENUM('debit','credit') NOT NULL,
  balance DECIMAL(15,2) NOT NULL,
  date DATETIME NOT NULL,
  opening_date DATETIME NOT NULL,
  status BOOLEAN NOT NULL DEFAULT FALSE,
  credit_limit DECIMAL(15,2),
  PRIMARY KEY(account_id),
  FOREIGN KEY(user_id) REFERENCES user(user_id)
);

CREATE TABLE cards(
  card_id BIGINT AUTO_INCREMENT,
  account_id BIGINT NOT NULL,
  card_number DECIMAL(16,0) NOT NULL,
  expiration_date DATE NOT NULL,
  cvv DECIMAL(3,0) NOT NULL,
  nip DECIMAL(4,0) NOT NULL,
  is_digital BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY(card_id),
  FOREIGN KEY(account_id) REFERENCES accounts(account_id)
);

CREATE TABLE contacts(
  contact_id BIGINT AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  nickname VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  destination_clabe DECIMAL(18,0) NOT NULL,
  destination_bank VARCHAR(255) NOT NULL,
  PRIMARY KEY(contact_id),
  FOREIGN KEY(user_id) REFERENCES user(user_id)
);

CREATE TABLE movements(
  movement_id BIGINT AUTO_INCREMENT,
  source_account_id BIGINT NOT NULL,
  destination_account_id BIGINT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  date DATETIME NOT NULL,
  concept VARCHAR(255) NOT NULL,
  movement_type ENUM('deposit','withdrawal','transfer') NOT NULL,
  status BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY(movement_id),
  FOREIGN KEY(source_account_id) REFERENCES accounts(account_id),
  FOREIGN KEY(destination_account_id) REFERENCES accounts(account_id)
);

