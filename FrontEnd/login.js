const form = {
  email: document.querySelector("#email"),
  password: document.querySelector("#password"),
  valid: document.querySelector("#valid")
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

const url = "http://localhost:5678/api/users/login";

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

form.valid.addEventListener("click", (e) => {
  e.preventDefault();
  if (!email.checkValidity() && !emailRegex.test(email.value)) {
    alert("Veuillez entrer une adresse e-mail valide")
  }if (!password.checkValidity() && !passwordRegex.test(password.value)) {
    alert("Veuillez entrer un mot de passe valide");
  } else {
    userLogin(form.email.value, form.password.value)
    .then((data) => {
      if (!data.userId) {
        alert("Erreur dans l'identifiant ou le mot de passe");
      } else {
        localStorage.setItem("token", data.token)
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }   
});