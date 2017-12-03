import React from 'react';
import { observer } from 'mobx-react';

const Lights = observer(class Lights extends React.Component {
  componentWillMount() {
    this.props.store.LightStore.generateLights();

    // Flag for drag coloring
    this.setState({
      mouseDown: false
    });
  }

  componentDidMount() {
    const _this = this;

    // On mouse down, set mouseDown to true to allow dragging
    document.addEventListener('mousedown', function() {
      _this.setState({
        mouseDown: true
      });
    });

    // On mouse up, set mouseDown to false to disable dragging
    document.addEventListener('mouseup', function() {
      _this.setState({
        mouseDown: false
      });
    });
  }

  setBulbColor(light, eventType) {
    if(
        eventType === 'click' ||
        (eventType === 'mouseover' && this.state.mouseDown) ||
        (eventType === 'touchenter' && this.state.mouseDown)
      ) {
      light.color = this.props.store.LightStore.selectedColor;
      light.flash = this.props.store.LightStore.flash;
      this.props.store.LightStore.submit();
    }
  }

  touchmove(e) {
    e.preventDefault();

    const light = document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY);

    if(light.hasAttribute('data-i')) {
      const i = light.getAttribute('data-i');
      this.props.store.LightStore.lights[i].color = this.props.store.LightStore.selectedColor;
      this.props.store.LightStore.submit();
    }
  }

  render() {
    const { LightStore } = this.props.store;

    return (
      <ul className="lights">
        {LightStore.lights.map((light, i) =>
          <li className="light" key={light.id}>
            <button
              className={`light__bulb ${light.flash ? 'flash': ''}`}
              data-color={light.color}
              data-i={i}
              onMouseDown={() => this.setBulbColor(light, 'click')}
              onMouseOver={() => this.setBulbColor(light, 'mouseover')}
              onTouchMove={(e) => this.touchmove(e)}
            >
              <span className="meta">{light.color} bulb</span>
            </button>
          </li>
        )}
      </ul>
    )
  }
})

export default observer(Lights);