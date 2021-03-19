# ePaymentDemo
  
## Technologies used:
- MERN Stack
- dependencies:
  1. axios
  2. @material-ui/core + @material-ui/icons
  3. react-bootstrap + bootstrap
  4. react-router-dom
  5. react-moment
  6. dotenv
  7. jsonwebtoken
  8. bcrypt
  9. cookie-parser
  10. express, express-jwt, express-validator
  11. mongoose
  12. node, nodemon
  

## Installation and Set Up

a.	This was done in WSL2, but should translate onto MacOS as well.
b.	Ensure that MongoDB is installed on your system. Due to the nature of WSL, the latest compatible version is 3.6.8. If on MacOS, this should not be an issue if you are using the latest version, v4.4 (Community Edition) 
c.	Extract all files to a folder
d.	In a terminal, navigate to the root of the folder where the files were extracted, type npm run install-all, this runs the script to install dependencies for both frontend and backend
e.	To run the app, type npm run start-server to run the script to start the backend app. For the frontend, open a separate terminal and type  npm run start-client
f.	In a browser, navigate to localhost:3000 to access the application
g.	Click on Sign Up! and the top right in the nav bar
h.	Fill out the info and hit Create to create and account.
i.	You may also seed the database by opening a new tab/window and entering: localhost:3000/api/user/seed
j.	Once logged in, the “Send Money”, “Add Money”, “Transaction History” options will be accessible.


