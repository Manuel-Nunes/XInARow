--EXEC sp_configure 'contained database authentication', 1;
--RECONFIGURE;
--GO

CREATE DATABASE XInARowAuth
CONTAINMENT = PARTIAL;
GO
USE XInARowAuth;
GO

CREATE TABLE [User]
(
	userID INT IDENTITY(1,1) PRIMARY KEY,
	email VARCHAR(320) UNIQUE NOT NULL,
	[password] VARCHAR(128) NOT NULL, -- to be hashed
	memberName VARCHAR(128) UNIQUE NOT NULL,
	salt VARCHAR(10) NOT NULL
);
GO
--SP
--Create user
CREATE PROC sp_user
	@email VARCHAR(320),
	@password VARCHAR(128),
	@memberName VARCHAR(128),
	@salt VARCHAR(10)
AS
	INSERT INTO [User]
	VALUES (@email, @password, @memberName, @salt);
	SELECT @memberName AS memberName;
GO

--Check if user exists
CREATE PROC sp_user_exist
	@email VARCHAR(320)
AS
	SELECT [password], salt
	FROM [User]
	WHERE email = @email;
GO

--Get username
CREATE PROC sp_username
	@email VARCHAR(320)
AS
	SELECT memberName 
	FROM [User]
	WHERE email = @email;
GO

CREATE USER AuthServer
WITH PASSWORD = '<YOUR_PASSWORD_HERE>'
GO

GRANT EXECUTE ON sp_user TO AuthServer;
GRANT EXECUTE ON sp_user_exist TO AuthServer;
GRANT EXECUTE ON sp_user_username TO AuthServer;
GO

DENY ALTER ON OBJECT::[User] TO AuthServer;
DENY REFERENCES ON OBJECT::[User] TO AuthServer;
DENY CONTROL ON OBJECT::[User] TO AuthServer;
DENY TAKE OWNERSHIP ON OBJECT::[User] TO AuthServer;
GO

-- Create table prevent
CREATE TRIGGER TR_SEC_Create
ON DATABASE
FOR CREATE_TABLE
AS
BEGIN
	PRINT 'You cannot create a table'
	ROLLBACK
END
GO

ENABLE TRIGGER TR_SEC_Create ON DATABASE;
GO

-- Alter table prevent
CREATE TRIGGER TR_SEC_Alter
ON DATABASE
FOR ALTER_TABLE
AS
BEGIN
	PRINT 'You cannot alter this table'
	ROLLBACK
END
GO

ENABLE TRIGGER TR_SEC_Alter ON DATABASE;
GO

-- Drop table prevent
CREATE TRIGGER TR_SEC_Drop
ON DATABASE
FOR DROP_TABLE
AS
BEGIN
	Print 'You cannot drop this table'
	ROLLBACK
END
GO

ENABLE TRIGGER TR_SEC_Drop ON DATABASE;
GO