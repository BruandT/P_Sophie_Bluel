// Récupération des pièces depuis le fichier JSON
const reponse = await fetch('http://localhost:5678/api/works');
const data = await reponse.json();
const imagesContainer = document.querySelector('.gallery')

ResetGallery()

function RecupData(data){
    
    for(let i = 0; i < data.length; i++){
      
      CreateElement(data[i])
       
    }
}

RecupData(data)
console.log(data);


function CreateElement(data){

    //creation des differents elements
    const figure = document.createElement('figure')
    const figureCaption = document.createElement('figcaption')
    const figureImage = document.createElement('img')

    //ajout des valeurs de l'objet 
    figureImage.src = data.imageUrl
    figureImage.alt = data.title 
    figureCaption.innerHTML = data.title 
    figure.setAttribute('data-category', data.categoryId)

    //liaison des enfants et des parents
    imagesContainer.appendChild(figure)
    figure.appendChild(figureImage)
    figure.appendChild(figureCaption)
    
}

function ResetGallery(){
    //Reset la classe gallery
    document.querySelector('.gallery').innerHTML = " ";
}
  


//Partie filtre
const liItem = document.querySelectorAll('#tri li');
const figureItem = document.querySelectorAll('.gallery figure');
liItem.forEach (li => {
  li.onclick = function(){
    //changement de class pour le clique (changement de style)
    liItem.forEach(li => {
      li.className = "";
    })
    li.className = "tri-option";
    
    
    //Filtre
    const valueCategories = li.getAttribute('data-categories');
    console.log(valueCategories);
    figureItem.forEach(figure => {
      figure.style.display = 'none'
      if (figure.getAttribute('data-category') == valueCategories || valueCategories == 'all') {
        console.log(valueCategories);
        figure.style.display = 'block'
      }
    })
  }
  
})

