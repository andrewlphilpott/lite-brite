import React from 'react';
import { observer } from 'mobx-react';

// Dependencies
import uniqid from 'uniqid';

// Components
import Lights from './Lights';
import Toolbar from './Toolbar';

const Home = observer(class Home extends React.Component {
  componentWillMount() {
    const { LightStore, SessionStore } = this.props.store;

    // Get uuid from the url
    let uuid = this.props.location.pathname.replace('/', '');

    SessionStore.uuid = uuid;

    if(!uuid) {
      // If there is no uuid in the url, create one
      uuid = uniqid.time();
      this.props.history.push(`/${uuid}`);
      SessionStore.uuid = uuid;
    }

    LightStore.retrieve();
  }

  render() {
    return (
      <div className="viewport">
        <Lights {...this.props} />
        <Toolbar {...this.props} />
      </div>
    )
  }
})

export default observer(Home);