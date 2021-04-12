import React, { Component } from 'react';


import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';




import TraditionalLayout from './components/UI/Layout/ComposedLayouts/TraditionalLayout.js';

import CircularProgress from '@material-ui/core/CircularProgress';
// Styles




const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,



  },
  center: {
    margin: 'auto',

    width: '15%',
    height: '50%'

  },
  button: {
    width: '100%',
    height: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',


  },


});

let pvServerBASEURL;
if (typeof process.env.REACT_APP_PyEpicsServerBASEURL === 'undefined') {
  pvServerBASEURL = "http://127.0.0.1";
}
else {
  pvServerBASEURL = process.env.REACT_APP_PyEpicsServerBASEURL;
}

let port;
if (typeof process.env.REACT_APP_StyleguideServerPORT === 'undefined') {
  port = 6060;
}
else {
  port = process.env.REACT_APP_StyleguideServerPORT;
}

let AutomationStudioStyleGuideBuildURL = pvServerBASEURL + ":" + port;


class MainPublic extends Component {
  constructor(props) {
    super(props);

    this.state = { redirectToLoginPage: false }
  }


  render() {


    const { classes } = this.props;

    return (
      <TraditionalLayout
        title="React Automation Studio V3.0.0"
        denseAppBar
        alignTitle="center"
      >


     
        <div style={{ textAlign: 'center', paddingTop: '50vh' }}><CircularProgress /></div>






      </TraditionalLayout>
    )
  }
}

export default withRouter(withStyles(styles)(MainPublic));
