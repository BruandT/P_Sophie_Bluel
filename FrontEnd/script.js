const url = 'http://localhost:5678/api';
const urlWorks = `${url}/works`;
const imagesContainer = document.querySelector('.gallery');
const galleryModal = document.querySelector('#gallery-main');

window.onload = ()=>{
    sessionStorage.setItem('ids', JSON.stringify([]))
    sessionStorage.removeItem("idDeleted")

}

// reset les galeries principale et modale
resetGallery();

// appel les works de l'api
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

            // pour test le delete
            const ids = data.map(item => item.id);
            // Convertit le tableau d'IDs en chaîne de caractères JSON
            const idsString = JSON.stringify(ids);
            sessionStorage.setItem('ids', idsString);

        }
        
        const liItem = document.querySelectorAll('#tri li');
        const figureItem = document.querySelectorAll('.gallery figure');
        // partie filtre
        liItem.forEach (li => {
            li.onclick = function(){    
                // changement de class pour le clique (changement de style)
                liItem.forEach(li => {
                    li.className = "";
                })
                li.className = "tri-option";          
                
                // filtre
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

// element de gallery
function createElement(data){
    // creation des differents elements
    const figure = document.createElement('figure');
    const figureCaption = document.createElement('figcaption');
    const figureImage = document.createElement('img');
    
    // ajout des valeurs de l'objet 
    figureImage.src = data.imageUrl;
    figureImage.alt = data.title;
    figureCaption.innerHTML = data.title;
    figure.setAttribute('data-category', data.categoryId);
    figure.setAttribute('data-id', data.id);
    
    // liaison des enfants et des parents
    imagesContainer.appendChild(figure);
    figure.appendChild(figureImage);
    figure.appendChild(figureCaption);
}
// element de modal gallery
function createElementModal(data){
    //creation des differents elements
    const divCard = document.createElement('div');
    const buttonEditCard = document.createElement('button');
    const divImage = document.createElement('img');
    const deleteDivCard = document.createElement('i');
    const moveDivCard = document.createElement('i');
    
    // ajout des valeurs de l'objet 
    divImage.src = data.imageUrl;
    buttonEditCard.innerHTML = "éditer";
    divCard.setAttribute('data-category', data.categoryId);
    divCard.setAttribute('id', data.id);
    
    // ajout des classes aux elements
    divCard.className = 'gallery-card';
    buttonEditCard.className = 'button-edit-img-modal';
    deleteDivCard.className = 'fa-trash-can';
    deleteDivCard.classList.add('fas', 'fa-trash-alt');
    moveDivCard.className = 'fa-arrows-up-down-left-right';
    moveDivCard.classList.add('fa-solid', 'fa-arrows-up-down-left-right');
    
    // liaison des enfants et des parents
    galleryModal.appendChild(divCard);
    divCard.appendChild(divImage);
    divCard.appendChild(buttonEditCard);
    divCard.appendChild(deleteDivCard);
    divCard.appendChild(moveDivCard);


    // ajout de l'écouteur d'événements sur l'icône de poubelle
    deleteDivCard.addEventListener('click', ()=>{   
        document.querySelector(`[data-id="${data.id}"]`).remove()
        document.querySelector(`[id="${data.id}"]`).remove()  

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

function resetGallery(){
    // reset la classe gallery
    document.querySelector('.gallery').innerHTML = " ";
    document.querySelector('#gallery-main').innerHTML = " ";
}
// clear modal
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

// ajout de photo dans la modal
const inputPicture = document.getElementById("picture");
const cardPicture = document.getElementById("before-add");
const divPicture = document.getElementById("picture-add-card");

// ajouter un écouteur d'événement sur l'élément input
inputPicture.addEventListener("change", function(event) {
    event.preventDefault()
    // récupérer le fichier sélectionné
    const file = inputPicture.files[0];
    // vérifier que le fichier est une image
    if (file.type.startsWith("image/") && (file.type === "image/jpeg" || file.type === "image/png")) {
        // creer un element img
        let imgInput = document.createElement('img');
        imgInput.setAttribute("id", "img-input")
        divPicture.appendChild(imgInput)
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
        clearModal()
    })
}
closeModal('#close-gallery-modal', '#gallery-modal');
closeModal('#close-picture-modal', '#picture-modal');


// tout supprimer gallery
const deleteModalGallery = document.querySelector("#delete-gallery");
const modalGallery = document.querySelector("#gallery-main");
deleteModalGallery.addEventListener('click', (e)=>{
    e.preventDefault();
    deleteAll();
})
const deleteAll = () => {  
    let idDelete = JSON.parse(sessionStorage.getItem('ids')) || [];
    // Vérifier si le tableau contient des éléments
    if (idDelete.length > 0) {
        // Itérer sur chaque élément du tableau
        idDelete.forEach((id) => {
            // Envoyer une requête DELETE pour supprimer l'élément correspondant du serveur
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



// formulaire d'envoi
const form = document.getElementById("myForm");

// fonction verification des champs
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
// event verification des champs
form.addEventListener("change", checkItems);

// creation dans le dom
form.addEventListener("submit", async (e) => {    
    e.preventDefault();
    const title = document.getElementById("picture-title");
    const category = document.getElementById("categories-picture");
    const imageAdd = document.getElementById("picture");
    const figure = document.createElement('figure');
    const figureCaption = document.createElement('figcaption');
    const figureImage = document.createElement('img');
    const divImage = document.createElement('img');

    // input file 
    const file = imageAdd.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        figureImage.src = event.target.result;
        divImage.src = event.target.result; 
    };
    reader.readAsDataURL(file);
    
    figureImage.alt = title.value;
    figureCaption.innerHTML = title.value;
    figure.setAttribute('data-category', category.value);
        
    imagesContainer.appendChild(figure);
    figure.appendChild(figureImage);
    figure.appendChild(figureCaption);
    
    const divCard = document.createElement('div');
    const buttonEditCard = document.createElement('button');
    const deleteDivCard = document.createElement('i');
    const moveDivCard = document.createElement('i');
    
    // ajout des valeurs de l'objet 
    buttonEditCard.innerHTML = "éditer";
    divCard.setAttribute('data-category', category.value);
    divCard.style.display = "flex";
    
    // ajout des classes aux elements
    divCard.className = 'gallery-card';
    buttonEditCard.className = 'button-edit-img-modal';
    deleteDivCard.className = 'fa-trash-can';
    deleteDivCard.classList.add('fas', 'fa-trash-alt');
    moveDivCard.className = 'fa-arrows-up-down-left-right';
    moveDivCard.classList.add('fa-solid', 'fa-arrows-up-down-left-right');

    // liaison des enfants et des parents
    galleryModal.appendChild(divCard);
    divCard.appendChild(divImage);
    divCard.appendChild(buttonEditCard);
    divCard.appendChild(deleteDivCard);
    divCard.appendChild(moveDivCard);

   // Créer un nouvel objet FormData pour chaque élément
   let formData = new FormData();
   formData.append("title", title.value);
   formData.append("category", category.value);
   formData.append("image", imageAdd.files[0]);

    // envois a l'api par rapport au nombre de formData dans le formDataArray
        
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
        document.getElementById("categories-picture").value = "";
        const id = data.id;
        divCard.setAttribute('id', id);
        figure.setAttribute('data-id', id);
        const pushStorage = JSON.parse(sessionStorage.getItem("ids"));
        pushStorage.push(id);
        sessionStorage.setItem("ids", JSON.stringify(pushStorage));
        console.log("requete POST passé", data);
        const liItem = document.querySelectorAll('#tri li');
        const figureItem = document.querySelectorAll('.gallery figure');
        // partie filtre
        liItem.forEach (li => {
            li.onclick = function(){    
                // changement de class pour le clique (changement de style)
                liItem.forEach(li => {
                    li.className = "";
                })
                li.className = "tri-option";          
                
                // filtre
                const valueCategories = li.getAttribute('data-categories');
                figureItem.forEach(figure => {
                    figure.style.display = 'none';
                    if (figure.getAttribute('data-category') == valueCategories || valueCategories == 'all') {
                        figure.style.display = 'block';
                    }
                })
            }    
        })
         // ajout de l'écouteur d'événements sur l'icône de poubelle
    deleteDivCard.addEventListener('click', ()=>{  
         
        document.querySelector(`[data-id="${data.id}"]`).remove()
        document.querySelector(`[id="${data.id}"]`).remove()  

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


// back to modal projet
const imgInputModal = document.querySelector("#img-input")
const backToProject = document.querySelector("#back-to-modal");
backToProject.addEventListener('click', ()=>{  
    modalPicture.style.display = "none";
    modalProjet.style.display = "flex";
    cardPicture.style.display = "flex";
    clearModal()
    
})
// bouton logOut
logOut.addEventListener('click', () =>{
    localStorage.removeItem('token');
    if (token) {
        logOut.style.display = "none";
        logIn.style.display = "block";    
    }
})