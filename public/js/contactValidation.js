function contact() {
    const fullName = document.getElementById("name");
    const email = document.getElementById("email");
    const phoneNum = document.getElementById("phone");
    const subject = document.getElementById("subject");
    const message = document.getElementById("Message");
  
    const fullNameErr = document.getElementById("name-error");
    const emailErr = document.getElementById("email-error");
    const phoneNumErr = document.getElementById("phone-error");
    const subjectErr = document.getElementById("subjectError");
    const messageErr = document.getElementById("messageError");
  
    const fullNameRegex = /^[A-Z][a-z]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneNumRegex = /^[0-9]{10}$/;
    const subjectRegex = /^[A-Za-z\s]+$/;
    const messageMinLength = 10;
  
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
  
    // Full Name validation
    if (fullName.value.trim() === '') {
      showError(fullName, fullNameErr, 'Please enter your name');
    } else if (!fullNameRegex.test(fullName.value.trim())) {
      showError(fullName, fullNameErr, 'Name should start with a capital letter');
    } else {
      removeError(fullName, fullNameErr);
    }
  
    // Email validation
    if (email.value.trim() === '') {
      showError(email, emailErr, 'Please enter your email');
    } else if (!emailRegex.test(email.value.trim())) {
      showError(email, emailErr, 'Please enter a valid email address');
    } else {
      removeError(email, emailErr);
    }
  
    // Subject validation
    if (subject.value.trim() === '') {
      showError(subject, subjectErr, 'Please enter a subject');
    } else if (!subjectRegex.test(subject.value.trim())) {
      showError(subject, subjectErr, 'Subject should contain only letters');
    } else {
      removeError(subject, subjectErr);
    }
  
    // Message validation
    if (message.value.trim().length < messageMinLength) {
      showError(message, messageErr, `Message should contain at least ${messageMinLength} characters`);
    } else {
      removeError(message, messageErr);
    }
    
    if (phoneNum.value.trim() === '') {
        showError(phoneNum, phoneNumErr, 'Please enter your phone number');
      } else if (!phoneNumRegex.test(phoneNum.value.trim())) {
        showError(phoneNum, phoneNumErr, 'Please enter a valid phone number');
      } else {
        removeError(phoneNum, phoneNumErr);
      }
    
      return isValid;
    }
  