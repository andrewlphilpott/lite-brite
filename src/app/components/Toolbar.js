import React from 'react';
import { observer } from 'mobx-react';

// Components
import * as icons from './Icons';

const Toolbar = observer(class Toolbar extends React.Component {
  constructor() {
    super();
    this.togglePalette = this.togglePalette.bind(this);
    this.toggleFlash = this.toggleFlash.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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

  toggleFlash() {
    this.props.store.LightStore.flash = !this.props.store.LightStore.flash;
  }

  handleDelete() {
    const callback = this.props.store.LightStore.delete;

    const content = {
      heading: 'Are you sure?',
      body: 'All colored lights will be removed.',
      button: 'Delete'
    }

    this.props.store.SessionStore.showDialog(content, true, callback);
  }

  render() {
    const { LightStore } = this.props.store;

    return (
      <div className="toolbar">
        <section className={`colors ${this.state.palleteVisible ? 'colors--active' : ''}`}>
          <h2 className="meta">Colors</h2>

          <button
            className="colors__selected"
            data-color={LightStore.selectedColor}
            onClick={this.togglePalette}
          >
            <span className="meta">Change color. {LightStore.selectedColor} is currently selected.</span>
          </button>

          <ul className={`colors__list ${this.state.palleteVisible ? 'colors__list--open' : ''}`}>
            {LightStore.colors.map((color, i) =>
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

        <section className="style">
          <label className="style__flash" htmlFor="light-flash">
            <input
              type="checkbox"
              id="light-flash"
              checked={LightStore.flash}
              onChange={this.toggleFlash}
            />

            <icons.iconFlash />
            <span className="meta">Flash</span>
          </label>
        </section>

        <section className="actions">
          <h2 className="meta">Actions</h2>

          <ul className="actions__list">
            <li>
              <button
                className="actions__btn actions__randomize"
                onClick={LightStore.randomize}
                title="Randomize"
              >
                <icons.iconDice />
                <span className="meta">Randomize</span>
              </button>
            </li>
            <li>
              <button
                className="actions__btn actions__share"
                onClick={LightStore.share}
                title="Share"
              >
                <icons.iconShare />
                <span className="meta">Share</span>
              </button>
            </li>
            <li>
              <button
                className="actions__btn actions__save"
                onClick={LightStore.save}
                title="Save"
              >
                <icons.iconSave />
                <span className="meta">Save</span>
              </button>
            </li>
            <li>
              <button
                className="actions__btn actions__delete"
                onClick={this.handleDelete}
                title="Delete"
              >
                <icons.iconTrash />
                <span className="meta">Delete</span>
              </button>
            </li>
          </ul>
        </section>
      </div>
    )
  }
})

export default observer(Toolbar);