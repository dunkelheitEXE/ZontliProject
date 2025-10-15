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

DELIMITER $$

CREATE PROCEDURE sp_PerformTransaction(
    -- INPUT: Details of the transaction
    IN p_source_account_id BIGINT,
    IN p_destination_account_id BIGINT,
    IN p_amount DECIMAL(15,2),
    IN p_concept VARCHAR(255),
    IN p_movement_type ENUM('deposit','withdrawal','transfer'),
    
    -- OUTPUT: Results of the operation
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    -- Declare variables to hold account details
    DECLARE v_source_balance DECIMAL(15,2);
    DECLARE v_source_status BOOLEAN;
    DECLARE v_destination_exists INT;

    -- 🚨 Set up an error handler. If any query fails, it will automatically ROLLBACK.
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'An unexpected SQL error occurred. Transaction has been rolled back.';
    END;

    -- ====== 1. VALIDATION CHECKS ======

    -- Ensure the amount is a positive number
    IF p_amount <= 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Transaction amount must be greater than zero.';
        LEAVE sp_PerformTransaction; -- Exit the procedure
    END IF;

    -- Prevent transferring to the same account
    IF p_source_account_id = p_destination_account_id THEN
        SET p_success = FALSE;
        SET p_message = 'Source and destination accounts cannot be the same.';
        LEAVE sp_PerformTransaction;
    END IF;

    -- Fetch source account details and lock the row for the transaction
    SELECT balance, status INTO v_source_balance, v_source_status 
    FROM accounts 
    WHERE account_id = p_source_account_id FOR UPDATE;

    -- Check if source account is active and has enough funds
    IF v_source_status IS NULL THEN
        SET p_success = FALSE;
        SET p_message = 'Source account not found.';
        LEAVE sp_PerformTransaction;
    ELSEIF v_source_status = FALSE THEN
        SET p_success = FALSE;
        SET p_message = 'Source account is not active.';
        LEAVE sp_PerformTransaction;
    ELSEIF v_source_balance < p_amount THEN
        SET p_success = FALSE;
        SET p_message = 'Insufficient funds in the source account.';
        LEAVE sp_PerformTransaction;
    END IF;

    -- Check if the destination account exists and is active
    SELECT COUNT(*) INTO v_destination_exists 
    FROM accounts 
    WHERE account_id = p_destination_account_id AND status = TRUE;
    
    IF v_destination_exists = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Destination account not found or is not active.';
        LEAVE sp_PerformTransaction;
    END IF;

    -- ====== 2. EXECUTE TRANSACTION ======

    -- Start the transaction block
    START TRANSACTION;

    -- Subtract amount from the source account
    UPDATE accounts 
    SET balance = balance - p_amount 
    WHERE account_id = p_source_account_id;

    -- Add amount to the destination account
    UPDATE accounts 
    SET balance = balance + p_amount 
    WHERE account_id = p_destination_account_id;

    -- Record the transaction in the movements table
    INSERT INTO movements (source_account_id, destination_account_id, amount, date, concept, movement_type, status)
    VALUES (p_source_account_id, p_destination_account_id, p_amount, NOW(), p_concept, p_movement_type, TRUE);

    -- If all queries succeeded, commit the changes
    COMMIT;

    -- Set success output parameters
    SET p_success = TRUE;
    SET p_message = 'Transaction completed successfully.';

END$$

DELIMITER ;