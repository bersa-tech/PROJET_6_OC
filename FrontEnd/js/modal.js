// 1- Gestion de l'ouverture/fermeture au clic de la modale
// 2- Gestion de l'ouverture de la deuxième modale au clic du bouton "Ajouter une photo"
// 3- Gestion du retour à la première modale au clic de la flèche de la deuxième modale
// 4- Fonction asynchrone pour récupérer les données des travaux depuis l'API pour la modale 1
// 5- et Fonction pour supprimer les travaux via les icônes de suppression en fonction de l'id
// ------------------------------------------------------------------------------------
// 6- Création du formulaire dans le modale 2 pour l'ajout de nouveaux travaux
// 7- Fonction pour previsualiser l'image avant de l'envoyer
// 8- Fonction pour supprimer l'image prévisualisée
// 9- Ajout des catégories au formulaire a partir de l'API
// 10- Fonction pour afficher les catégories dans le formulaire
// 11- Fonction pour passer le bouton "Valider" au vert si les champs sont remplis
// 12- Fonction pour valider le formulaire et envoyer les nouvelles données à l'API
// 13- Fonction reset du formulaire d'ajout de projet
// 14- Appeler les fonctions à la soumission du formulaire
// ------------------------------------------------------------------------------------

const modalContainer = document.querySelector(".modal_container"); // Conteneur des modales
const modalOne = document.querySelector(".modal_one"); // Modale "Galerie Photo"
const modalTwo = document.querySelector(".modal_two"); // Modale "Ajout Photo"

// Fonction pour déclencher l'ouverture/fermeture des modales
const modalStart = document.querySelectorAll(".modal_start"); // Bouton modifier, overlay de la modale, icône croix
modalStart.forEach((enableModal) =>
  enableModal.addEventListener("click", openAndCloseModal)
);
function openAndCloseModal() {
  modalContainer.classList.toggle("active"); // variation de la class active pour le open and close
  modalOne.style.display = "flex";
  modalTwo.style.display = "none";
}

// Fonction pour accéder à la deuxième modale
const nextModal = document.querySelector(".modal_one-addbutton"); // Sélection du bouton "Ajouter photo"
nextModal.addEventListener("click", openNextModal);
function openNextModal() {
  modalOne.style.display = "none";
  modalTwo.style.display = "flex";
}

// Fonction pour retourner à la première modale avec l'icône de retour fleche
const returnArrow = document.querySelector(".return_modal-one"); // Sélection de l'icône de retour
returnArrow.addEventListener("click", returnModalOne);
function returnModalOne() {
  modalOne.style.display = "flex";
  modalTwo.style.display = "none";
}

// Fonction asynchrone pour récupérer les données des travaux depuis l'API pour la modale 1
async function getWorksModal() {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((dataWorksModal) => {
      const galleryModal = document.querySelector(".modal_one-gallery");
      galleryModal.innerHTML = "";
      dataWorksModal.forEach((workModal) => {
        // Création des éléments nécessaires dans le html
        const cardModal = document.createElement("figure");
        const imgCardModal = document.createElement("img");
        const titleCardModal = document.createElement("figcaption");

        // On récupère les données importantes pour afficher les travaux
        cardModal.setAttribute("id", workModal.id);
        imgCardModal.src = workModal.imageUrl;
        imgCardModal.alt = workModal.title;
        imgCardModal.setAttribute("category", workModal.categoryId);

        // Ajout de l'icône de suppression d'un projet
        const deleteButton = document.createElement("button");
        deleteButton.type = "submit";
        deleteButton.id = "delete";
        deleteButton.classList.add("deleteButton");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        // On relie les éléments img et title à leur parent card
        cardModal.appendChild(imgCardModal);
        cardModal.appendChild(titleCardModal);
        cardModal.appendChild(deleteButton);

        // La carte complète est ajoutée à la div de la galerie.
        galleryModal.appendChild(cardModal);

        // Evènement au clic pour supprimer un projet
        deleteButton.addEventListener("click", async (event) => {
          event.preventDefault();
          if (confirm("Voulez-vous supprimer le projet ?")) {
            const id = cardModal.id;
            const monToken = localStorage.getItem("token");
            // Envoi de la demande à l'API pour supprimer le projet
            try {
              const response = await fetch(
                `http://localhost:5678/api/works/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${monToken}`,
                  },
                }
              );
              // Si la réponse est ok, on actualise les galeries
              if (response.ok) {
                getWorks();
                getWorksModal();
              } else {
                // Sinon on alerte l'utilisateur d'une erreur
                alert("Echec de la suppresion du projet...");
              }
            } catch (error) {
              console.log("Une erreur est survenue", error);
            }
          } else {
            alert("Le projet n'a pas été supprimé");
          }
        });
      });
    });
}

// ------------------------------------------------------------------------------------
// CREATION DU FORMULAIRE D'AJOUT D'UN PROJET DANS LE MODALE 2

const formModalTwo = document.getElementById("modal_two-form-id"); // formulaire d'ajout d'un projet
const inputImage = document.getElementById("addPhoto"); // input pour ajouter une photo
const titleProject = document.getElementById("photoTitle"); // titre du projet
const categoryProject = document.getElementById("photoCategories"); // selection categories
const validateProject = document.getElementById("validateProject"); // bouton valider
let errorForm = document.getElementById("errorForm"); // message d'erreur

