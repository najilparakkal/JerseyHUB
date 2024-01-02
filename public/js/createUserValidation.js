

function newUserValidate() {


    // Input Fields
    const userName = document.getElementById("userName");
    const email = document.getElementById("email");
    const phoneNum=document.getElementById("phoneNum")
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    // Error Fields
    const userNameError = document.getElementById("userNameErr");
    const emailError = document.getElementById("emailErr");
    const phoneNumError=document.getElementById("phoneNumErr")
    const passwordError = document.getElementById("passwordErr");
    const confirmPasswordError = document.getElementById("confirmPasswordErr");

    // Regex
    const userNameRegex = /^[A-Z]/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail+\.[a-zA-Z]{3}$/;
    const phoneNumRegex =/^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   

    // UserName Field
    if (userName.value.trim() === "") {
        userNameError.style.color="red";
        userNameError.innerHTML = "Please Enter a Name...";
        setTimeout(() => {
            userNameError.innerHTML = "";
        }, 5000);
        return false;
    }   
    if (!userNameRegex.test(userName.value)) {
        userNameError.style.color="red";
        userNameError.innerHTML = "First Letter Should be Capital";
        setTimeout(() => {
            userNameError.innerHTML = "";
        }, 5000);
        return false;
    }

    // Email Field
    if (email.value.trim() === "") {
        emailError.style.color="red";
        emailError.innerHTML = "Please Enter an Email Address...";
        setTimeout(() => {
            emailError.innerHTML = "";
        }, 5000);
        return false;
    }
    if (!emailRegex.test(email.value)) {
        emailError.style.color="red";
        emailError.innerHTML = "Invalid Email Format";
        setTimeout(() => {
            emailError.innerHTML = "";
        }, 5000);
        return false;
    }

 
    //Mobile Field

    if (phoneNum.value.trim()===""){
        phoneNumError.style.color="red"
        phoneNumError.innerHTML="Enter The Phone Number";
        setTimeout(() => {
            phoneNumError.innerHTML="";
        }, 5000);
        return false;
    }
    if(!phoneNumRegex.test(phoneNum.value)){
        phoneNumError.style.color="red";
        phoneNumError.innerHTML="Enter a Valide Phone Number";
        setTimeout(() => {
            phoneNumError.innerHTML=""
        }, 5000);
        return false;
    }

    // Password Field
    if (password.value.trim() === "") {
        passwordError.style.color="red";
        passwordError.innerHTML = "Please Enter a Password...";
        setTimeout(() => {
            passwordError.innerHTML = "";
        }, 5000);
        return false;
    }
    if (!passwordRegex.test(password.value)) {
        passwordError.style.color="red";
        passwordError.innerHTML = "Enter a Strong Password";
        setTimeout(() => {
            passwordError.innerHTML = "";
        }, 5000);
        return false;
    }

    // Confirm Password Field

    if (confirmPassword.value.trim() === "") {
        confirmPasswordError.style.color="red";
        confirmPasswordError.innerHTML = "Please Confirm Password...";
        setTimeout(() => {
            confirmPasswordError.innerHTML = "";
        }, 5000);
        return false;
    }
    if (confirmPassword.value !== password.value) {
        confirmPasswordError.style.color="red";
        confirmPasswordError.innerHTML = "Passwords do not match";
        setTimeout(() => {
            confirmPasswordError.innerHTML = "";
        }, 5000);
        return false;
    }

    return true;
} 
