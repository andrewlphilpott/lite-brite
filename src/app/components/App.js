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