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
      const top = section.getBoundingClientRect().top - (section.offsetTop * 0.3);
      const items = section.querySelectorAll("[data-animation]");
      if (top <= 0 || index === 0) {
        animatingItems(items);
      }
    });
  }
  animatingScroll();
  window.addEventListener('scroll', animatingScroll);
}

function startSlide(){
  const slide = document.querySelector("[data-slide='slide']");
  const wrapper = document.querySelector("[data-slide='wrapper']");
  const buttonPrev = document.querySelector("[data-slide='previous']");
  const buttonNext = document.querySelector("[data-slide='next']");
  const dist = {startX: 0, finalPosition: 0, movement: 0, movePosition: 0};
  let itemsSlide;
  let mapIndex;

  function addingTransition(active){
    slide.style.transition = active ? "transform .3s" : ""
  }

  function slidesConfig(){
    itemsSlide = [...slide.children].map((item) => {
      const margin = (wrapper.offsetWidth - item.offsetWidth) / 2
      const position = -(item.offsetLeft - margin);
      return {position, item}
    });
  }

  function moveSlide(distX){
    dist.movePosition = distX;
    slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  function updatePosition(clientX){
    dist.movement = dist.startX - clientX;
    return dist.finalPosition - dist.movement;
  }

  function onMove(event){
    const pointerPosition = (event.type === "mousemove") ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = updatePosition(pointerPosition);
    moveSlide(finalPosition);
  }

  function onStart(event){
    event.preventDefault();
    let eventMove;
    if (event.type === "mousedown"){
      dist.startX = event.clientX;
      eventMove = "mousemove";
    }
    else{
      dist.startX = event.changedTouches[0].clientX;
      eventMove = "touchmove";
    }
    this.addEventListener(eventMove, onMove);
    addingTransition(false);
  }

  function onEnd(event){
    const eventMove = (event.type === "mouseup") ? "mousemove" : "touchmove";
    this.removeEventListener(eventMove, onMove);
    dist.finalPosition = dist.movePosition;
    addingTransition(true);
    changeSlideOnEnd();
  }

  function slideIndexNav(index){
    const last = itemsSlide.length - 1;
    mapIndex = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1
    }
  }

  function activePrevSlide(){
    if (mapIndex.prev !== undefined) changeSlide(mapIndex.prev);
  }

  function activeNextSlide(){
    if (mapIndex.next !== undefined) changeSlide(mapIndex.next);
  }

  function changeSlideOnEnd(){
    if(dist.movement > 120 && mapIndex.next !== undefined){
      activeNextSlide();
    }
    else if(dist.movement < -120 && mapIndex.prev !== undefined){
      activePrevSlide();
    }
    else{
      changeSlide(mapIndex.active);
    }
  }

  function changeSlide(index){
    const activeSlide = itemsSlide[index];
    addingTransition(true);
    moveSlide(activeSlide.position);
    slideIndexNav(index);
    dist.finalPosition = activeSlide.position;
  }

  function onResize(){
    setTimeout(()=>{
      slidesConfig();
      changeSlide(mapIndex.active);
    }, 100)
  }

  window.addEventListener('resize', onResize)
  slide.addEventListener('mousedown', onStart);
  slide.addEventListener('touchstart', onStart);
  slide.addEventListener('mouseup', onEnd);
  slide.addEventListener('touchend', onEnd);
  buttonPrev.addEventListener('click', activePrevSlide);
  buttonNext.addEventListener('click', activeNextSlide);
  slidesConfig();
  slideIndexNav(0);
}

function startValidate(formField){
  const types = {
    email:{
      regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Preencha um email válido',
    }
  }

  if(formField.value.length === 0){
    formField.nextElementSibling.textContent = "Preencha esse campo";
    return false;
  }
  if(types[formField.type] && !types[formField.type].regex.test(formField.value)){
    formField.nextElementSibling.textContent = types[formField.type].message;
    return false;
  }
  return true;
}

function startSendQuestion(){
  const form = document.querySelector("#form-contact");
  const formDate = {name: "", email: "", message:""};

  async function sendQuestion(event){
    event.preventDefault();
    const isValid = Object.keys(formDate).reduce((accumulator, key) =>{
      return accumulator += (startValidate(form.querySelector(`#${key}`))) ? 1 : 0 ;
    }, 0)
    
    if(isValid === Object.keys(formDate).length){
      const response = await fetch(`https://crosslifeapi.herokuapp.com/enviar-duvida`, {
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(formDate),
      });
      
      if(response.ok){
        window.alert("Seu email foi enviado");
        Object.keys(formDate).forEach(key => form.querySelector(`#${key}`).value = '');
      }
    }
  }
  
  function handleChange(event) {
    const formField = event.target;
    if (startValidate(formField)){
      formDate[formField.name] = formField.value;
      formField.nextElementSibling.textContent = "";
    }
  }

  form.addEventListener("change", handleChange);
  form.addEventListener("submit", sendQuestion);
}

function init(){
  startScrollSmooth();
  startMobileMenu();
  startAnimatingScroll();
  startSlide();
  startSendQuestion();
}

window.addEventListener("load", init);