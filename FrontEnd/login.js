// Récupération des données dans le DOM
const login = document.querySelector(".login");
const formLogin = document.querySelector(".formLogin");
const inputMailValue = document.getElementById("email");
const inputPasswordValue = document.getElementById("password");
const loginConnection = document.getElementById("connection");

// Écouteur d'évènement sur le bouton "se connecter"
// après avoir rempli le formulaire de connexion
loginConnection.addEventListener("click", (e) => {
  e.preventDefault();
  // Récupération des valeurs des deux "INPUT"
  const formComplete = {
    email: inputMailValue.value,
    password: inputPasswordValue.value,
  };

  // Transformation en JSON de l'objet comprenant les valeurs
  let JSONformComplete = JSON.stringify(formComplete);

  // Envoi des données reçues dans le formulaire de connexion
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSONformComplete,
  })
    .then((response) => response.json())
    .then((data) => {
      // Gestion du statut de connexion
      if (data.token) {
        localStorage.setItem("token", data.token);

        localStorage.setItem("userId", data.userId);

        window.location.href = "index.html";
      } else {
        alert("Erreur ! E-mail ou mot de passe incorrect");
      }
    })
    .catch(() => alert("Erreur ! E-mail ou mot de passe incorrect"));
});

// Création du formulaire
// let createDiv = document.createElement("form");

// let form = `
// <form class="formLogin" action ="" method="post">
//     <h2>Log in</h2>
//           <label class="loginEmail" for="email">E-mail</label>
//           <input type="email" id="email" name="user_email">

//           <label class="loginPassword" for="password">Mot de passe</label>
//           <input type="password" id="password" name="user_password">

//           <button class="loginConnect">Se connecter</button>
//           <a href="">Mot de passe oublié</a>
// </form>
// `;

// Au clic, apparition de la page "Login" et display none sur la partie "Section" du HTML

// login.addEventListener("submit", () => {
//   sections.forEach((section) => {
//     section.style.display = "none";

//     loginPage.appendChild(createDiv);
//     loginPage.innerHTML = form;
//   });
// });

// Récupération dans le DOM des id "INPUT"
