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
    })

    // On mouse up, set mouseDown to false to disable dragging
    document.addEventListener('mouseup', function() {
      _this.setState({
        mouseDown: false
      });
    })
  }

  setBulbColor(light, eventType) {
    if(eventType === 'click' || (eventType === 'mouseover' && this.state.mouseDown)) {
      light.color = this.props.store.LightStore.selectedColor;
      this.props.store.LightStore.submit();
    }
  }

  render() {
    return (
      <ul className="lights">
        {this.props.store.LightStore.lights.map(light =>
          <li className="light" key={light.id}>
            <button
              className="light__bulb"
              data-color={light.color}
              onMouseDown={() => this.setBulbColor(light, 'click')}
              onMouseOver={() => this.setBulbColor(light, 'mouseover')}
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