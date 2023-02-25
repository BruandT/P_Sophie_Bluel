const url = 'http://localhost:5678/api/works';

function getData(url){
  fetch(url)
  .then(response => {
    
    console.log(response)
    if(response.ok){
      return response.json()
      
    }
  })
  
  .then(function(data){
    for(let i = 0; i < data.length; i++){
      console.log(data[i]);
       CreateElement(data[i])
    }
  })
  document.querySelector('.gallery').innerHTML = " ";
}

getData(url);

const imagesContainer = document.querySelector('.gallery')
function CreateElement(data){
  const figure = document.createElement('figure')
  const figureCaption = document.createElement('figcaption')
  const figureImage = document.createElement('img')

   figureImage.src = data.imageUrl
   figureImage.alt = data.title
   figureCaption.innerHTML = data.title

   imagesContainer.appendChild(figure)
   figure.appendChild(figureImage)
   figure.appendChild(figureCaption)

  
}