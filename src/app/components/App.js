import React from 'react';
import { observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';

// Import components
import Home from './Home';

class App extends React.Component {
  render() {
    const { SessionStore } = this.props.store;

    return (
      <div>
        <Switch>
          <Route path='/' render={(routing) => (
            <Home {...routing} {...this.props} />
          )}/>
        </Switch>

        {SessionStore.dialogVisible &&
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
        }

        {SessionStore.loading &&
          <aside className="loader">
            <div className="loader__msg">
              <span className="meta">Loading…</span>
            </div>
          </aside>
        }
      </div>
    )
  }
}

export default observer(App);