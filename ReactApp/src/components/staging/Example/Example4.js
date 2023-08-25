import React from "react";
import PropTypes from "prop-types";
import withStyles from "@mui/styles/withStyles";

import TextInput from "../../BaseComponents/TextInput";
import TextOutput from "../../BaseComponents/TextOutput";

import Grid from "@mui/material/Grid";

import SideBar from "../../SystemComponents/SideBar";

const styles = (theme) => ({
  root: {
    padding: 0,
    spacing: 0,
    direction: "row",
    alignItems: "stretch",
    justify: "flex-start",
    overflowX: "hidden",
    overflowY: "hidden",
  },
});

class Example4 extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SideBar />
        <div>
          <Grid
            style={{ padding: 8 }}
            container
            item
            direction="row"
            justifyContent="center"
            spacing={1}
            alignItems="stretch"
          >
            <Grid item xs={12}>
              <TextInput
                pv="$(device):charWaveform"
                macros={{ "$(device)": "testIOC" }}
                label={"Save path"}
                useStringValue={true}
                debug={true}
              />
            </Grid>
            <Grid item xs={12}>
              <TextOutput
                pv="$(device):charWaveform"
                macros={{ "$(device)": "testIOC" }}
                label={"Save path"}
                useStringValue={true}
                debug={true}
              />
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

Example4.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Example4);
