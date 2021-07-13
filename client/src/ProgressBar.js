import React, { Component } from "react";
import { Progress } from "semantic-ui-react";

class ProgressBar extends Component {
  state = { progress: null };

  render = () => {
    return <Progress percent={this.state.progress} />;
  };
}

export default ProgressBar;
