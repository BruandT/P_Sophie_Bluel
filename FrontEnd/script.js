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


function CreateElement(data){

    //creation des differents elements
    const figure = document.createElement('figure')
    const figureCaption = document.createElement('figcaption')
    const figureImage = document.createElement('img')

    //ajout des valeurs de l'objet 
    figureImage.src = data.imageUrl
    figureImage.alt = data.title 
    figureCaption.innerHTML = data.title 

    //liaison des enfants et des parents
    imagesContainer.appendChild(figure)
    figure.appendChild(figureImage)
    figure.appendChild(figureCaption)
    
}

function ResetGallery(){
    //Reset la classe gallery
    document.querySelector('.gallery').innerHTML = " ";
}
  

//tri des elements au clique
let triOptions = document.querySelectorAll('.tri-option');
triOptions.forEach((triOption) => {
  triOption.addEventListener('click', () => {
    //changement du bg et de la color
    if (triOption.style.backgroundColor === '') {
        triOption.style.backgroundColor = '#1D6154'
        triOption.style.color = 'white';
    } else {
      triOption.style.backgroundColor = '';      
      triOption.style.color = '#1D6154';
    }   
  });
});



function CompareCategory(filtre){

  // Récupérez la valeur personnalisée 'data-categories' de l'élément de liste
  const categories = filtre.dataset.categories; 

  // Séparez les catégories en une liste à l'aide de la méthode split()
  const categoryList = categories.split(',');

  for(let i in data){
      
      if(data[i].categoryId == categoryList){            
          // creation des elements
          CreateElement(data[i])            
      } 
  }  
}
