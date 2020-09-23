CREATE DATABASE IF NOT EXISTS PostOffice default character set utf8 collate utf8_general_ci;
-- select database
USE PostOffice;
-- drop existing tables
DROP TABLE IF EXISTS Package;
DROP TABLE IF EXISTS Batch;
DROP TABLE IF EXISTS States;
-- create table Posts
CREATE TABLE Package(
	seq INTEGER,
	packageId VARCHAR(40),
	channel VARCHAR(40),
	customerName VARCHAR(40) DEFAULT "无",
	customerPhone VARCHAR(40) DEFAULT "无",
	brandName VARCHAR(40) DEFAULT "无",
	brandNameChinese VARCHAR(40) DEFAULT "无",
	quantity INTEGER DEFAULT -1,
	unitPrice FLOAT DEFAULT 0.,
	dimension VARCHAR(40) DEFAULT "无",
	unit VARCHAR(40) DEFAULT "无",
	weight FLOAT DEFAULT 0.,
	insuredAmount FLOAT DEFAULT 0.,
	insuranceFee FLOAT DEFAULT 0.,
	customTax FLOAT DEFAULT 0.,
	receiverName VARCHAR(40) DEFAULT "无",
	receiverPhone VARCHAR(40) DEFAULT "无",
	receiverProvince VARCHAR(40) DEFAULT "无",
	receiverCity VARCHAR(40) DEFAULT "无",
	receiverAddress VARCHAR(500) DEFAULT "无",
	receiverZIP VARCHAR(20) DEFAULT "无",
	receiverId VARCHAR(20) DEFAULT "无",
	transferCompany VARCHAR(40) DEFAULT "无",
	transferPackageId VARCHAR(40) DEFAULT "无",
	created TIMESTAMP DEFAULT '2000-01-01 00:00:00',
	SKU VARCHAR(40) DEFAULT "无",
	comment VARCHAR(500) DEFAULT "",
	UNIQUE (packageId, seq),
	PRIMARY KEY(packageId)
) default charset = utf8;
CREATE TABLE Batch(
	packageId VARCHAR(40),
	batchName VARCHAR(40),
	created TIMESTAMP DEFAULT '2000-01-01 00:00:00',
	PRIMARY KEY(packageId),
	INDEX batchIndex (batchName(40))
) default charset = utf8;
CREATE TABLE States(
	batchName VARCHAR(40),
	description VARCHAR(100),
	updated TIMESTAMP DEFAULT '2000-01-01 00:00:00',
	PRIMARY KEY(batchName, description)
) default charset = utf8;
-- [mysql]
-- default-character-set=utf8
-- [mysqld]
-- character-set-server=utf8