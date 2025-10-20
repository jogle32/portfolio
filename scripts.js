
///////////////////////////////////////////////////////////////////
// INIT PARTICLES //
///////////////////////////////////////////////////////////////////
window.onload = function() {
  Particles.init({
	selector: '.background',
  color: ['#DA0463', '#404B69', '#DBEDF3'],
	connectParticles: 'true',
	maxParticles: '150',
  

	responsive: [
    {
      breakpoint: 768,
      options: {
        maxParticles: 50,
        connectParticles: true
      }
    }, {
      breakpoint: 425,
      options: {
        maxParticles: 30,
        connectParticles: true
      }
    }, {
      breakpoint: 320,
      options: {
        maxParticles: 15
      }
    }
  ]
  });
};

///////////////////////////////////////////////////////////////////
// SCROLLING //
///////////////////////////////////////////////////////////////////
let about = document.querySelector('.about-btn');
let projects = document.querySelector('.projects-btn');
let contact = document.querySelector('.contact-btn');

let scrollOptions = { 
        behavior: 'smooth',
        block: 'start'
      };

about.addEventListener('click', (e)=>{
  document.querySelector('#gallery').scrollIntoView(scrollOptions)
});

projects.addEventListener('click', (e)=>{
    document.querySelector('.about-blurb').scrollIntoView(scrollOptions)
});

contact.addEventListener('click', (e)=>{
    document.querySelector('.contact').scrollIntoView(scrollOptions) 
});

///////////////////////////////////////////////////////////////////
// POPULATE GALLERY //
///////////////////////////////////////////////////////////////////
fetch('imageGallery.json')
  .then(response => {
    if (!response.ok) throw new Error('Failed to load JSON');
    return response.json();
  })
  .then(imageGallery => {
    const galleryDiv = document.getElementById('gallery');
    imageGallery.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = "Gallery Image";
      img.loading = "lazy";
      galleryDiv.appendChild(img);
    });
  })
  .catch(error => console.error('Error loading image gallery:', error));