import {
  ssStoreWebToken,
  ssGetWebToken,
  ssSetMemberID,
  ssGetMemberId
} from './sessionUtils.js';

const form = document.getElementById('form-login');

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = await login();
  ssStoreWebToken(data.token);
  ssSetMemberID(data.memberID);
  window.location.replace(`/homescreen?token=${ssGetWebToken()}&memberID=${ssGetMemberId()}`);
  
});

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const user = {
    'email': email,
    'password': password
  };
  // Perform validation, e.g., check against a stored list of valid credentials
  if (validateForm(email, password)) {
    const memberID = await submitForm(user);
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

  // All validations passed
  return true;
}

async function submitForm(user){
  try{
    const response = await fetch(`${window.location.origin}/submitLogin`, {
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