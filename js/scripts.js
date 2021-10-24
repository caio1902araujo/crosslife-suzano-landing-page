function startScrollSmooth(){
  const internalLinks = document.querySelectorAll("a[href^='#']");

  function scrollSmooth(event){
    event.preventDefault();
    const idSection = this.getAttribute("href");
    const section = document.querySelector(idSection);
    section.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
  }

  internalLinks.forEach((link) => link.addEventListener('click', scrollSmooth))
}


function init(){
  startScrollSmooth();
}

init();