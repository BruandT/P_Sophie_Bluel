
const url = 'http://localhost:5678/api';
const urlWorks = `${url}/works`;
const imagesContainer = document.querySelector('.gallery');
const galleryModal = document.querySelector('#gallery-main');

resetGallery();


function getData(urlWorks){
    fetch(urlWorks)
    .then(response => {
        if (response.ok) {
            return response.json()            
        }
    })
    .then(function(data){
        for (let i = 0; i < data.length; i++) {
            createElement(data[i]);
            createElementModal(data[i]);              
        }
        
        const liItem = document.querySelectorAll('#tri li');
        const figureItem = document.querySelectorAll('.gallery figure');
        //Partie filtre
        liItem.forEach (li => {
            li.onclick = function(){    
                //changement de class pour le clique (changement de style)
                liItem.forEach(li => {
                    li.className = "";
                })
                li.className = "tri-option";          
                
                //Filtre
                const valueCategories = li.getAttribute('data-categories');
                figureItem.forEach(figure => {
                    figure.style.display = 'none';
                    if (figure.getAttribute('data-category') == valueCategories || valueCategories == 'all') {
                        figure.style.display = 'block';
                    }
                })
            }    
        })
        
    })
}

getData(urlWorks);
// Element de gallery
function createElement(data){
    //creation des differents elements
    const figure = document.createElement('figure');
    const figureCaption = document.createElement('figcaption');
    const figureImage = document.createElement('img');
    
    //ajout des valeurs de l'objet 
    figureImage.src = data.imageUrl;
    figureImage.alt = data.title;
    figureCaption.innerHTML = data.title;
    figure.setAttribute('data-category', data.categoryId);
    
    //liaison des enfants et des parents
    imagesContainer.appendChild(figure);
    figure.appendChild(figureImage);
    figure.appendChild(figureCaption);
}

function resetGallery(){
    //Reset la classe gallery
    document.querySelector('.gallery').innerHTML = " ";
    document.querySelector('#gallery-main').innerHTML = " ";
}


//connexion + editor
const token = localStorage.getItem('token');
const logOut = document.querySelector('#log-out');
const logIn = document.querySelector('#log-in');
const editor = document.querySelector('#editor');
const editButton = document.querySelectorAll('.edit');
if(token){
    logOut.style.display = "block";
    logIn.style.display = "none";
    editor.style.display = "flex";
    editButton.forEach(button => button.style.display = "block");
}else{
    logOut.style.display = "none";
    logIn.style.display = "block";
    editor.style.display = "none";
    editButton.forEach(button => button.style.display = "none");
} 

// edit image intro (Feature non demandé dans le projet)
const imgIntro = document.querySelector('#img-intro');
const buttonImgIntro = document.querySelector('#change-img-intro');
const inputImgIntro = document.querySelector("#change-img-intro-input");

buttonImgIntro.addEventListener('click', () => {
    
    if (inputImgIntro.style.display === "block") {
        inputImgIntro.style.display = "none";
    } else {  
        inputImgIntro.style.display = "block"; 
    }
})
inputImgIntro.addEventListener('change', () =>{
    if (inputImgIntro.files && inputImgIntro.files[0]) {
        // objet FileReader
        const reader = new FileReader();
        
        // fonction de rappel de chargement du lecteur
        reader.onload = function(e) {
            // source de l'image sur l'URL de données chargée
            imgIntro.src = e.target.result;
            localStorage.setItem("imgIntro", e.target.result);
        };
        
        // fichier en tant qu'URL de données
        reader.readAsDataURL(inputImgIntro.files[0]);        
        inputImgIntro.style.display = "none";
    }
})

// titre + texte intro (Feature non demandé dans le projet)
const buttonDescriptionIntro = document.querySelector('#change-description-intro');
const divDescriptionIntro = document.querySelectorAll('.div-edit-article');
buttonDescriptionIntro.addEventListener('click', () =>{
    divDescriptionIntro.forEach(element => {
        if (element.style.display == "flex") {
            element.style.display = "none";
        } else {  
            element.style.display = "flex";
        }
    });
})
// fonction edit la partie intro + compteur de caractere (Feature non demandé dans le projet)
function countInputLength(inputSelector, maxLengthAttr, outputSelector, textChanged) {
    const inputEl = document.querySelector(inputSelector);
    const outputEl = document.querySelector(outputSelector);
    const maxLength = inputEl.getAttribute(maxLengthAttr);
    const changeEl = document.querySelector(textChanged);
    
    inputEl.addEventListener('input', (event) => {
        const valueLength = event.target.value.length;
        const leftCharLength = maxLength - valueLength;
        changeEl.innerHTML = inputEl.value;
        if (leftCharLength < 0) return;
        outputEl.innerText = leftCharLength;
    });
}
// chaque element d'intro (Feature non demandé dans le projet)
countInputLength('#change-h2-intro', 'maxlength', '#span-h2-intro', '#h2-intro');
countInputLength('#change-p1-intro', 'maxlength', '#span-p1-intro', '#p1-intro');
countInputLength('#change-p2-intro', 'maxlength', '#span-p2-intro', '#p2-intro');
countInputLength('#change-p3-intro', 'maxlength', '#span-p3-intro', '#p3-intro');

// ajout de photo dans la modal
const inputPicture = document.getElementById("picture");
const cardPicture = document.getElementById("before-add");
const imgInput = document.getElementById("img-input");
// ajouter un écouteur d'événement sur l'élément input
inputPicture.addEventListener("change", function() {
    // récupérer le fichier sélectionné
    const file = inputPicture.files[0];
    // vérifier que le fichier est une image
    if (file.type.startsWith("image/") && (file.type === "image/jpeg" || file.type === "image/png")) {
        // créer un objet URL pour afficher l'image
        const imageUrl = URL.createObjectURL(file);    
        // remplacer le contenu de la div avec l'image        
        imgInput.src = imageUrl;        
        cardPicture.style.display = "none";
        imgInput.style.display = "flex";        
    } else {
        alert("Veuillez sélectionner un fichier image (jpg ou png).");
    }
    
});


