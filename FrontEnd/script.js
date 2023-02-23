const reponse = await fetch('http://localhost:5678/api/works');
const image = await reponse.json();

if(image) {
    console.log(image);
    document.querySelector('.gallery').innerHTML = " ";
    genererArt(image);
  } else {
    console.log("Erreur lors de la récupération des données de l'API");
  }

function genererArt(image){

    const imagesContainer = document.querySelector('.gallery')
    for (let i = 0; i < image.length; i++) {
            const figure = document.createElement('figure')
            const figureCaption = document.createElement('figcaption')
            const figureImage = document.createElement('img')

            figureImage.src = image[i].imageUrl
            figureImage.alt = image[i].title
            figureCaption.innerHTML = image[i].title

            imagesContainer.appendChild(figure)
            figure.appendChild(figureImage)
            figure.appendChild(figureCaption)
     }
}