import React from 'react';
import { config } from './../config';

// Store
import store from '../stores/';

// Dependencies
import moment from 'moment';

export function toggleDrawer(e, component, drawerContent) {
  if(e) {
    e.preventDefault();
  }

  component.setState({
    drawerOpen: true,
    drawerContent
  }, function(){
    document.querySelector('.drawer').focus();
  });
}

export function closeDrawer(e, component, closePath, callback) {
  if(e) {
    e.preventDefault();
  }

  document.querySelector('body').classList.remove('drawer-open');

  // Wait for the drawer to slide out before updating the URL
  // or running a function
  setTimeout(function () {
    component.setState({
      drawerOpen: false,
      drawerContent: null
    });

    if(closePath) {
      component.props.routing.push(closePath);
    }

    if(callback) {
      callback();
    }

    // Make sure the close button will show up the next time a drawer opens
    store.SessionStore.hideDrawerClose = false;
  }, 250);

  // Focus the main content
  setTimeout(function(){
    document.querySelector('#main-content').focus();
  })
}

export function startPayment(e, component) {
  store.SessionStore.startPayment();
}

export function submitPayment(e, component) {
  store.SessionStore.submitPayment();
}

export function closePayment() {
  setTimeout(function () {
    store.SessionStore.closePayment();
  }, 1000);
}

// Check form validity before submission
export function checkValidity(e, submitFunction, selector) {
  e.preventDefault();

  let form = null;

  if (selector) {
    form = document.querySelector(selector);
  } else {
    form = e.target;
  }

  form.classList.add('submitted');

  let ie = false;
  let oldMoz = false;
  let invalidFields = [];

  if(document.querySelector('html').className.indexOf('ie-true') > -1) {
    ie = true;
  }

  if(navigator.userAgent.indexOf('Firefox') && parseInt(navigator.userAgent.slice(-4), 10) < 51) {
    oldMoz = true;
  }

  // Old versions of Firefox and IE don’t support one of the invalid selectors used below
  if(!ie && !oldMoz) {
    invalidFields = form.querySelectorAll('input[required]:invalid, select[required]:invalid, textarea[required]:invalid, input[required][aria-invalid="true"], input[aria-invalid="true"]:not(:placeholder-shown)');
  } else {
    invalidFields = form.querySelectorAll('input[required]:invalid, select[required]:invalid, textarea[required]:invalid, input[required][aria-invalid="true"]');
  }

  if (!invalidFields.length) {
    if (submitFunction) {
      submitFunction(e);
    }
  } else {
    let existingErrorMsg = form.querySelector('.note--error');

    if (!existingErrorMsg) {
      let errorMsg = document.createElement('SPAN');
      errorMsg.className = 'note note--prominent note--error';
      errorMsg.innerHTML = 'Sorry, your form contained errors. Please correct the problems before submitting.';
      const fields = form.querySelector('.fields:first-child');
      const fieldsParent = fields.parentNode;
      fieldsParent.insertBefore(errorMsg, fields);
    }

    window.scrollTo(0, 0);
  }
}

// Convert minutes to hours
export function toHours(time, isFirst, textOnly, unabbreviated) {
  let hours = 'hr';
  let minutes = 'min';

  if (unabbreviated) {
    hours = ' hour';
    minutes = ' minute';
  }

  if (time >= 60) {
    if (isFirst) {
      if (textOnly) {
        return time / 60
      } else {
        return (
          <span>{time / 60}</span>
        )
      }
    } else {
      if (parseInt(time / 60, 10) > 1 && unabbreviated) {
        hours = 'hours';
      }

      if(unabbreviated) {
        minutes = 'minutes';
      }

      if (textOnly) {
        let minuteText = time % 60 > 0 ? ` ${time % 60} ${minutes}` : '';

        return parseInt(time / 60, 10) + hours + minuteText;
      } else {
        return (
          <span>
            {parseInt(time / 60, 10)} {hours}

            {time % 60 > 0 &&
              ` ${time % 60} ${minutes}`
            }
          </span>
        )
      }
    }
  } else {
    if (isFirst) {
      if (textOnly) {
        return time
      } else {
        return (
          <span>{time}</span>
        )
      }
    } else {
      if (time > 1) {
        minutes = ' minutes';
      }

      if (textOnly) {
        return time + ' ' + minutes
      } else {
        return (
          <span>
            {time} {minutes}
          </span>
        )
      }
    }
  }
}

