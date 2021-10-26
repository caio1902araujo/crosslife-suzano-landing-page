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

  internalLinks.forEach((link) => link.addEventListener("click", scrollSmooth));
}

function startClickOut(navigation, dataAttribute, removeActiveClass){
  const html = document.documentElement;

  function clickOut(event){
    if(!navigation.contains(event.target)){
      html.removeEventListener('click', clickOut);
      html.removeAttribute(dataAttribute);
      removeActiveClass();
    }
  }

  if(!html.hasAttribute(dataAttribute)){
    setTimeout(() => html.addEventListener('click', clickOut));
    html.setAttribute(dataAttribute, '');
  }

}

function startMobileMenu(){
  const buttonHamburger = document.querySelector("[data-menu='button']");
  const navigation = document.querySelector("[data-menu='navigation']");
  const dataAttribute = 'data-out'
  const removeActiveClass = () => {
    navigation.classList.remove('active');
    buttonHamburger.classList.remove('active');
  }

  function handleClick(){
    this.classList.toggle('active');
    navigation.classList.toggle('active');
    startClickOut(navigation, dataAttribute, removeActiveClass);
  }

  buttonHamburger.addEventListener('click', handleClick);
}

function startAnimatingScroll(){

  function animatingItems(items){
    items.forEach((item) => {
      const time = Number(item.getAttribute("data-animation"));
      setTimeout(() => item.classList.add('anime'), time);
    });
  }

  function animatingScroll(){
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section, index) => {
      const top = section.getBoundingClientRect().top - (section.offsetTop * 0.2);
      const items = section.querySelectorAll("[data-animation]");
      if (top <= 0 || index === 0) {
        animatingItems(items);
      }
    });
  }
  animatingScroll();
  window.addEventListener('scroll', animatingScroll);
}


function init(){
  startScrollSmooth();
  startMobileMenu();
  startAnimatingScroll();
}

init();