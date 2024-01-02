function adminLoginValidate() {


    // Input Fields
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    // Error Fields
   
    const emailError = document.getElementById("emailErr");
    const passwordError = document.getElementById("passwordErr");

    // Regex

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail+\.[a-zA-Z]{3}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;



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

    return true;
}