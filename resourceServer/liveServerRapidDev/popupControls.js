const popup = document.getElementById('popup');

popup.addEventListener('click', ()=>{
  popup.style.setProperty('display','none');
});

export function showPopup(message){
  popup.style.setProperty('display','flex');
  const para = document.createElement('p'); 
  para.innerText = message;
  popup.innerHTML = '';
  popup.appendChild(para);
}