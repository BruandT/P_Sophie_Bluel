const email = document.querySelector("#email");
const password = document.querySelector("#password");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

const url = "http://localhost:5678/api/users/login";




document.querySelector("form").addEventListener("submit", (event) => {
  const data = { email: email.value, password: password.value };
  if (!email.checkValidity() && !emailRegex.test(email.value)) {
    alert("Veuillez entrer une adresse e-mail valide");
    event.preventDefault();
  }
  
  if (!password.checkValidity() && !passwordRegex.test(password.value)) {
    alert("Veuillez entrer un mot de passe valide (8 caractères minimum, avec au moins une lettre majuscule, une lettre minuscule et un chiffre)");
    event.preventDefault();
  }

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    localStorage.setItem("token", data.token)
    window.location.href = "index.html";
  })
  .catch(error => console.error(error));
  
  event.preventDefault();
});