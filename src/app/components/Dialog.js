import React from 'react';
import { observer } from 'mobx-react';

const Dialog = observer(class Dialog extends React.Component {
  constructor() {
    super();
    this.confirmKey = this.confirmKey.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.confirmKey, false);
  }

  confirmKey(e) {
    if(e.keyCode && (e.keyCode === 13 || e.keyCode === 32)) {
      // Enter or space key to confirm
      e.preventDefault();
      this.props.store.SessionStore.confirmDialog();
    } else if(e.keyCode && e.keyCode === 27) {
      // Escape to cancel
      e.preventDefault();
      this.props.store.SessionStore.hideDialog();
    }
  }

  render() {
    const { SessionStore } = this.props.store;

    return (
      <div className="dialog-wrap">
        <aside className={`dialog ${SessionStore.dialogClass}`}>
          <h2 className="dialog__title">{SessionStore.dialog.heading}</h2>

          <div className="dialog__body">
            <p>{SessionStore.dialog.body}</p>

            {SessionStore.dialogCode &&
              <p><a href={SessionStore.dialogCode}>{SessionStore.dialogCode}</a></p>
            }
          </div>

          <div className="dialog__action">
            {SessionStore.dialogCancel &&
              <button className="btn btn--secondary" onClick={SessionStore.hideDialog}>
                Cancel
              </button>
            }

            <button className="btn" onClick={SessionStore.confirmDialog}>
              {SessionStore.dialog.button}
            </button>
          </div>
        </aside>
      </div>
    )
  }
})

export default observer(Dialog);