
/**
 * Adds class to HTML DOM Element if not already applied.
 * @param {DOMElement} htmlEle - The target element.
 * @param {string} className - The CSS class name.
 */  
export function addClass(el, className) {  
  if (el.classList) {
      el.classList.add(className)
  } else if (!hasClass(el, className)) {
      el.className += " " + className;
  }
}

/**
 * Removes class from HTML DOM Element.
 * @param {DOMElement} htmlEle - The target element.
 * @param {string} className - The CSS class name.
 */  
export function removeClass(el, className){
  if (el.classList) {
    el.classList.remove(className)
  } else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    el.className = el.className.replace(reg, ' ');
  }
}

/**
 * Determines if the given HTML DOM Element has the class applied.
 * @param {DOMElement} htmlEle - The target element.
 * @param {string} className - The CSS class name.
 * @returns {boolean} classExists - Whether the class is applied. 
 */  
export function hasClass(el, className) {  
  if (el.classList) {
    return el.classList.contains(className);
  }
  return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));    
}


/**
 * Returns the HTML DOM element with the given id.
 * @param {string} id - The id of the DOM element to retrieve.
 * @returns {DOMElement} [element=null] - The DOM element, if found.
 */
export function e(id){
  return id ? document.getElementById(id) : null;
}
