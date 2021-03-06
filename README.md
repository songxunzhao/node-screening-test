## Project Specification
Write an application for managing savings deposits

User must be able to create an account and log in.
When logged in, a user can enter savings deposits, and edit and delete deposits they entered.
Implement at least three roles with different permission levels: a regular user would only be able to CRUD on their owned records, a user manager would be able to CRUD users, and an admin would be able to CRUD all records and users.
A saving deposit is identified by a bank name, account number, an initial amount saved (currency in USD), start date, end date, interest percentage per year and taxes percentage.
The interest could be positive or negative. The taxes are only applied over profit.
User can filter saving deposits by the amount (minimum and maximum), bank name and date.
User can generate a revenue report for a given period, that will show the gains and losses from interest and taxes for each deposit. The amount should be green or red if respectively it represents a gain or loss. The report should show the sum of profits and losses at the bottom of that period. 
The computation of profit/loss is done on a daily basis. Consider that a year is 360 days. 
REST API. Make it possible to perform all user actions via the API, including authentication.
Unit and e2e tests.

## Project Structure
This project consists of two parts - server and client. Here are platform and frameworks used for server and client.
* Server: Node.js + Express framework
* Client: React framework

## How to Run
Clone git repository and follow these steps

### Run server
```
$ cd ./server
$ yarn install
$ yarn start
```
Server will run on 8000 port.

### Run client
```
$ cd ./client
$ yarn install
$ yarn start
```

Once yarn start is successful, it will launch http://localhost:3000 in the browser. 
If not launched automatically, please type http://localhost:3000 in browser address.

React app is proxied to 8000 port, thus you can just play with client application.
## Test consideration
A User can't create ADMIN/MANAGER itself from register page, because of security reason. 
The user will have NORMAL role as a default. 

Please create an admin user with the following command and change NORMAL user permission to ADMIN user permission.
```
$ yarn create-admin -u [username] -e [email] -p [123456]
```
