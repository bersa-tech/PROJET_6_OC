// 1- Création de la fonction pour vérifier si l'utilisateur est connecté
// 2- Récupérer le token et le vérifier
// 3- Si l'utilisateur est connecté, appliquer les changements Figma (login, filtres, etc...)
// 4- Si l'utilisateur est déconnecté, remettre le contenu par default (login, filtres, etc...)
// 5- Création de la fonction pour déconnecter l'utilisateur
// 6- appeler la fonction pour vérifier si l'utilisateur est connecté au chargement de la page

// Création de la fonction pour vérifier si l'utilisateur est connecté
async function checkUserConnected() {
  const token = localStorage.getItem("token");
  // console.log(token);
  const userConnected = token != null && token != undefined && token != "";

  // Si l'utilisateur est connecté
  if (userConnected) {
    // Login devient LOGOUT + déconnexion au clique avec la fonction userLogout
    const navLogin = document.querySelector(".nav-login");
    navLogin.textContent = "logout";
    navLogin.addEventListener("click", userLogout);

    // Affichage des éléments de la barre d'édition
    const navEdition = document.getElementById("navEdition");
    navEdition.style.display = "flex";

    // Affichage du bouton modifier
    const buttonModify = document.querySelector(".buttonModify");
    buttonModify.style.display = "block";

    // Les filtres sont masqués
    const divFilters = document.querySelector(".filters");
    divFilters.style.display = "none";
  }

  // Si l'utilisateur est déconnecté
  else {
    // Logout redevient LOGIN
    const navLogin = document.querySelector(".nav-login");
    navLogin.textContent = "login";

    // Les éléments de la barre d'édition sont masqués
    const navEdition = document.getElementById("navEdition");
    navEdition.style.display = "none";

    // Le bouton modifier est masqué
    const buttonModify = document.querySelector(".buttonModify");
    buttonModify.style.display = "none";

    // Les filtres sont visibles
    const divFilters = document.querySelector(".filters");
    divFilters.style.display = "flex";
  }
}

// Fonction de déconnexion
function userLogout() {
  localStorage.clear(); // Nettoyage du localStorage => suppression du token
  window.location.reload(); // Rechargement de la page
}

// Appel de la fonction pour vérifier si l'utilisateur est connecté au chargement de la page
checkUserConnected();
