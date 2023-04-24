const url = 'http://localhost:5678/api';
const urlWorks = `${url}/works`;
const imagesContainer = document.querySelector('.gallery');
const galleryModal = document.querySelector('#gallery-main');


window.onload = ()=>{
    sessionStorage.setItem('ids', JSON.stringify([]))
}

// Reset gallery (imagesContainer, galleryModal)
resetGallery();

// Recuperation des projets depuis l'api
async function getData(urlWorks){
    await fetch(urlWorks)
    .then(response => {
        if (response.ok) {
            return response.json()            
        }
    })
    .then(function(data){
        for (let i = 0; i < data.length; i++) {
            createElement(data[i]);
            createElementModal(data[i]);

            // Ajout des id dans le sessionStorage pour les utiliser pour la suppression
            const ids = data.map(item => item.id);
            const idsString = JSON.stringify(ids);
            sessionStorage.setItem('ids', idsString);

        }
        
        const liItem = document.querySelectorAll('#tri li');
        const figureItem = document.querySelectorAll('.gallery figure');

        // Filtre
        liItem.forEach (li => {
            li.onclick = function(){    
                // Lors du clique, enleve la classe a tous les <li>
                liItem.forEach(li => {
                    li.className = "";
                })
                // Cliquer sur le <li> lui ajoute la classe
                li.className = "tri-option";          
                
                // Compare les valeurs de categorie entre l'api et le html
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

// Appel de la function
getData(urlWorks);

// Element de la galerie
function createElement(data){

    // Creation de <figure>
    const figure = document.createElement('figure');
    figure.setAttribute('data-category', data.categoryId);
    figure.setAttribute('data-id', data.id);
    imagesContainer.appendChild(figure);    

    // Creation de <img>
    const figureImage = document.createElement('img');
    figureImage.src = data.imageUrl;
    figureImage.alt = data.title;
    figure.appendChild(figureImage); 

    // Creation de <figcaption>
    const figureCaption = document.createElement('figcaption');
    figureCaption.innerHTML = data.title;
    figure.appendChild(figureCaption);  
}

// Element de la modale
function createElementModal(data){

    // Creation de la <div> pour les projets dans la modale
    const divCard = document.createElement('div');
    divCard.setAttribute('data-category', data.categoryId);
    divCard.setAttribute('id', data.id);
    divCard.className = 'gallery-card';
    galleryModal.appendChild(divCard);

    // Creation de <img>
    const divImage = document.createElement('img');
    divImage.src = data.imageUrl;
    divCard.appendChild(divImage);

    // Creation de <button> pour edite (non fonctionnel)
    const buttonEditCard = document.createElement('button');
    buttonEditCard.innerHTML = "éditer";
    buttonEditCard.className = 'button-edit-img-modal';
    divCard.appendChild(buttonEditCard);

    // Creation de <i> pour le delete la <div>
    const deleteDivCard = document.createElement('i');
    deleteDivCard.className = 'fa-trash-can';
    deleteDivCard.classList.add('fas', 'fa-trash-alt');
    divCard.appendChild(deleteDivCard);

    // Creation de <i> pour deplacer la <div> (non fonctionnel)
    const moveDivCard = document.createElement('i');
    moveDivCard.className = 'fa-arrows-up-down-left-right';
    moveDivCard.classList.add('fa-solid', 'fa-arrows-up-down-left-right');
    divCard.appendChild(moveDivCard);



    // Ajout de l'ecouteur d'evenements sur l'icone de poubelle
    deleteDivCard.addEventListener('click', ()=>{ 
        // Remove le projet dans (imagesContainer) 
        document.querySelector(`[data-id="${data.id}"]`).remove()
        // Remove le projet dans (galleryModal)
        document.querySelector(`[id="${data.id}"]`).remove()  

        // Suppression du projet depuis l'API
        fetch(`http://localhost:5678/api/works/${data.id}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "*/*",
                        Authorization: "Bearer " + token,
                    },
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
    });
    
}

// Reset les galeries
function resetGallery(){
    imagesContainer.innerHTML = " ";
    galleryModal.innerHTML = " ";
}



// Reinitialisation des modales
function clearModal(){
    const infoTitle = document.getElementById("info-title");
    const infoImg = document.getElementById("info-img");
    const infoSelect = document.getElementById("info-select");
    infoTitle.style.visibility = "visible";
    infoImg.style.visibility = "visible";
    infoSelect.style.visibility = "visible";
    infoSelect.value = "";
    inputPicture.value = "";
    if (document.querySelector("#img-input") != null) {
        document.querySelector("#img-input").remove() 
    }
    document.getElementById("picture-title").value ="";
}


// Ajout de la photo dans la modale
const inputPicture = document.getElementById("picture");
const cardPicture = document.getElementById("before-add");
const divPicture = document.getElementById("picture-add-card");

// Ajout de l'ecouteur d'evenements sur (inputPicture)
inputPicture.addEventListener("change", function(event) {
    event.preventDefault()

    // Recupere le fichier
    const file = inputPicture.files[0];
    // Verifie que le fichier est une image
    if (file.type.startsWith("image/") && (file.type === "image/jpeg" || file.type === "image/png")) {
        // Creer un element img
        let imgInput = document.createElement('img');
        imgInput.setAttribute("id", "img-input")
        divPicture.appendChild(imgInput)
        // Creer un objet URL pour afficher l'image
        const imageUrl = URL.createObjectURL(file);    
        // Remplace le contenu de la div avec l'image        
        imgInput.src = imageUrl;        
        cardPicture.style.display = "none";
        imgInput.style.display = "flex";        
    } else {
        alert("Veuillez sélectionner un fichier image (jpg ou png).");
    }
    
});


// Ouvre la modale "Galerie photo"
const openModalProjet = document.querySelector("#change-portfolio");
const modalProjet = document.querySelector("#gallery-modal");
openModalProjet.addEventListener('click', ()=>{
    modalProjet.style.display = "flex";
})

// Ouvre la modale "Ajout photo"
const openModalPicture = document.querySelector("#open-picture-modal");
const modalPicture = document.querySelector("#picture-modal");
openModalPicture.addEventListener('click', ()=>{
    modalPicture.style.display = "flex";
    modalProjet.style.display = "none";
})

// Function pour fermer les modales
function closeModal(close, modal){
    let closeModal = document.querySelector(close);
    let modalDisplay = document.querySelector(modal);
    closeModal.addEventListener('click', ()=>{
        modalDisplay.style.display = "none";
        cardPicture.style.display = "flex" 
        clearModal()
    })
}
closeModal('#close-gallery-modal', '#gallery-modal');
closeModal('#close-picture-modal', '#picture-modal');


// Supprime tous les projets du site
const deleteModalGallery = document.querySelector("#delete-gallery");
const modalGallery = document.querySelector("#gallery-main");
deleteModalGallery.addEventListener('click', (e)=>{
    e.preventDefault();
    deleteAll();
})
const deleteAll = () => {  
    let idDelete = JSON.parse(sessionStorage.getItem('ids')) || [];
    // Verifie si le tableau contient des elements
    if (idDelete.length > 0) {
        // Execute l'envoi API tant que le tableau n'est pas vide
        idDelete.forEach((id) => {
            // Envoie une requete DELETE pour supprimer l'element correspondant de l'API
            fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "*/*",
                    Authorization: "Bearer " + token,
                },
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        });
    }
    resetGallery();
};

// Ajout des options Admin
const token = localStorage.getItem('token');
const logOut = document.querySelector('#log-out');
const logIn = document.querySelector('#log-in');
const editor = document.querySelector('#editor');
const editButton = document.querySelectorAll('.edit');
// Verifie si le (token) est valide, pour l'ajout des differents <button>
if(token){
    logOut.style.display = "block";
    logIn.style.display = "none";
    editor.style.display = "flex";
    editButton.forEach(button => button.style.display = "block");
}else{
    // Sinon, cache les <button>
    logOut.style.display = "none";
    logIn.style.display = "block";
    editor.style.display = "none";
    editButton.forEach(button => button.style.display = "none");
} 


const form = document.getElementById("myForm");

// Function verifie les champs du (form)
const colorValid = document.querySelector("#valid-add-picture");
function checkItems(e) {
    e.preventDefault();
    const imageAdd = document.getElementById("picture").files;
    const title = document.getElementById("picture-title").value;
    const category = document.getElementById("categories-picture").value;   
    const infoTitle = document.getElementById("info-title");
    const infoImg = document.getElementById("info-img");
    const infoSelect = document.getElementById("info-select");
    if (title != "") {
       infoTitle.style.visibility = "hidden";
    }else{
        infoTitle.style.visibility = "visible";
    }
    if (imageAdd.length != 0) {
        infoImg.style.visibility = "hidden";
    }else{
        infoImg.style.visibility = "visible";
    }
    if (category != "") {
        infoSelect.style.visibility = "hidden";
    }else{
        infoSelect.style.visibility = "visible";
    }
    if (title != "" && imageAdd.length != 0 && category != "") {
        colorValid.style.backgroundColor = "#1D6154"; 
        colorValid.disabled = false;
    }
    else {
        colorValid.style.backgroundColor = "#a7a7a7";
        colorValid.disabled = true;        
    }
}
form.addEventListener("change", checkItems);

// Creation des projets lors du submit du (form)
form.addEventListener("submit", async (e) => {    
    e.preventDefault();

    const title = document.getElementById("picture-title");
    const category = document.getElementById("categories-picture");
    const imageAdd = document.getElementById("picture");  

    // Creation de <figure>
    const figure = document.createElement('figure');
    figure.setAttribute('data-category', category.value);
    imagesContainer.appendChild(figure);
    
    // Creation de <img> + ajout de l'image
    const figureImage = document.createElement('img');
    const divImage = document.createElement('img'); 
    const file = imageAdd.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        figureImage.src = event.target.result;
        divImage.src = event.target.result; 
    };
    reader.readAsDataURL(file);
    figureImage.alt = title.value;
    figure.appendChild(figureImage);

    // Creation de <figcaption>
    const figureCaption = document.createElement('figcaption');
    figureCaption.innerHTML = title.value;
    figure.appendChild(figureCaption);    
    
    // Creation de la <div> pour les projets dans la modale
    const divCard = document.createElement('div');  
    divCard.setAttribute('data-category', category.value);
    divCard.style.display = "flex";
    divCard.className = 'gallery-card';
    galleryModal.appendChild(divCard);
    divCard.appendChild(divImage);
    
    // Creation de <button> pour edite (non fonctionnel)
    const buttonEditCard = document.createElement('button');
    buttonEditCard.innerHTML = "éditer";
    buttonEditCard.className = 'button-edit-img-modal';
    divCard.appendChild(buttonEditCard);

    // Creation de <i> pour le delete la <div>
    const deleteDivCard = document.createElement('i');
    deleteDivCard.className = 'fa-trash-can';
    deleteDivCard.classList.add('fas', 'fa-trash-alt');
    divCard.appendChild(deleteDivCard);

    // Creation de <i> pour deplacer la <div> (non fonctionnel)
    const moveDivCard = document.createElement('i');
    moveDivCard.className = 'fa-arrows-up-down-left-right';
    moveDivCard.classList.add('fa-solid', 'fa-arrows-up-down-left-right');
    divCard.appendChild(moveDivCard);

   // Creation du formData
   let formData = new FormData();
   formData.append("title", title.value);
   formData.append("category", category.value);
   formData.append("image", imageAdd.files[0]);

    // Envoi du (formData) a l'API
        
        fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            return response.json()                        
        }
    })
    .then((data) =>{
        // Remet la valeur du <select> sur une <option> vide
        document.getElementById("categories-picture").value = "";
        // Recupere l'id de data
        const id = data.id;
        // Attribut (id) aux elements
        divCard.setAttribute('id', id);
        figure.setAttribute('data-id', id);
        // Envois le (id) au sessionStorage pour la recuperer lors de la suppression
        const pushStorage = JSON.parse(sessionStorage.getItem("ids"));
        pushStorage.push(id);
        sessionStorage.setItem("ids", JSON.stringify(pushStorage));

        const liItem = document.querySelectorAll('#tri li');
        const figureItem = document.querySelectorAll('.gallery figure');
        // Filtre
        liItem.forEach (li => {
            li.onclick = function(){    
                // Lors du clique, enleve la classe a tous les <li>
                liItem.forEach(li => {
                    li.className = "";
                })
                // Cliquer sur le <li> lui ajoute la classe
                li.className = "tri-option";          
                
                // Compare les valeurs de categorie entre l'api et le html
                const valueCategories = li.getAttribute('data-categories');
                figureItem.forEach(figure => {
                    figure.style.display = 'none';
                    if (figure.getAttribute('data-category') == valueCategories || valueCategories == 'all') {
                        figure.style.display = 'block';
                    }
                })
            }    
        })
    // Ajout de l'ecouteur d'evenements sur l'icone de poubelle
    deleteDivCard.addEventListener('click', ()=>{  
        // Remove le projet dans (imagesContainer) 
        document.querySelector(`[data-id="${data.id}"]`).remove()
        // Remove le projet dans (galleryModal)
        document.querySelector(`[id="${data.id}"]`).remove()  

        // Suppression du projet depuis l'API
        fetch(`http://localhost:5678/api/works/${data.id}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "*/*",
                        Authorization: "Bearer " + token,
                    },
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
    });
    })
    .catch((error) => console.error("Error:", error));   
    modalPicture.style.display = "none";
    modalProjet.style.display = "flex";
    cardPicture.style.display = "flex";
    clearModal()
});


// Retourner sur la modale "Galerie photo"
const imgInputModal = document.querySelector("#img-input")
const backToProject = document.querySelector("#back-to-modal");
backToProject.addEventListener('click', ()=>{  
    modalPicture.style.display = "none";
    modalProjet.style.display = "flex";
    cardPicture.style.display = "flex";
    clearModal()
    
})
// <button> pour se deconnecter
logOut.addEventListener('click', () =>{
    localStorage.removeItem('token');
    if (token) {
        logOut.style.display = "none";
        logIn.style.display = "block";    
    }
})