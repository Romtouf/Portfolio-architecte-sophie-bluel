// Récupération des id et token pour confirmer la connexion ou non
const token = localStorage.getItem("token");
const authentication = document.querySelector(".login");
if (token !== null && token !== undefined) {
  authentication.innerHTML = "";
  let logOut = document.createElement("span");
  logOut.innerText = "logout";
  logOut.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  // Modification de la page d'accueil une fois le login confirmé
  const edit = document.querySelector(".edition");
  edit.style.display = "flex";

  const modif = document.querySelector(".modifier");
  const modifTitle = document.querySelector(".titleProject");
  const filtersDisplay = document.querySelector(".filtres");

  modif.style.display = "block";
  modifTitle.style.marginLeft = "122px";
  filtersDisplay.style.display = "none";

  authentication.appendChild(logOut);
}

authentication.addEventListener("click", () => {
  window.location.href = "login.html";
});

// Tableau des works
let workList = [];

// Ajouter les images via API
function apiWorks() {
  return fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((works) => {
        workList = works;
      })
      .catch(() => alert('Error while recovering works'));
}

// Fonction pour afficher les works dans la galerie
function afficherImages(works) {
  const galerie = document.querySelector(".gallery");

  // Boucle pour récupérer tous les éléments des works
  works.forEach((photos) => {
    let figure = document.createElement("figure");
    let images = document.createElement("img");
    let figCaptions = document.createElement("figcaption");
    images.src = photos.imageUrl;
    images.alt = photos.title;
    figCaptions.innerText = photos.title;

    // Rattachement des éléments
    figure.appendChild(images);
    figure.appendChild(figCaptions);
    galerie.appendChild(figure);
  });
}

function workListInModal(works) {
  const galleryModal = document.querySelector(".galleryModal");
  works.forEach((photo) => {
    let figure = document.createElement("figure");
    let deleteElement = document.createElement("i");
    let arrowElement = document.createElement("i");
    let images = document.createElement("img");
    let figCaptions = document.createElement("figcaption");

    images.src = photo.imageUrl;
    images.alt = photo.title;
    figCaptions.innerText = "éditer";
    figure.classList.add("divModal");
    deleteElement.classList.add("fa-solid", "fa-trash-can", "deleteImage");
    arrowElement.classList.add(
        "fa-solid",
        "fa-arrows-up-down-left-right",
        "arrowDisplay"
    );

    // Évènement au déplacement de la souris pour faire apparaître le logo "4 flèches" indiquant sur quelle image nous nous situons
    figure.addEventListener("mouseover", () => {
      arrowElement.classList.toggle("arrowDisplay");
    });

    // Récupération de l'id des images
    let id = images.id;
    id = photo.id;

    // Ajout évènement au clic sur l'icône avec un fetch Delete sur l'id photo
    deleteElement.addEventListener("click", (e) => {
      e.preventDefault();
      fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((data) => {
        if (data.ok) {
          document.querySelector(".galleryModal").innerHTML = " ";
          document.querySelector(".gallery").innerHTML = " ";
          apiWorks().then(() => {
            afficherImages(workList);
            workListInModal(workList);
          });
        } else {
          alert("Error");
        }
      });
    });

    // Rattachement des éléments
    figure.appendChild(images);
    figure.appendChild(figCaptions);
    figure.appendChild(deleteElement);
    figure.appendChild(arrowElement);
    galleryModal.appendChild(figure);
  });
}

