function address() {
    const fullName = document.getElementById("fullName");
    const phoneNum = document.getElementById("phoneNum");
    const district = document.getElementById("district");
    const pincode = document.getElementById("pincode");
    const city = document.getElementById("city");
    const state = document.getElementById("state");
    const houseNum = document.getElementById("houseNumber"); // Corrected the ID here
  
    const fullNameErr = document.getElementById("fullNameErr");
    const phoneNumErr = document.getElementById("phoneNumErr");
    const districtErr = document.getElementById("districtErr");
    const pincodeErr = document.getElementById("pincodeErr");
    const cityErr = document.getElementById("cityErr");
    const stateErr = document.getElementById("stateErr");
    const houseNumErr = document.getElementById("houseNumErr"); // Corrected the ID here
  
    const fullNameRegex = /^[A-Za-z\s]+$/;
    const phoneNumRegex = /^[0-9]{10}$/;
    const districtRegex = /^[A-Za-z\s]+$/;
    const pincodeRegex = /^[0-9]{6}$/;
    const cityRegex = /^[A-Za-z\s]+$/;
    const stateRegex = /^[A-Za-z\s]+$/;
    const houseNumRegex = /^[0-9]+$/;
  
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
  
    //fullname
    if (fullName.value.trim() === '') {
      showError(fullName, fullNameErr, 'Enter a Name');
    } else if (!fullNameRegex.test(fullName.value.trim())) {
      showError(fullName, fullNameErr, 'Please enter a valid Name ');
    } else {
      removeError(fullName, fullNameErr);
    }
  
    //phone number
    if (phoneNum.value.trim() === '') {
      showError(phoneNum, phoneNumErr, 'Enter the Phone Number');
    } else if (!phoneNumRegex.test(phoneNum.value.trim())) {
      showError(phoneNum, phoneNumErr, 'Please enter a valid Phone Number');
    } else {
      removeError(phoneNum, phoneNumErr);
    }
  
    //pincode
    if (pincode.value.trim() === '') {
      showError(pincode, pincodeErr, 'Enter the Pincode');
    } else if (!pincodeRegex.test(pincode.value.trim())) {
      showError(pincode, pincodeErr, 'Please enter a valid Pincode');
    } else {
      removeError(pincode, pincodeErr);
    }
  
    //district
    if (district.value.trim() === '') {
      showError(district, districtErr, 'Enter the District');
    } else if (!districtRegex.test(district.value.trim())) {
      showError(district, districtErr, 'Please Check ones more');
    } else {
      removeError(district, districtErr);
    }
  
    //city
    if (city.value.trim() === '') {
      showError(city, cityErr, 'Enter the city');
    } else if (!cityRegex.test(city.value.trim())) {
      showError(city, cityErr, 'enter a valid name');
    } else {
      removeError(city, cityErr);
    }
  
    //state
    if (state.value.trim() === '') {
      showError(state, stateErr, 'Enter the state');
    } else if (!stateRegex.test(state.value.trim())) {
      showError(state, stateErr, 'Please enter a valid name ');
    } else {
      removeError(state, stateErr);
    }
  
    //house number
    if (houseNum.value.trim() === '') {
      showError(houseNum, houseNumErr, 'House Number is required');
    } else if (!houseNumRegex.test(houseNum.value.trim())) {
      showError(houseNum, houseNumErr, 'Please enter the House Number');
    } else {
      removeError(houseNum, houseNumErr);
    }
  
    return isValid;
}