// open modal projet
const openModalProjet = document.querySelector("#change-portfolio");
const modalProjet = document.querySelector("#gallery-modal");
openModalProjet.addEventListener('click', ()=>{
    modalProjet.style.display = "flex";
})

// open modal picture
const openModalPicture = document.querySelector("#open-picture-modal");
const modalPicture = document.querySelector("#picture-modal");
openModalPicture.addEventListener('click', ()=>{
    modalPicture.style.display = "flex";
    modalProjet.style.display = "none";
})
// close modal
function closeModal(close, modal){
    let closeModal = document.querySelector(close);
    let modalDisplay = document.querySelector(modal);
    closeModal.addEventListener('click', ()=>{
        modalDisplay.style.display = "none";
        cardPicture.style.display = "flex" 
        imgInput.style.display = "none";
        inputPicture.value = "";
    })
}
closeModal('#close-gallery-modal', '#gallery-modal');
closeModal('#close-picture-modal', '#picture-modal');


// Element de modal gallery
function createElementModal(data){
    //creation des differents elements
    const divCard = document.createElement('div');
    const buttonEditCard = document.createElement('button');
    const divImage = document.createElement('img');
    const deleteDivCard = document.createElement('i');
    const moveDivCard = document.createElement('i');
    
    //ajout des valeurs de l'objet 
    divImage.src = data.imageUrl;
    buttonEditCard.innerHTML = "éditer";
    divCard.setAttribute('data-category', data.categoryId);
    divCard.setAttribute('data-id', data.id);
    
    //ajout des classes aux elements
    divCard.className = 'gallery-card';
    buttonEditCard.className = 'button-edit-img-modal';
    deleteDivCard.className = 'fa-trash-can';
    deleteDivCard.classList.add('fas', 'fa-trash-alt');
    moveDivCard.className = 'fa-arrows-up-down-left-right';
    moveDivCard.classList.add('fa-solid', 'fa-arrows-up-down-left-right');
    
    //liaison des enfants et des parents
    galleryModal.appendChild(divCard);
    divCard.appendChild(divImage);
    divCard.appendChild(buttonEditCard);
    divCard.appendChild(deleteDivCard);
    divCard.appendChild(moveDivCard);
    
    // ajout de l'écouteur d'événements sur l'icône de poubelle
    deleteDivCard.addEventListener('click', (e) =>{
        e.preventDefault();
        let dltImg = data.id;
        deleteImage(dltImg);
    })
    
} 

// fonction delete image
async function deleteImage(id) {
    document.querySelector(`[data-id="${id}"]`).remove();
    
    await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
        Accept: "*/*",
        Authorization: "Bearer " + token,
    },
})
.catch((error) => {
    console.error("Error:", error);
});
}
// tout supprimer gallery
const deleteModalGallery = document.querySelector("#delete-gallery");
const modalGallery = document.querySelector("#gallery-main");
deleteModalGallery.addEventListener('click', ()=>{
    deleteAll();
})
const deleteAll = () => {
    const cardContainer = document.querySelectorAll(".gallery-card");
    cardContainer.forEach((card) => {
      deleteImage(card.dataset.id);
    });
  };

//formulaire d'envoi
const form = document.getElementById("myForm");

// event verification des champs
form.addEventListener("change", checkItems);
// fonction verification des champs
function checkItems(e) {
    e.preventDefault();
    const imageAdd = document.getElementById("picture").files;
    const title = document.getElementById("picture-title").value;
    const category = document.getElementById("categories-picture").value;
    const colorValid = document.querySelector("#valid-add-picture");
    if (imageAdd.length != 0 && title != "" && category != "") {
        colorValid.style.backgroundColor = "#1D6154";
    } else {
        colorValid.style.backgroundColor = "#a7a7a7";
    }
}

// event recuperation des champs + envoi
form.addEventListener("submit", submitForm);
// fonction recuperation des champs + envoi
async function submitForm(e){
    e.preventDefault(); 
    const title = document.getElementById("picture-title");
    const category = document.getElementById("categories-picture");
    const imageAdd = document.getElementById("picture");   
    
    let formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", category.value);
    formData.append("image", imageAdd.files[0]);
    
    await fetch(urlWorks, {
        method: "POST",            
        headers: {Accept: "application/json",
        Authorization: "Bearer " + token,
    },
    body: formData,
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));
}




// stockage image lors du click sur les bouton publier changement (Feature non demandé dans le projet)
const imgIntroStock= localStorage.getItem("imgIntroStock");
// bouton publier changement
const buttonEditor = document.querySelector('#editor button');
buttonEditor.addEventListener('click', () =>{
    const imgIntroLocalStorage= localStorage.getItem("imgIntro");
    if (imgIntroLocalStorage) {
        localStorage.setItem("imgIntroStock", imgIntroLocalStorage);
    }
})

if (imgIntroStock) {        
    imgIntro.src = imgIntroStock
}

// back to modal projet
const backToProject = document.querySelector("#back-to-modal");
backToProject.addEventListener('click', ()=>{
    modalPicture.style.display = "none";
    modalProjet.style.display = "flex";
    cardPicture.style.display = "flex";
    imgInput.style.display = "none";
    inputPicture.value = "";
    
})
// bouton logOut
logOut.addEventListener('click', () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('imgIntro');
    if (token) {
        logOut.style.display = "none";
        logIn.style.display = "block";    
    }
})
