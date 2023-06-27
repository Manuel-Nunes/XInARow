const form = document.getElementById('form-register');

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  await register();
  window.location = '/login';
});

async function register() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (validateForm(username, email, password, confirmPassword)) {
    // When we get here we assume the confirmed password matches the password

    const user = {
      username: username,
      email: email,
      password: password,
    };

    try{
      const memberId = await submitForm(user);
      alert('Registration successful!');
      return memberId;

    } catch (error){
      alert(error);
    }
  }
}

function validateForm(username, email, password, confirmPassword) {
  // Check if any field is empty
  if (username === '' || email === '' ||  password === '' || confirmPassword === '') {
    alert('All fields are required.');
    return false;
  }

  // Check if user is valid (no special characters).
  const usernamePattern = /^[a-zA-Z0-9]+$/;
  if(!usernamePattern.test(username)){
    alert('Invalid username.');
    return false;
  }

  // Check if email is valid using a simple regular expression
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

async function submitForm(user){
  try{
    const response = await fetch('http://localhost:3000/submitRegister', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Registration failed!');
    }
  } catch (error) {
    console.error(error);
    return {
      'error': 'There has been an issue, please try again'
    };
  }
}