USE zontli;


CREATE TABLE user(
  user_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  brith_date DATE NOT NULL,
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
  
);