# X in a Row

X in a Row is a dynamic take on the popular children's game 'Connect 4'

## Installation

Clone the repo:
Copy the repo https link

![Repo Clone Button](https://thumbs2.imgbox.com/36/67/Vrk0zUFk_t.png)

Clone the repo into a directory on your device
```bash
git clone <repo_link>
```

## Setup
### Database
Navigate to the [Database Scripts](https://github.com/Manuel-Nunes/XInARow/tree/main/globalUtils/DatabaseScripts), located in 'globalUtils/DatabaseScripts'

Open [Sql Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads). 

Download and install the Express edition if you do not have it.

Once open, connect to the local instance of your SQL Server with Windows Authentication:

![Sql Server Windows Authentication](https://thumbs2.imgbox.com/dd/5e/GFQO0RDi_t.png)

The windows authentication details will be auto populated, just click connect.

Once in the Database Viewer, drag and drop the DB_XInARow_Creation.sql into SQL Server

#### Before running the script:

##### Application Database
Execute the commands
```sql
EXEC sp_configure 'contained database authentication', 1;
RECONFIGURE;
GO
```
Note: Execute this command on its own, either in its own query script or highlight these commands and click 'Execute'

Ensure that the message output changes the configuration option to 1.

This command can be found to commented out in each script to allow for easier access.

Once complete, either comment out the commands from DB_XInARow_Creation.sql or navigate back to this script.

##### User Credentials
Navigate to line 214:
```sql
--User
CREATE USER Player
WITH PASSWORD = '<YOUR_PASSWORD_HERE>';
GO
```
Update the password for the user with one of your choice.

Once changed, save and execute the script.

#### Auth Database
##### User Credentials
Navigate to line 51:
```sql
CREATE USER AuthServer
WITH PASSWORD = '<YOUR_PASSWORD_HERE>'
GO
```
Update the password for the user to one of your choice

### Server
To run you have a set of options:
- "startR" - will start just the resource server (no deploy)
- "startI" - will start just the identity server (no deploy)
- "startAll" - will start both servers (no deploy)
- "deployR" - will deploy the resource server
- "deployI" - will deploy the identity server
- "depAndSR" - will deploy and start the resource server
- "buildAndGo" - will deploy and start both servers

To run the project quickly use "npm run buildAndGo", this will start the servers in seperate terminals. The "npm i" is included in this command, but can be run seperately.


### Secrets
In the identityServer folder the following secrets file is needed (create it):

    secrets.json
```json
    {
        "dbConfig":{
            "user": "ServerAuth",
            "password":"Your-Auth-DB-Password",
            "database":"XInARowAuth",
            "server":"localhost",
            "pool":{
                "max": 10,
                "min":0,
                "idleTimeoutMillis":3000
            },
            "options":{
                "encrypt":true,
                "trustServerCertificate": true
            }
        },
        "JWTSecret": "Your-Secret-Here-Any-A-Z-Sentence",
        "algorithm": "HS256"
    }
```
and in the resourceServer folder the following secrets file is needed (create it):

    secret.json
```json
    {
        "dbConfig":{
            "user": "Player",
            "password":"Your-DB-Password",
            "database":"XInARow",
            "server":"localhost",
            "pool":{
                "max": 10,
                "min":0,
                "idleTimeoutMillis":3000
            },
            "options":{
                "encrypt":true,
                "trustServerCertificate": true
            }
        }
    }
```

### Config
In the server.config:

    "isRunLocally" - true points the endpoints to localhost, false will point it to the aws endpoints.
    "skipIDCheck" - true will forgo the identity server verification, false will force the user to be verified.

## License

[MIT](https://choosealicense.com/licenses/mit/)
