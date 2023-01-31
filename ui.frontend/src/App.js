import { Page, withModel } from '@adobe/aem-react-editable-components';
import React from 'react';
import { Provider } from "react-redux";
import store from './store/index';

// This component is the application entry point
class App extends Page {
  constructor(props) {
    super(props);

    //listen to the route changes
    this.listener = this.props.history.listen((location, action) => {
      if (location.pathname && location.pathname.includes('rewards.html')) {
        console.log('Reward page');
      }
      console.log("On route change", location, action);

    });
    window.onpopstate = (e) => {
      console.log('go back', e, window.location.href)
    }
  }

  componentWillUnmount() {
    console.log('Component unmounting')
    this.listener();
  }

  render() {
    console.log("childPages", this.childPages);
    return (
      <Provider store={store}>
        {this.childComponents}
        {this.childPages}
      </Provider>
    );
  }
}

export default withModel(App);
