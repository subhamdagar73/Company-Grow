document.addEventListener('DOMContentLoaded', function () {
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');
  const rememberCheckbox = document.getElementById('rememberMe');
  const loginBtn = document.querySelector('.signin-btn');
  const message = document.getElementById('login-message');
  const forgotLink = document.getElementById('forgot');

  // Populate from localStorage if "remember me" was checked
  if (localStorage.getItem('rememberMe') === 'true') {
    emailField.value = localStorage.getItem('email') || '';
    passwordField.value = localStorage.getItem('password') || '';
    rememberCheckbox.checked = true;
  }

  loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      message.style.color = 'red';
      message.textContent = 'Please enter both email and password.';
      return;
    }

    if (!emailRegex.test(email)) {
      message.style.color = 'red';
      message.textContent = 'Please enter a valid email address.';
      return;
    }

    const validUser = {
      email: "admin@example.com",
      password: "123456"
    };

    if (email === validUser.email && password === validUser.password) {
      message.style.color = 'green';
      message.textContent = 'Login successful! Redirecting...';

      if (rememberCheckbox.checked) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('rememberMe', true);
      } else {
        localStorage.clear();
      }

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      message.style.color = 'red';
      message.textContent = 'Invalid credentials.';
    }
  });

  forgotLink.addEventListener('click', function (e) {
    e.preventDefault();
    alert("Password reset functionality coming soon!");
  });

  document.querySelectorAll('.socials button').forEach(btn =>
    btn.addEventListener('click', () =>
      alert('Social login is under development.')
    )
  );
});
