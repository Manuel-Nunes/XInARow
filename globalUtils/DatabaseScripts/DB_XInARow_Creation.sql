--EXEC sp_configure 'contained database authentication', 1;
--RECONFIGURE;
--GO

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
	SELECT
    p.profileID, p.username, i.imageURL, p.memberID,
    COUNT(CASE WHEN g.result = '1' AND g.player1 = p.profileID THEN 1 END) AS P1_Wins,
    COUNT(CASE WHEN g.result = '2' AND g.player1 = p.profileID THEN 1 END) AS P1_Losses,
    COUNT(CASE WHEN g.result = '0' AND g.player1 = p.profileID THEN 1 END) AS P1_Draws,
    COUNT(CASE WHEN g.result = '1' AND g.player2 = p.profileID THEN 1 END) AS P2_Wins,
    COUNT(CASE WHEN g.result = '2' AND g.player2 = p.profileID THEN 1 END) AS P2_Losses,
    COUNT(CASE WHEN g.result = '0' AND g.player2 = p.profileID THEN 1 END) AS P2_Draws
	FROM
		[Profile] p
	LEFT JOIN
		Game g ON p.profileID IN (g.player1, g.player2)
	LEFT JOIN
		[Image] i ON p.imageID = i.imageID
	GROUP BY
		p.profileID,
		p.username,
		p.memberID,
		i.imageURL;
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

-- Gets the W/L/D for all profiles of a profileID
CREATE PROC sp_profile_game_wld
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
	@profileID INT,
	@imageID INT
AS
	UPDATE [Profile] SET imageID = @imageID
	WHERE profileID = @profileID;
GO	

CREATE PROC sp_update_game
	@gameID INT,
	@result VARCHAR(1)
AS
	UPDATE Game SET result = @result
	WHERE gameID = @gameID;
GO

-- DELETE's --
--NONE

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
	SELECT SCOPE_IDENTITY() AS memberID;
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
	SELECT SCOPE_IDENTITY() AS profileID;
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

-- DUMMY DATA -- 

INSERT INTO Member (memberName)
VALUES ('JohnSmith'), 
('JaneDoe'), 
('MichaelJohnson'), 
('EmilyDavis'), 
('RobertWilson'),
('SarahThompson'), 
('DavidAnderson'), 
('JenniferBrown'), 
('ChristopherLee'), 
('AmandaClark');

INSERT INTO [Image] (imageURL)
VALUES 
('https://thumbs2.imgbox.com/85/2f/65QC9igi_t.png'),
('https://thumbs2.imgbox.com/02/8d/3c1WdKmM_t.png'),
('https://thumbs2.imgbox.com/ed/b9/HlxOOGP6_t.png'),
('https://thumbs2.imgbox.com/2d/db/Y3sfG5tm_t.png'),
('https://thumbs2.imgbox.com/7e/0e/zzVpuSLB_t.png'),
('https://thumbs2.imgbox.com/16/cd/ID7Q8Vfu_t.png'),
('https://thumbs2.imgbox.com/40/46/5YHfXtKC_t.png'),
('https://thumbs2.imgbox.com/9b/2e/UkYM5uv0_t.png'),
('https://thumbs2.imgbox.com/61/47/PWm7lfrK_t.png'),
('https://thumbs2.imgbox.com/c7/ca/4bMq2hUw_t.png');

INSERT INTO [Profile] (username, imageID, memberID)
VALUES 
('MLG420Blaze', 1, 1), 
('Dankzilla', 2, 1), 
('NoScopeNinja', 3, 2), 
('Memesaur', 4, 2), 
('ShrekSquad', 5, 3),
('PogChampXxX', 6, 3), 
('PepeGamer', 7, 4), 
('MemeLordSupreme', 8, 4), 
('360NoSwag', 9, 5),
('L33tDoge', 10, 5),
('SnoopGamer', 1, 6),
('Trollinator', 2, 6),
('MemeMarauder', 3, 7),
('DoritoDominator', 4, 7),
('HarambeHero', 5, 8),
('CheetoChampion', 6, 8),
('LootGoblinSupreme', 7, 9),
('EpicFaceplant', 8, 9),
('DankMuffin', 9, 10),
('SavageSwagLord', 10, 10);

INSERT INTO Game (result, player1, player2, TMSTAMP)
VALUES 
('1', 1, 2, GETDATE()), 
('2', 3, 4, GETDATE()), 
('0', 5, 6, GETDATE()), 
('1', 7, 8, GETDATE()), 
('2', 9, 10, GETDATE()),
('0', 11, 12, GETDATE()), 
('1', 13, 14, GETDATE()), 
('2', 15, 16, GETDATE()), 
('0', 17, 18, GETDATE()), 
('1', 19, 20, GETDATE()),
('0', 1, 2, GETDATE()), 
('1', 3, 4, GETDATE()), 
('1', 5, 6, GETDATE()), 
('2', 7, 8, GETDATE()), 
('1', 9, 10, GETDATE()),
('2', 11, 12, GETDATE()), 
('2', 13, 14, GETDATE()), 
('0', 15, 16, GETDATE()), 
('1', 17, 18, GETDATE()), 
('0', 19, 20, GETDATE());