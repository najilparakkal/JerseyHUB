function productValidation() {
  // Input Fields
  const name = document.getElementById("productName");
  const quantity = document.getElementById("productQuantity");
  const brand = document.getElementById("productBrand");
  const description = document.getElementById("description");
  const images = document.getElementById("images");
  const price = document.getElementById("price");
  const category = document.getElementById("category");

  // Error Fields
  const nameErr = document.getElementById("nameErr");
  const quantityErr = document.getElementById("quantityErr");
  const brandErr = document.getElementById("brandErr");
  const descriptionErr = document.getElementById("descriptionErr");
  const imagesErr = document.getElementById("imagesErr");
  const priceErr = document.getElementById("priceErr");
  const categoryErr = document.getElementById("categoryErr");

  // Regex Patterns
  const nameRegex = /^[A-Z][a-zA-Z\s]*$/;
  const quantityRegex = /^[1-9][0-9]*$/;
  const brandRegex = /^[A-Z][a-zA-Z\s]*$/;
  const descriptionRegex = /^.{10,}$/;
  const imagesRegex = /\.(jpg|jpeg|png|gif)$/i;
  const priceRegex = /^\d+(\.\d{1,2})?$/;   
  function validateField(value, regex, errorElement, errorMessage) {
      if (value.trim() === "") {
          errorElement.style.color = "red";
          errorElement.innerHTML = "Please enter the required information...";
          setTimeout(() => {
              errorElement.innerHTML = "";
          }, 5000);
          return false;
      }

      if (!regex.test(value)) {
          errorElement.style.color = "red";
          errorElement.innerHTML = errorMessage;
          setTimeout(() => {
              errorElement.innerHTML = "";
          }, 5000);
          return false;
      }

      return true;
  }

  // Validate each field using the function
  if (!validateField(name.value, nameRegex, nameErr, "Invalid Name Format")) {
      return false;
  }

  if (!validateField(quantity.value, quantityRegex, quantityErr, "Invalid Quantity Format")) {
      return false;
  }

  if (!validateField(brand.value, brandRegex, brandErr, "Invalid Brand Format")) {
      return false;
  }

  if (!validateField(description.value, descriptionRegex, descriptionErr, "Invalid Description Format")) {
      return false;
  }

  if (!validateField(images.value, imagesRegex, imagesErr, "Invalid Image Format")) {
      return false;
  }

  if (!validateField(price.value, priceRegex, priceErr, "Invalid Price Format")) {
      return false;
  }

  if (!validateField(category.value, brandRegex, categoryErr, "Invalid Category Format")) {
      return false;
  }

  // Continue validation for other fields as needed

  // If all validations pass, you can proceed with submitting the form
  return true;
}
