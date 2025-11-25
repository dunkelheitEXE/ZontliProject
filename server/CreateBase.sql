CREATE DATABASE zontli;

DROP DATABASE zontli;

USE zontli;

CREATE TABLE admins (
  admin_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(500) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY(admin_id)
);

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
  movement_type ENUM('deposit','withdrawal','transfer','initial balance') NOT NULL,
  status BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY(movement_id),
  FOREIGN KEY(source_account_id) REFERENCES accounts(account_id),
  FOREIGN KEY(destination_account_id) REFERENCES accounts(account_id)
);


DELIMITER $$
CREATE PROCEDURE doTransfer(
    IN in_amount DECIMAL(10,2),
    IN in_account INT,
    IN in_to INT,
    IN in_concept VARCHAR(255)
)
BEGIN
  DECLARE current_balance DECIMAL(10,2);
  DECLARE account_exists INT;
  
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Validate inputs
  IF in_amount <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Amount must be positive';
  END IF;
  
  IF in_account = in_to THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot transfer to same account';
  END IF;
  
  -- Check if source account exists and has sufficient funds
  SELECT COUNT(*), COALESCE(MAX(balance), 0) 
  INTO account_exists, current_balance
  FROM accounts 
  WHERE account_id = in_account
  FOR UPDATE;
  
  IF account_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Source account does not exist';
  END IF;
  
  IF current_balance < in_amount THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient funds';
  END IF;
  
  -- Check if destination account exists
  SELECT COUNT(*) INTO account_exists
  FROM accounts 
  WHERE account_id = in_to
  FOR UPDATE;
  
  IF account_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Destination account does not exist';
  END IF;
  
  -- Perform transfer
  UPDATE accounts SET balance = balance - in_amount WHERE account_id = in_account;
  INSERT INTO movements (source_account_id, destination_account_id, amount, `date`, concept, movement_type, status)
  VALUES (in_account, in_to, in_amount, NOW(), in_concept, 'transfer', 1);
  UPDATE accounts SET balance = balance + in_amount WHERE account_id = in_to;
  
  COMMIT;
END $$

DELIMITER ;