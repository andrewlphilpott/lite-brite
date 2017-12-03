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
  }),
  dialogVisible: false,
  dialog: {},
  dialogCode: null,
  dialogClass: '',
  dialogCancel: false,
  dialogCallback: null,
  showDialog: action(function(content, showCancel, callback){
    obx.dialog = content;
    obx.dialogCancel = showCancel;

    if(callback) {
      obx.dialogCallback = callback;
    }

    obx.dialogVisible = true;
  }),
  hideDialog: action(function(){
    // Trigger the exit animation
    obx.dialogClass = 'exit';

    // Remove the dialog after the animation finishes
    setTimeout(function(){
      obx.dialog = {};
      obx.dialogCode = null;
      obx.dialogClass = '';
      obx.dialogCancel = false;
      obx.dialogCallback = null;
      obx.dialogVisible = false;
    }, 250);
  }),
  confirmDialog: action(function(){
    if(obx.dialogCallback) {
      obx.dialogCallback();
    }

    obx.hideDialog();
  })
});

export default obx;