const loginUser = require("../DatabaseHandlers/loginHandler");

function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = {
        "email": email,
        "password": password
    }

    // Perform validation, e.g., check against a stored list of valid credentials
    if (validateForm) {
      let memberId = loginUser(user);
      // window.location.href = "game.html";
      return memberId;
    } else {
      alert("Invalid username or password. Please try again.");
    }
  }

function validateForm(email, password) {
  // Check if any field is empty
  if (email === '' ||  password === '') {
    alert('All fields are required.');
    return false;
  }

  // Check if email is valid using a simple regular expression
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert('Invalid email address.');
    return false;
  }

  // Check if password has at least 8 characters
  if (password.length < 8) {
    alert('Password must have at least 8 characters.');
    return false;
  }

  // All validations passed
  return true;
}