// Récupération des works pour la modale
function contenuModal(works) {
  const galleryModal = document.querySelector(".galleryModal");

  workListInModal(works);

  // Récupération des éléments du DOM pour créer la modale
  const modal = document.querySelector(".modal");
  const addPhoto = document.querySelector(".addPhoto");
  const deleteGallery = document.querySelector(".deleteGallery");
  let titleModal = document.querySelector(".titleModal");

  // Évènement au clic pour faire apparaître la modale "Ajout photo"
  addPhoto.addEventListener("click", () => {
    galleryModal.style.display = "none";
    addPhoto.style.display = "none";
    deleteGallery.style.display = "none";
    titleModal.innerText = "Ajout photo";

    // Ajout de la flèche "retour"
    const arrowAjout = document.createElement("i");
    arrowAjout.classList.add("fa-solid", "fa-arrow-left");

    // Ajout du bloc qui servira à upload une photo et l'afficher
    const blockAjout = document.createElement("div");
    blockAjout.classList.add("divBlockAjout");

    const logoAjout = document.createElement("i");
    logoAjout.classList.add("fa-sharp", "fa-regular", "fa-image");

    const buttonAjout = document.createElement("button");
    buttonAjout.classList.add("buttonAjout");
    buttonAjout.innerText = "+ Ajouter photo";

    // Création du texte sur la taille à respecter de l'image à uploader
    const textAjout = document.createElement("span");
    textAjout.classList.add("textAjout");
    textAjout.innerText = "jpg, png : 4mo max";

    // Création du formulaire d'ajout photo
    const formAjout = document.createElement("form");
    formAjout.classList.add("formAjout");
    formAjout.method = "post";
    formAjout.enctype = "multipart/form-data";

    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.id = "inputImage";
    imageInput.name = "image";
    imageInput.accept = "image/png, image/jpeg, image/jpg";
    imageInput.required = "true";

    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title");
    titleLabel.classList.add("labelTitle");
    titleLabel.textContent = "Titre";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "titleForm";
    titleInput.name = "title";
    titleInput.required = "true";

    const categoryLabel = document.createElement("label");
    categoryLabel.setAttribute("for", "category");
    categoryLabel.classList.add("labelCategory");
    categoryLabel.textContent = "Catégorie";

    const categorySelect = document.createElement("select");
    categorySelect.id = "selectCategory";
    categorySelect.name = "category";

    const optionCategory = document.createElement("option");
    optionCategory.value = "";

    const optionCategoryObjects = document.createElement("option");
    optionCategoryObjects.classList.add("selectCategoryElement");
    optionCategoryObjects.id = "objets";
    optionCategoryObjects.value = "1";
    optionCategoryObjects.textContent = "Objets";

    const optionCategoryAppartments = document.createElement("option");
    optionCategoryAppartments.classList.add("selectCategoryElement");
    optionCategoryAppartments.id = "appartements";
    optionCategoryAppartments.value = "2";
    optionCategoryAppartments.textContent = "Appartements";

    const optionCategoryHotels = document.createElement("option");
    optionCategoryHotels.classList.add("selectCategoryElement");
    optionCategoryHotels.id = "hotels&restaurants";
    optionCategoryHotels.value = "3";
    optionCategoryHotels.textContent = "Hôtels & restaurants";

    // Création du bouton de validation du formulaire
    const buttonValider = document.createElement("input");
    buttonValider.classList.add("buttonValidation");
    buttonValider.type = "submit";
    buttonValider.value = "Valider";
    buttonValider.disabled = true;

    // Mise en place d'une balise "img" permettant de voir l'image uploadée

    const previewImage = document.createElement("img");
    previewImage.classList.add("preview");

    const errorForm = document.createElement("p");
    errorForm.classList.add("errorForm");
    errorForm.innerText = "Veuillez renseigner tous les champs du formulaire";
    errorForm.style.display = "none";
    modal.appendChild(errorForm);

    formAjout.addEventListener("change", () => {
      fileImage = inputImage.files[0];
      previewImage.src = URL.createObjectURL(fileImage);
      previewImage.style.opacity = "1";
      buttonAjout.style.display = "none";

      // Limite de 4Mo pour l'upload

      if (fileImage.size === 0 || fileImage.size > 4194304) {
        alert("Fichier trop volumineux");
        previewImage.src = URL.revokeObjectURL(fileImage);
        previewImage.style.opacity = "0";
        buttonAjout.style.display = "";
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(fileImage);
      }

      // Fonction pour vérifier si le formulaire est correctement rempli et activer le bouton "Valider"

      if (
          inputImage.value !== "" &&
          titleInput.value !== "" &&
          categorySelect.value !== ""
      ) {
        buttonValider.style.background = "#1D6154";
        buttonValider.disabled = false;
        buttonValider.style.cursor = "pointer";
        errorForm.style.display = "none";
      } else {
        buttonValider.style.background = "";
        errorForm.style.display = "";
        buttonValider.disabled = "true";
      }
    });
    // Écouteur d'évènement "submit" du formulaire
    formAjout.addEventListener("submit", (e) => {
      e.preventDefault();

      const imageValue = inputImage.files[0];
      const titleValue = titleInput.value;
      const categoryValue = categorySelect.value;

      const formData = new FormData();

      formData.append("title", titleValue);
      formData.append("category", categoryValue);
      formData.append("image", imageValue);

      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
          .then((response) => response.json())
          .then(() => {
              document.querySelector(".galleryModal").innerHTML = " ";
              document.querySelector(".gallery").innerHTML = " ";
              apiWorks().then(() => {
                afficherImages(workList);
                workListInModal(workList);
              });
              previewImage.src = URL.revokeObjectURL(fileImage);
              previewImage.style.opacity = "0";
              buttonAjout.style.display = "";
              titleInput.value = "";
              categorySelect.value = "";
              toggleModal();
          })
          .catch(() => {
            alert("Erreur lors de l'envoi des données");
            previewImage.src = URL.revokeObjectURL(fileImage);
            previewImage.style.opacity = "0";
            buttonAjout.style.display = "";
            titleInput.value = "";
            categorySelect.value = "";
          });
    });

    // Au clic sur la flèche, retour sur la modale "Galerie photo"
    arrowAjout.addEventListener("click", () => {
      arrowAjout.style.display = "none";
      blockAjout.style.display = "none";
      formAjout.style.display = "none";
      buttonValider.style.display = "none";
      titleModal.innerText = "Galerie photo";
      galleryModal.style.display = "";
      addPhoto.style.display = "";
      deleteGallery.style.display = "";
    });

    // Rattacher les éléments
    modal.appendChild(arrowAjout);
    blockAjout.appendChild(logoAjout);
    blockAjout.appendChild(previewImage);
    logoAjout.appendChild(buttonAjout);
    buttonAjout.appendChild(textAjout);
    modal.appendChild(formAjout);
    formAjout.appendChild(imageInput);
    formAjout.appendChild(titleLabel);
    formAjout.appendChild(titleInput);
    formAjout.appendChild(categoryLabel);
    formAjout.appendChild(categorySelect);
    formAjout.appendChild(buttonValider);
    categorySelect.appendChild(optionCategory);
    categorySelect.appendChild(optionCategoryObjects);
    categorySelect.appendChild(optionCategoryAppartments);
    categorySelect.appendChild(optionCategoryHotels);

    modal.appendChild(blockAjout);
  });
}

