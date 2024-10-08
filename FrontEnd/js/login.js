const formulaire = document.getElementById("log-user");

formulaire.addEventListener("submit", async (event) => {
  // Empêche le rechargement de la page
  event.preventDefault();

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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(user),
    });
    // Si la réponse est OK (status 200)
    if (response.ok) {
      // On récupère les données
      const data = await response.json();
      console.log(data);

      // On récupère le token d'authentification
      const token = data.token;
      // On stocke le token dans le localStorage
      localStorage.setItem("token", token);
      // On redirige vers la page d'accueil en mode édition
      window.location.href = "index.html";
    } else {
      // Sinon message d'erreur
      messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";
      // Le message d'erreur s'efface au bout de 5s
    }
  } catch (error) {
    console.log("Echec de l'authentification", error);
  }
});
