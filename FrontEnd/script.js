
const url = 'http://localhost:5678/api';
const urlWorks = `${url}/works`
const imagesContainer = document.querySelector('.gallery')

resetGallery()


function getData(urlWorks){
    fetch(urlWorks)
    .then(response => {
        if (response.ok) {
            return response.json()            
        }
    })
    .then(function(data){
        for (let i = 0; i < data.length; i++) {
            createElement(data[i])              
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
                    figure.style.display = 'none'
                    if (figure.getAttribute('data-category') == valueCategories || valueCategories == 'all') {
                        figure.style.display = 'block'
                    }
                })
            }    
        })
        
    })
}

getData(urlWorks);

function createElement(user){
    //creation des differents elements
    const figure = document.createElement('figure')
    const figureCaption = document.createElement('figcaption')
    const figureImage = document.createElement('img')
    
    //ajout des valeurs de l'objet 
    figureImage.src = user.imageUrl
    figureImage.alt = user.title 
    figureCaption.innerHTML = user.title 
    figure.setAttribute('data-category', user.categoryId)
    
    //liaison des enfants et des parents
    imagesContainer.appendChild(figure)
    figure.appendChild(figureImage)
    figure.appendChild(figureCaption)
}

function resetGallery(){
    //Reset la classe gallery
    document.querySelector('.gallery').innerHTML = " ";
}


//connexion + editor
const token = localStorage.getItem('token')
const logOut = document.querySelector('#log-out')
const logIn = document.querySelector('#log-in')
const connexion = localStorage.getItem('connected')
const editor = document.querySelector('#editor')
const editButton = document.querySelectorAll('.edit')
console.log(connexion);
if(connexion === 'yes'){
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

// edit image intro
const imgIntro = document.querySelector('#img-intro');
const buttonImgIntro = document.querySelector('#change-img-intro');
const inputImgIntro = document.querySelector("#change-img-intro-input");

buttonImgIntro.addEventListener('click', () => {
  
  if (inputImgIntro.style.display === "block") {
    inputImgIntro.style.display = "none"
} else {  
    inputImgIntro.style.display = "block" 
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
          localStorage.setItem("imgIntro", e.target.result)
        };
    
        // fichier en tant qu'URL de données
        reader.readAsDataURL(inputImgIntro.files[0]);        
        inputImgIntro.style.display = "none"
      }
})
// titre + texte intro
const buttonDescriptionIntro = document.querySelector('#change-description-intro');
const divDescriptionIntro = document.querySelectorAll('.div-edit-article')
buttonDescriptionIntro.addEventListener('click', () =>{
    divDescriptionIntro.forEach(element => {
        if (element.style.display == "flex") {
            element.style.display = "none"
        } else {  
            element.style.display = "flex" 
        }
      });
})
// fonction edit la partie intro + compteur de caractere
function countInputLength(inputSelector, maxLengthAttr, outputSelector, textChanged) {
  const inputEl = document.querySelector(inputSelector);
  const outputEl = document.querySelector(outputSelector);
  const maxLength = inputEl.getAttribute(maxLengthAttr);
  const changeEl = document.querySelector(textChanged);

  inputEl.addEventListener('input', (event) => {
    const valueLength = event.target.value.length;
    const leftCharLength = maxLength - valueLength;
    changeEl.innerHTML = inputEl.value
    if (leftCharLength < 0) return;
    outputEl.innerText = leftCharLength;
  });
}
// chaque element d'intro
countInputLength('#change-h2-intro', 'maxlength', '#span-h2-intro', '#h2-intro');
countInputLength('#change-p1-intro', 'maxlength', '#span-p1-intro', '#p1-intro');
countInputLength('#change-p2-intro', 'maxlength', '#span-p2-intro', '#p2-intro');
countInputLength('#change-p3-intro', 'maxlength', '#span-p3-intro', '#p3-intro');


const imgIntroStock= localStorage.getItem("imgIntroStock");
// bouton publier changement
const buttonEditor = document.querySelector('#editor button')
buttonEditor.addEventListener('click', () =>{
    const imgIntroLocalStorage= localStorage.getItem("imgIntro");
    if (imgIntroLocalStorage) {
        localStorage.setItem("imgIntroStock", imgIntroLocalStorage)
    }
})

if (imgIntroStock) {        
    imgIntro.src = imgIntroStock
}


logOut.addEventListener('click', () =>{
  localStorage.setItem("connected", "no")
  localStorage.removeItem('token')
  if (connexion === no) {
    logOut.style.display = "none";
    logIn.style.display = "block";    
  }
})
