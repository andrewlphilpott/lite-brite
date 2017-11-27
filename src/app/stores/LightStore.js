import { action, observable, toJS } from 'mobx';

import SessionStore from './SessionStore';

let obx = observable({
  lights: [],
  // lightCount: 384,
  lightCount: 372,
  colors: [
    '',
    'red',
    'orange',
    'amarillo',
    'green',
    'teal',
    'blue',
    'indigo',
    'violet',
    'blanco'
  ],
  selectedColor: '',
  // Create light objects
  generateLights: action(function(){
    let i = 1;

    while(i <= obx.lightCount) {
      const light = {
        id: i,
        color: ''
      }

      obx.lights.push(light);

      i++;
    }
  }),
  // Set the color
  setColor: action(function(color){
    obx.selectedColor = color;
  }),
  // Submit
  submit: action(function(){
    const { firebase } = window;

    firebase.database().ref(`/submissions/${SessionStore.uuid}`).set({
      uuid: SessionStore.uuid,
      lights: toJS(obx.lights)
    });
  }),
  // Retrieve
  retrieve: action(function(){
    SessionStore.startLoading('retrieve');

    const { firebase } = window;

    firebase.database().ref(`/submissions/${SessionStore.uuid}`).on('value', function(snapshot){
      if(snapshot.val() && snapshot.val().lights) {
        obx.lights = snapshot.val().lights;
      }

      SessionStore.finishLoading('retrieve');
    });
  })
});

export default obx;