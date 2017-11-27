import React from 'react';
import { observer } from 'mobx-react';

// Components
import * as icons from './Icons';

const Toolbar = observer(class Toolbar extends React.Component {
  constructor() {
    super();
    this.togglePalette = this.togglePalette.bind(this);
  }

  componentWillMount() {
    this.setState({
      palleteVisible: false
    });
  }

  togglePalette() {
    this.setState({
      palleteVisible: !this.state.palleteVisible
    });
  }

  selectColor(e) {
    let color = '';

    if(e.target.checked) {
      color = e.target.value;
    }

    this.props.store.LightStore.setColor(color);

    this.togglePalette();
  }

  render() {
    const { LightStore } = this.props.store;

    return (
      <div className="toolbar">
        <section className={`colors ${this.state.palleteVisible ? 'colors--active' : ''}`}>
          <button
            className="colors__selected"
            data-color={LightStore.selectedColor}
            onClick={this.togglePalette}
          >
            <span className="meta">Change color. {LightStore.selectedColor} is currently selected.</span>
          </button>

          <ul className={`colors__list ${this.state.palleteVisible ? 'colors__list--open' : ''}`}>
            {this.props.store.LightStore.colors.map((color, i) =>
              <li
                className="color"
                key={i}
              >
                <input
                  type="radio"
                  id={`color-${i}`}
                  className="color__inp"
                  name="color"
                  value={color}
                  onChange={(e) => this.selectColor(e)}
                  defaultChecked={LightStore.selectedColor === color}
                />

                <label
                  className="color__swatch"
                  htmlFor={`color-${i}`}
                  data-color={color}
                >
                  {LightStore.selectedColor === color &&
                    <icons.iconCheck />
                  }

                  <span className="meta">
                    {color ? color : 'blank'}
                    {LightStore.selectedColor === color ? ' selected' : ''}
                  </span>
                </label>
              </li>
            )}
          </ul>
        </section>
      </div>
    )
  }
})

export default observer(Toolbar);