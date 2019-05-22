
/////////////////////////////////////////////////INIT PARTICLES
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

//////////////////////////////////////////////////////SCROLLING



let about = document.querySelector('.about-btn');
let projects = document.querySelector('.projects-btn');
let contact = document.querySelector('.contact-btn');

let scrollOptions = { 
        behavior: 'smooth',
        block: 'center'
      };

about.addEventListener('click', (e)=>{
  document.querySelector('.about').scrollIntoView(scrollOptions)
});

projects.addEventListener('click', (e)=>{
    document.querySelector('.projects').scrollIntoView(scrollOptions)
});

contact.addEventListener('click', (e)=>{
    document.querySelector('.contact').scrollIntoView(scrollOptions) 
});
