import { action, observable } from 'mobx';
// import { api } from '../config';

let obx = observable({
  uuid: null,
  loadingCalls: [],
  loading: false,
  loadingMessage: null,
  loadingClass: '',
  startLoading: action(function(message, request) {
    obx.loading = true;
    obx.loadingMessage = message;
    obx.loadingCalls.push(request)
  }),
  finishLoading: action(function(request) {
    const requestIndex = obx.loadingCalls.indexOf(request);

    if(requestIndex >= 0) {
      obx.loadingCalls.splice(requestIndex, 1);
    } else {
      obx.loadingCalls.length = 0;
    }

    if(obx.loadingCalls.length === 0 || typeof request === 'undefined') {
      obx.loadingClass = 'leave';
      obx.loading = false;

      // Wait for loader to fade out before removing
      setTimeout(function(){
        obx.loadingClass = '';
        obx.loadingMessage = null;
      }, 250);
    }
  })
});

export default obx;