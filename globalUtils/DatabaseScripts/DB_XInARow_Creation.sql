--EXEC sp_configure 'contained database authentication', 1;
--RECONFIGURE;
--GO

--TODO: Restrictions on views

CREATE DATABASE XInARow
CONTAINMENT = PARTIAL;
GO
USE XInARow;
GO

--Tables
CREATE TABLE Member
(
	memberID INT IDENTITY(1,1) PRIMARY KEY,
	memberName VARCHAR(128) UNIQUE NOT NULL,
);
GO

CREATE TABLE [Image]
(
	imageID INT IDENTITY(1,1) PRIMARY KEY,
	imageURL VARCHAR(330) NOT NULL
);
GO

CREATE TABLE [Profile]
(
	profileID INT IDENTITY(1,1) PRIMARY KEY,
	username VARCHAR(64) NOT NULL,
	imageID INT,
	memberID INT NOT NULL,

	CONSTRAINT FK_memberID
		FOREIGN KEY (memberID) REFERENCES Member(memberID),

	CONSTRAINT FK_profileImage
		FOREIGN KEY (imageID) REFERENCES [Image](imageID)
);
GO

/*
	0 - draw
	1 - player 1 wins
	2- player 2 wins
*/
CREATE TABLE Game
(
	gameID INT IDENTITY(1,1) PRIMARY KEY,
	result VARCHAR(1) DEFAULT '0' CHECK (result IN ('0','1','2')),
	player1 INT NOT NULL,
	player2 INT NOT NULL,
	TMSTAMP DATETIME DEFAULT GETDATE(),

	CONSTRAINT FK_player1
		FOREIGN KEY (player1) REFERENCES [Profile](profileID),

	CONSTRAINT FK_player2
		FOREIGN KEY (player2) REFERENCES [Profile](profileID)
);
GO

/*
Get the results as player 1 and player 2, for player 1, wld 1/2/0, for player 2, wld 2/1/0
*/

CREATE VIEW v_player_wld
AS
	SELECT p.memberID, COUNT(CASE WHEN g.result LIKE '0' THEN 1 ELSE 0 END) [P1_Draws],
	COUNT(CASE WHEN g.result LIKE '1' THEN 1 ELSE 0 END) [P1_Wins], COUNT(CASE WHEN g.result LIKE '2' THEN 1 ELSE 0 END) [P1_Losses],
	COUNT(CASE WHEN pl2.result LIKE '0' THEN 1 ELSE 0 END) [P2_Draws], COUNT(CASE WHEN pl2.result LIKE '1' THEN 1 ELSE 0 END) [P2_Losses],
	COUNT(CASE WHEN pl2.result LIKE '2' THEN 1 ELSE 0 END) [P2_Wins], p.profileID, p.username, i.imageURL
	FROM [Profile] p
	INNER JOIN Game g
	ON g.player1 = p.profileID
	INNER JOIN (
		SELECT p2.profileID, g2.result
		FROM [Profile] p2
		INNER JOIN Game g2
		ON g2.player2 = p2.profileID
	) pl2
	ON g.player2 = pl2.profileID
	INNER JOIN [Image] i
	ON i.imageID = p.imageID
	GROUP BY p.profileID, p.memberID, p.username, i.imageURL;
GO

--Indexes
CREATE INDEX IX_Member_memberID ON Member(memberID);
CREATE INDEX IX_Member_memberName ON Member(memberName);
CREATE INDEX IX_Profile_profileID_username ON [Profile](profileID, username);
CREATE INDEX IX_Game_gameID ON Game(gameID);
GO

-- SP's

--SELECT's--
CREATE PROC sp_member
	@memberName VARCHAR(128)
AS
	SELECT * 
	FROM Member
	WHERE memberName = @memberName;
GO

CREATE PROC sp_member_id
	@memberID INT
AS
	SELECT * 
	FROM Member
	WHERE memberID = @memberID;
GO

CREATE PROC sp_profiles
	@memberName VARCHAR(128)
AS
	SELECT p.profileID, p.username, i.imageURL
	FROM [Profile] p
	INNER JOIN [Image] i
	ON p.imageID = i.imageID
	INNER JOIN Member m
	ON m.memberID = p.memberID
	WHERE m.memberName = @memberName;
GO

CREATE PROC sp_profiles_id
	@memberID INT
AS
	SELECT p.profileID, p.username, i.imageURL
	FROM [Profile] p
	INNER JOIN [Image] i
	ON p.imageID = i.imageID
	WHERE p.memberID = @memberID;
