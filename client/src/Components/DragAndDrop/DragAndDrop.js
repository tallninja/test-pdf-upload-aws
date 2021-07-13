import React, { Component } from "react";

import "./DragAndDrop.css";

class DragAndDrop extends Component {
  state = { dragging: false };

  dropRef = React.createRef();

  handleDragIn = (e) => {
    e.preventDefault(); // prevents the default behavior of the browser when something is dragged in or dropped (e.g. open the file )
    e.stopPropagation(); // stops the event from being propagated through parent and child elements.
    // console.log(e);

    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ dragging: true });
    }
  };

  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter > 0) return;
    this.setState({ dragging: false });
  };

  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: false });
    // console.log(e);

    if (e.dataTransfer.items && e.dataTransfer.items.length === 1) {
      this.props.handleDrop({
        file: e.dataTransfer.files[0],
        message: "success",
      });
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    } else {
      this.props.handleDrop({
        file: null,
        message: "Cannot upload more than one file",
      });
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };

  componentDidMount = () => {
    this.dragCounter = 0;
    const div = this.dropRef.current;
    div.addEventListener("dragenter", this.handleDragIn);
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);
  };

  componentWillUnmount = () => {
    const div = this.dropRef.current;
    div.removeEventListener("dragenter", this.handleDragIn);
    div.removeEventListener("dragleave", this.handleDragOut);
    div.removeEventListener("dragover", this.handleDrag);
    div.removeEventListener("drop", this.handleDrop);
  };

  renderOverlay = () => {
    return (
      <div className="drag-drop-overlay">
        <div className="drag-drop-overlay-text">
          <div>Drop Here :)</div>
        </div>
      </div>
    );
  };

  render = () => {
    // console.log(this.state.dragging);
    return (
      <div ref={this.dropRef} className="drag-drop-container">
        {this.state.dragging ? this.renderOverlay() : null}
        {this.props.children}
      </div>
    );
  };
}

export default DragAndDrop;
