import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Document, Page } from "react-pdf/dist/umd/entry.webpack";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { file: null, s3FileURL: null, numPages: null, pageNumber: 1 };
  }

  onFormSubmit = (event) => {
    event.preventDefault();
    this.uploadFile();
  };

  uploadFile = async () => {
    const res = await axios.get("http://localhost:5000/uploads", {
      params: {
        fileType: this.state.file.type,
      },
    });
    const { url, fields, filePath } = res.data;

    const formData = new FormData();
    formData.append("Content-Type", this.state.file.type);
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", this.state.file);

    await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    this.setState({ s3FileURL: `${url}/${filePath}` });
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages: numPages });
  };

  renderDocument = () => {
    if (this.state.s3FileURL) {
      const { pageNumber, numPages } = this.state;
      return (
        <Document
          file={this.state.s3FileURL}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
          <p>
            {pageNumber} of {numPages}
          </p>
        </Document>
      );
    } else {
      return null;
    }
  };

  render = () => {
    return (
      <div className="ui container">
        <h4>Hello World !</h4>
        <form
          method="POST"
          encType="multipart/form-data"
          className="ui form"
          onSubmit={this.onFormSubmit}
        >
          <div className="field">
            <label>Upload file</label>
            <input
              type="file"
              accept=".pdf"
              name="material"
              onChange={(event) => {
                this.setState({ file: event.target.files[0] });
              }}
            ></input>
          </div>
          <button className="ui green button" type="submit">
            Submit
          </button>
        </form>
        {this.renderDocument()}
      </div>
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#root"));
