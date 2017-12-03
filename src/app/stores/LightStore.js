import { action, observable, toJS } from 'mobx';

import SessionStore from './SessionStore';

let obx = observable({
  lights: [],
  lightCount: 384,
  // lightCount: 372,
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
  selectedColor: 'red',
  flash: false,
  // Create light objects
  generateLights: action(function(){
    let i = 1;

    while(i <= obx.lightCount) {
      const light = {
        id: i,
        color: '',
        flash: false
      }

      obx.lights.push(light);

      i++;
    }
  }),
  // Set the color
  setColor: action(function(color){
    obx.selectedColor = color;
  }),
  // Randomize
  randomize: action(function(){
    obx.lights.forEach(light => {
      const random = Math.floor(Math.random() * (8 + 1));
      light.color = obx.colors[random + 1];
    });

    obx.submit();
  }),
  // Share
  share: action(function(){
    const content = {
      heading: 'Share your work',
      body: 'Send the link below to a friend to allow them to view and collaborate.',
      button: 'Done'
    }

    SessionStore.dialogCode = window.location.href;
    SessionStore.showDialog(content, false);
  }),
  // Delete
  delete: action(function(){
    obx.lights.forEach(light => {
      light.color = '';
      light.flash = false;
    });

    obx.submit();
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