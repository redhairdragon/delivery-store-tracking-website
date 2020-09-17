CREATE DATABASE IF NOT EXISTS PostOffice;
-- select database
USE PostOffice;
-- drop existing tables
DROP TABLE IF EXISTS Package;
DROP TABLE IF EXISTS Batch;
DROP TABLE IF EXISTS States;
-- create table Posts
CREATE TABLE Package(
	packageId VARCHAR(40),
	customerName VARCHAR(40),
	brandName VARCHAR(40),
	brandNameChinese VARCHAR(40),
	catergory VARCHAR(40),
	senderPhone VARCHAR(40),
	quantity INTEGER,
	unitPrice FLOAT,
	weight FLOAT,
	insuranceFee FLOAT,
	insuredAmount FLOAT,
	customTax FLOAT,
	receiverPhone VARCHAR(40),
	receiverProvince VARCHAR(40),
	receiverCity VARCHAR(40),
	receiverAddress VARCHAR(500),
	receiverZIP VARCHAR(20),
	comment VARCHAR(500),
	created TIMESTAMP DEFAULT '2000-01-01 00:00:00',
	PRIMARY KEY(customerName, packageId)
) default charset = utf8;

CREATE TABLE Batch(
	packageId VARCHAR(40),
	batchId INTEGER,
	modified TIMESTAMP DEFAULT '2000-01-01 00:00:00',
	created TIMESTAMP DEFAULT '2000-01-01 00:00:00',
	PRIMARY KEY(batchid)
);

CREATE TABLE States(
	packageId VARCHAR(40),
	description VARCHAR(100),
	updated TIMESTAMP DEFAULT '2000-01-01 00:00:00'
) default charset = utf8;