// Fonction pour previsualiser l'image avant de l'envoyer
inputImage.addEventListener("change", previewPicture);
function previewPicture(event) {
  event.preventDefault();

  const reader = new FileReader(); // On crée un nouvel objet FileReader pour lire l'image
  reader.readAsDataURL(inputImage.files[0]); // On lit le fichier image
  reader.addEventListener("load", () => {
    const previewImage = document.createElement("img");
    previewImage.setAttribute("id", "previewImage"); // ajoute id pour pouvoir la supprimer lors du reset du formulaire
    previewImage.src = reader.result;
    previewImage.style.width = "140px"; // attribution de la largeur
    previewImage.style.height = "183px";

    // On relie l'image au parent imgcontaineur
    const pictureContainer = document.querySelector(".modal_two-imgcontainer");
    pictureContainer.appendChild(previewImage);

    // Cacher le label de texte pendant la prévisualisation
    const labelPicture = document.querySelector(".modal_two-textAddPhoto");
    labelPicture.style.display = "none";
  });
}

// Fonction pour supprimer l'image prévisualisée si on clique dessus
const selectPreview = document.querySelector(".modal_two-imgcontainer");
selectPreview.addEventListener("click", removePreviewImage);
function removePreviewImage() {
  const previewImageSelected = document.getElementById("previewImage");
  if (previewImageSelected) {
    previewImage.remove(); // Supprime l'image de la prévisualisation
  }
  // Rendre le label visible à nouveau
  const labelPicture = document.querySelector(".modal_two-textAddPhoto");
  labelPicture.style.display = "block"; // Rendre le label visible à nouveau
}

// Ajout des catégories au formulaire a partir de l'API
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((dataCategories) => {
    const select = document.getElementById("photoCategories");
    const emptyOption = document.createElement("option"); // Catégorie vide pour le visuel
    select.appendChild(emptyOption);
    // Récupération dynamique des catégories présentes sur API
    dataCategories.forEach((category) => {
      const option = document.createElement("option");
      option.innerText = category.name;
      option.value = category.id;
      select.appendChild(option);
    });
  });

// Listeners sur les infos à soumettre pour que le bouton "Valider" passe au vert
inputImage.addEventListener("input", verifForm);
titleProject.addEventListener("input", verifForm);
categoryProject.addEventListener("input", verifForm);
// Fonction pour passer le bouton "Valider" au vert si les champs sont remplis
function verifForm() {
  if (
    titleProject.value !== "" &&
    categoryProject.value !== "" &&
    inputImage.value !== ""
  ) {
    errorForm.style.display = "none";
    validateProject.classList.add("active"); // Ajoute la classe active
  } else {
    errorForm.innerText = "Veuillez renseigner tous les champs";
    validateProject.classList.remove("active"); // retrait de la classe active
  }
}

// Fonction pour valider le formulaire
async function validationFormModalTwo() {
  // Sélection des infos pour soumettre le formulaire
  const inputImageUrl = document.getElementById("addPhoto").files[0];
  const titleProject = document.getElementById("photoTitle").value;
  const categoryProject = document.getElementById("photoCategories").value;

  // Sélection des galeries et de la modale
  const gallery = document.querySelector(".gallery");
  const galleryModal = document.querySelector(".modal_one-gallery");
  const modalContainer = document.querySelector(".modal_container");

  // On crée le formulaire de soumission du projet
  let formData = new FormData();
  formData.append("image", inputImageUrl);
  formData.append("title", titleProject);
  formData.append("category", categoryProject);

  const myToken = localStorage.getItem("token");

  await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${myToken}`,
    },
    body: formData,
  })
    // Si la réponse est OK (status 201)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Erreur lors du transfert");
    })
    .then((data) => {
      // Réinitialisation des galeries
      gallery.innerHTML = "";
      galleryModal.innerHTML = "";
      // On recharge dynamiquement les galeries
      getWorks();
      getWorksModal();
      validateProject.classList.remove("active"); // Bouton "Valider" du formulaire redevient gris
      modalContainer.classList.remove("active"); // Fermeture de la modale
    })
    .catch((error) => {
      console.log(error);
    });
}

// Fonction reset du formulaire d'ajout de projet
function resetForm() {
  document.getElementById("modal_two-form-id").reset();

  const previewImageSelected = document.getElementById("previewImage");
  if (previewImageSelected) {
    previewImage.remove(); // Supprime l'image de la prévisualisation
  }
  // Rendre le label visible à nouveau
  const labelPicture = document.querySelector(".modal_two-textAddPhoto");
  labelPicture.style.display = "block"; // Rendre le label visible à nouveau
}

// Evènement au clic pour soumettre le formulaire et appeler les fonction de validation et de reset
formModalTwo.addEventListener("submit", (event) => {
  event.preventDefault();
  validationFormModalTwo();
  resetForm();
});

getWorksModal(); // appel de la fonction pour afficher les projets dans la modale
