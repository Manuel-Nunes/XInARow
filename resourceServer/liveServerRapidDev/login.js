import {
  ssStoreWebToken,
  ssSetMemberId,
} from './sessionUtils.js';

let form = document.getElementById('form-login');

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  let data = await login();
  ssStoreWebToken(data.token);
  ssSetMemberId(data.memberID);
  window.location.href = "homescreen.html";
});

async function login() {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let user = {
    'email': email,
    'password': password
  };
  // Perform validation, e.g., check against a stored list of valid credentials
  if (validateForm(email, password)) {
    let memberID = await submitForm(user);
    return memberID;
  } else {
    alert('Invalid username or password. Please try again.');
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

async function submitForm(user){
  try{
    const response = await fetch('http://localhost:3000/submitLogin', {
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
      console.error('Login failed!');
      return {
        'error':true
      };
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}