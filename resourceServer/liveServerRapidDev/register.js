function register() {
    let username = document.getElementById('user-name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm=password').value;

    // Perform validation (e.g., check for required fields, email format, etc.)

    // Assuming validation passes, you can proceed with registration
    let user = {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    };

    // Send the user object to the server for registration

    alert('Registration successful!');
  }