GO

-- Gets the W/L/D for all profiles of a memberID
CREATE PROC sp_profile_game_wld
	@memberID INT
AS
	SELECT memberID, username, P1_Wins + P2_Wins AS [Wins], P1_Losses + P2_Losses AS [Losses], P1_Draws + P2_Draws AS [Draws]
	FROM v_player_wld
	WHERE memberID = @memberID;
GO

CREATE PROC sp_profile_game
	@profileID INT
AS
	SELECT profileID, username, imageURL, P1_Wins + P2_Wins AS [Wins], P1_Losses + P2_Losses AS [Losses], P1_Draws + P2_Draws AS [Draws]
	FROM v_player_wld
	WHERE profileID = @profileID;
GO

-- UPDATE's --

/*
Users can only update their profile photo after creation (MVP) as well as game (after game end)
*/
CREATE PROC sp_update_profile
	@memberID INT,
	@username INT,
	@imageID INT
AS
	UPDATE [Profile] SET imageID = @imageID
	WHERE memberID = @memberID
	AND username = @username;
GO

CREATE PROC sp_update_game
	@gameID INT,
	@result VARCHAR(1)
AS
	UPDATE Game SET result = @result
	WHERE gameID = @gameID;
GO

-- DELETE's --
--DISCUSS WHAT WE CAN DELETE, IF ANYTHING

-- INSERT's --

-- new user
/*
Creating a new member and returning the memberID for use in FE/BE
*/
CREATE PROC sp_create_member
	@memberName VARCHAR(128)
AS
	INSERT INTO Member 
	VALUES (@memberName);
	SELECT SCOPE_IDENTITY() AS LastIdentityValue;
GO

-- new profile
/*
Creating a new profile and returning the profileID for use in FE/BE
*/
CREATE PROC sp_create_profile
	@username VARCHAR(128),
	@profileImage INT,
	@memberID INT
AS
	INSERT INTO [Profile]
	VALUES (@username, @profileImage, @memberID);
	SELECT SCOPE_IDENTITY() AS LastIdentityValue;
GO

-- new game
/*
Only need to create a game with the players, the rest have default values
Returning ID created for use in FE/BE
Use the profile id's
*/
CREATE PROC sp_create_game
	@player1 INT,
	@player2 INT
AS
	INSERT INTO Game(player1, player2)
	VALUES (@player1, @player2);
	SELECT SCOPE_IDENTITY() AS gameID;
GO	

--User
CREATE USER Player
WITH PASSWORD = '<YOUR_PASSWORD_HERE>';
GO

--Grants
GRANT INSERT, UPDATE, SELECT, DELETE ON Member TO Player;
GRANT INSERT, UPDATE, SELECT, DELETE ON [Profile] TO Player;
GRANT SELECT ON [Image] TO Player;
GRANT INSERT, UPDATE, SELECT, DELETE ON Game TO Player;
GRANT SELECT ON v_player_wld TO Player;
GO

--Denials
DENY ALTER ON DATABASE::XInARow TO Player;

DENY ALTER ON OBJECT::Member TO Player;
DENY REFERENCES ON OBJECT::Member TO Player;
DENY CONTROL ON OBJECT::Member TO Player;
DENY TAKE OWNERSHIP ON OBJECT::Member TO Player;

DENY ALTER ON OBJECT::[Profile] TO Player;
DENY REFERENCES ON OBJECT::[Profile] TO Player;
DENY CONTROL ON OBJECT::[Profile] TO Player;
DENY TAKE OWNERSHIP ON OBJECT::[Profile] TO Player;

DENY ALTER ON OBJECT::Game TO Player;
DENY REFERENCES ON OBJECT::Game TO Player;
DENY CONTROL ON OBJECT::Game TO Player;
DENY TAKE OWNERSHIP ON OBJECT::Game TO Player;

DENY ALTER ON OBJECT::[Image] TO Player;
DENY REFERENCES ON OBJECT::[Image] TO Player;
DENY CONTROL ON OBJECT::[Image] TO Player;
DENY TAKE OWNERSHIP ON OBJECT::[Image] TO Player;

DENY ALTER ON OBJECT::v_player_wld TO Player;
DENY REFERENCES ON OBJECT::v_player_wld TO Player;
DENY CONTROL ON OBJECT::v_player_wld TO Player;
DENY TAKE OWNERSHIP ON OBJECT::v_player_wld TO Player;
GO

-- Security Triggers

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