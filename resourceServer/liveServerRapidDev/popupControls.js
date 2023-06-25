const popup = document.getElementById('popup');

popup.addEventListener('click', ()=>{
  popup.style.setProperty('display','none');
});

/**
 * A Callback for when the user clicks the background/OK button on the popup
 * @callback PopClick
 */

/**
 * 
 * @param {string} message Display message on the popup
 * @param {PopClick} cb 
 */
export function showPopup(message,popupColor,cb){
  popup.style.setProperty('display','flex');
  const para = document.createElement('h1'); 
  const innerBox = popup.querySelector('#outcome');
  innerBox.style.setProperty('background-color',popupColor);

  para.innerText = message;

  innerBox.innerHTML = '';
  innerBox.appendChild(para);
  cb();
}