// Fonction de filtrage par catégorie
function sortByCategory(categoryId) {
  document.querySelector(".gallery").innerHTML = " ";
  let worksFiltered = workList.filter((work) => work.categoryId === categoryId);
  afficherImages(worksFiltered);
}

// Création des boutons filtres via API
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    const filtres = document.querySelector(".filtres");

    // Création du bouton filtres "Tous"
    let buttonTous = document.createElement("button");
    buttonTous.innerText = "Tous";
    filtres.appendChild(buttonTous);
    buttonTous.addEventListener("click", () => {
      document.querySelector(".gallery").innerHTML = " ";
      afficherImages(workList);
    });

    // Création des 3 filtres
    categories.forEach((categorie) => {
      let button = document.createElement("button");
      button.innerText = categorie.name;
      // Ajout du clic sur les boutons filtres
      button.addEventListener("click", () => {
        sortByCategory(categorie.id);
      });
      // Rattachement des éléments
      filtres.appendChild(button);
    });
  });

apiWorks()
    .then(() => {
      afficherImages(workList);
      contenuModal(workList);
    });

// Création de la modale
const modalContainer = document.querySelector(".modalContainer");
const modalClick = document.querySelectorAll(".modalClick");

// Fonction pour ouvrir/fermer la modale
function toggleModal() {
  modalContainer.classList.toggle("active");
}

// Évènement au clic pour faire fonctionner le "toggle" de la modale
modalClick.forEach((clic) =>
  clic.addEventListener("click", () => {
    toggleModal();
  })
);