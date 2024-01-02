
  function validatePassword() {
    const currentPassword = document.getElementById("currentPassword");
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    const currentPasswordErr = document.getElementById("currentPasswordErr");
    const newPasswordErr = document.getElementById("newPasswordErr");
    const confirmPasswordErr = document.getElementById("confirmPasswordErr");

    let isValid = true;

    const showError = (inputField, errorField, message) => {
      errorField.textContent = message;
      inputField.classList.add('is-invalid');
      isValid = false;
    };

    const removeError = (inputField, errorField) => {
      errorField.textContent = '';
      inputField.classList.remove('is-invalid');
    };

    // Validate current password
    
    if (currentPassword.value.trim() === '') {
      showError(currentPassword, currentPasswordErr, 'Please enter your current password');
    } else {
      removeError(currentPassword, currentPasswordErr);
    }

    // Validate new password

    if (newPassword.value.trim() === '') {
      showError(newPassword, newPasswordErr, 'Please enter a new password');
    } else if (newPassword.value.trim().length < 5) {
      showError(newPassword, newPasswordErr, 'Password must be at least 8 characters');
    } else {
      removeError(newPassword, newPasswordErr);
    }

    // Confirm new password
    if (confirmPassword.value.trim() === '') {
      showError(confirmPassword, confirmPasswordErr, 'Please confirm your new password');
    } else if (confirmPassword.value !== newPassword.value) {
      showError(confirmPassword, confirmPasswordErr, 'Passwords do not match');
    } else {
      removeError(confirmPassword, confirmPasswordErr);
    }

    return isValid;
  }
