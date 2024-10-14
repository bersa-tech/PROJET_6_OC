// 1- On récupère les valeurs entrées dans email et password du formulaire
// 2- On soumet le formulaire et on l'envoie à l'API pour vérifier si l'utilisateur est connécté
// 3- Si l'utilisateur est connecté, on récupère le token et on le stocke dans le localStorage et
// 4- On redirige l'utilisateur vers la page d'accueil
// 5- Si l'utilisateur n'est pas connecté, on affiche un message d'erreur

const formulaire = document.getElementById("log-user"); // On récupère le formulaire dans la variable

formulaire.addEventListener("submit", async (event) => {
  // On écoute l'événement submit du formulaire et on lance la fonction asynchrone
  event.preventDefault(); // Empêche le rechargement de la page
  // Création des variables concernant le formulaire
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const messageError = document.querySelector("#error");

  // On récupère les valeurs entrées dans email et password
  const user = {
    email: email.value,
    password: password.value,
  };
  //console.log(user);

  // On soumet le formulaire et on l'envoie à l'API
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST", // On envoie une requête POST
      headers: {
        // On définit les en-têtes de la requête
        // On définit le type de contenu de la requête
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(user), // On convertit les données en chaîne de caractères JSON
    });
    if (response.ok) {
      // Si la réponse est OK (status code 200)
      const data = await response.json(); // On récupère les données de la réponse au format JSON
      // console.log(data);

      // On récupère le token d'authentification dans une variable puis on la stocje dans le localStorage
      const token = data.token;
      localStorage.setItem("token", token);
      window.location.href = "index.html"; // On redirige vers la page d'accueil en mode édition
    } else {
      // Sinon message d'erreur
      messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";
    }
  } catch (error) {
    console.log("Echec de l'authentification", error);
  }
});