// Scroll to top of element
export function toTop(element) {
  if (element) {
    element.scrollTop = 0;
  } else {
    window.scrollTo(0, 0);
  }
}

// Confirm
export function confirm(msg, func) {
  const { SessionStore } = store;
  SessionStore.showConfirm(msg, func);
}

// Prompt
export function promptUser(msg, selectFunc, callback) {
  const { SessionStore } = store;
  SessionStore.showPrompt(msg, selectFunc, callback);
}

// Round time
export function roundTime(time) {
  if (time && time.minute() !== 0 && time.minute() !== 30) {
    const remainder = 30 - time.minute() % 30;
    return moment.utc(time).local().add('minutes', remainder).format('HH:mm');
  }

  return moment.utc(time).local().format('HH:mm');
}

/**
 * Get static map url from google maps API for a given <latitude, longitude> pair
 * @export
 * @param {number} latitude
 * @param {number} longitude
 * @returns {string}
 */
export function getMapUrl(latitude, longitude) {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}` +
    `&zoom=16&scale=2&size=400x250&maptype=roadmap&key=${config.mapsApiKey}` +
    `&format=png&visual_refresh=true&markers=icon:${config.domain}/static/img/marker.png?v=1%7C${latitude},${longitude}`;
}

/**
 * Get URL segments
 * @export
 * @param {Component} component
 * @param {number} segment
 */
export function getURLSegment(component, segment) {
  const { pathname } = component.props.routing.location;

  let pathArray = pathname.split('/');

  if (pathArray[0] === '') {
    pathArray.splice(0, 1);
  }

  return pathArray[segment - 1];
}

/**
 * Push the href, usually received from a html element event, to routing history
 * @export
 * @param {string} href
 * @param {Component} component
 */
export function pushHrefToRouting(href, component) {
  // Regex to grab the domain name part of url
  // For example grab 'http://www.url.com/' from 'http://www.url.com/page'
  let domainRegex = /^(?:\/\/|[^\/]+)*\//;

  // Replace the domain name and the '#' with empty string because the react router excludes them from path
  // For example 'http://www.url.com/#/page' becomes '/page'
  let path = href
    .replace(domainRegex, '')
    .replace('#', '');

  // Push the path to routing if it's not there already
  if (component.props.routing.location.pathname !== path) {
    component.props.routing.push(path);
  }
}

/**
 * Get query params from a string
 * @export
 * @param {name} string
 * @param {url} string
 */
export function getParam(name, url) {
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  let results = regex.exec(url);

  if(!results) {
    return null;
  }

  if(!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Get url path and query from a string
 * @export
 * @param {url} string
 */
export function getPath(url) {
  const parser = document.createElement('a');
  parser.href = url;
  const pathname = parser.pathname;
  const search = parser.search;

  return pathname + search;
}

/**
* Find ancestor by class
* @export
* @param {el} string
* @param {className} string
*/
export function findAncestor (el, className) {
  while (el.parentNode) {
    el = el.parentNode;

    if(el && el.classList.contains(className)) {
      return el;
    }
  }

  return null;
}

/**
* Flag portrait oriented image
* @export
* @param {e} string
* @param {src} string
*/
export function flagPortrait(e, src) {
  const img = new Image();
  const imgEl = e.target;
  let width = 0;
  let height = 0;

  img.onload = function(){
    width = img.width;
    height = img.height;

    if(height > width) {
      imgEl.className += ' portrait';
    }
  }

  img.src = src;
}

/**
* Check if sessionStorage is available
* @export
*/
export function isLocalStorageSupported() {
  const testKey = 'test';
  const storage = window.sessionStorage;

  try {
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  }
  catch (error) {
    return false;
  }
}

/**
* Get cookie by name
* @export
* @param {name} string
*/
export function getCookie(name) {
  const match = document.cookie.match(new RegExp(name + '=([^;]+)'));

  if(match) {
    return match[1]
  }
}

/**
* Delete cookie by name
* @export
* @param {name} string
*/
export function deleteCookie(name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}