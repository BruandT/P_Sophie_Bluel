// Recuperation de element de mon <form>
const form = {
  email: document.querySelector("#email"),
  password: document.querySelector("#password"),
  valid: document.querySelector("#valid")
};

// Regex pour verifier le format du (email) et (password)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

const url = "http://localhost:5678/api/users/login";

// Function envoie du couple (email) et (password) a l'API
async function userLogin(email, password) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  return response.json();
}

// Event de verification des <input> (email) et (password)
form.valid.addEventListener("click", (e) => {
  e.preventDefault();
  if (!email.checkValidity() && !emailRegex.test(email.value)) {
    alert("Veuillez entrer une adresse e-mail valide")
  }if (!password.checkValidity() && !passwordRegex.test(password.value)) {
    alert("Veuillez entrer un mot de passe valide");
  } else {
    // Appel function (userLogin)
    userLogin(form.email.value, form.password.value)
    .then((data) => {
      if (!data.userId) {
        alert("Erreur dans l'identifiant ou le mot de passe");
      } else {
        // Generation du token + stockage dans le localStorage
        localStorage.setItem("token", data.token)
        // Retour sur la page principal du portfolio
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }   
});