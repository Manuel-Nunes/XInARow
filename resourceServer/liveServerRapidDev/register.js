const registerUser = require('./DatabaseHandler/registerHandler');

function register() {
    let username = document.getElementById('user-name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm=password').value;

    if (validateForm(firstName, lastName, email, password)) {
        // When we get here we assume the confirmed password matches the password

        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(password, salt);

        let user = {
          username: username,
          email: email,
          password: hashedPassword,
          salt: salt
        };

        try{
            registerUser(user);
        } catch (error){
            throw error;
        }
    }
    // Send the user object to the server for registration

    alert('Registration successful!');
  }

  function validateForm(username, email, password, confirmPassword) {
    // Check if any field is empty
    if (username === '' || email === '' ||  password === '' || confirmPassword === '') {
      alert('All fields are required.');
      return false;
    }

    // Check if email is valid using a simple regular expression
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Invalid email address.');
      return false;
    }

    // Check if password has at least 8 characters
    if (password.length < 8) {
      alert('Password must have at least 8 characters.');
      return false;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
      }

    // All validations passed
    return true;
  }