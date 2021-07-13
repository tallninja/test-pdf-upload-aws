import React, { Component } from "react";
import axios from "axios";
import { Progress } from "semantic-ui-react";
// import { Document, Page } from "react-pdf/dist/umd/entry.webpack";

import DragAndDrop from "./DragAndDrop/DragAndDrop";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      s3FileURL: null,
      progress: 0,
      isUploading: false,
      uploadError: null,
    };
  }

  onFormSubmit = (event) => {
    event.preventDefault();
    this.uploadFile((e) => {
      this.setState({ isUploading: true });
      this.setState({
        progress: Math.floor((e.loaded / e.total) * 100),
      });

      if (e.loaded === e.total) {
        this.setState({ isUploading: false });
      }
      // console.log(e.loaded);
      // console.log(e.total);
    });
  };

  uploadFile = async (onUploadProgress) => {
    try {
      const file = this.state.file;

      if (!file) {
        throw new Error("Please select a file to upload");
      }

      const fileType = file.type;
      const res = await axios.get("http://localhost:5000/uploads", {
        params: {
          fileType: fileType,
        },
      });
      const { url, fields, filePath } = res.data;

      const formData = new FormData();
      formData.append("Content-Type", fileType);
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });

      this.setState({ s3FileURL: `${url}/${filePath}` });
    } catch (error) {
      console.log(error);
    }
  };

  renderDocument = () => {
    if (this.state.s3FileURL) {
      return (
        <div className="ui segment">
          <div className="ui embed">
            <embed
              src={this.state.s3FileURL}
              width="500"
              height="375"
              type="application/pdf"
            />
          </div>
        </div>
        // <Document file={this.state.s3FileURL}>
        //   <Page pageNumber={1} />
        // </Document>
      );
    } else {
      return null;
    }
  };

  checkFileSize = (file) => {
    if (file.size > 10000000) {
      return {
        status: false,
        message: `File is too large ${(file.size / 1000000).toFixed(
          2
        )}MB Maximum allowed file size is 10MB`,
      };
    } else {
      return { status: true };
    }
  };

  checkFileType = (file) => {
    if (file.type !== "application/pdf") {
      return { status: false, message: "You can only upload PDF files" };
    } else {
      return { status: true };
    }
  };

  checkFileSelected = (file) => {
    if (!file) {
      return { status: false, message: "Please select a file" };
    } else {
      return { status: true };
    }
  };

  validateFile = (file) => {
    if (this.checkFileSelected(file).status) {
      if (this.checkFileType(file).status) {
        if (this.checkFileSize(file).status) {
          return true;
        } else {
          this.setState({ uploadError: this.checkFileSize(file).message });
          return false;
        }
      } else {
        this.setState({ uploadError: this.checkFileType(file).message });
        return false;
      }
    } else {
      this.setState({ uploadError: this.checkFileSelected(file).message });
      return false;
    }
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];

    if (this.validateFile(file)) {
      this.setState({ file: file });
    } else {
      return;
    }
  };

  handleDrop = ({ file, message }) => {
    if (this.validateFile(file)) {
      this.setState({ file: file });
      this.setState({ uploadError: null });
    } else {
      //   this.setState({ uploadError: message });
      return;
    }
  };

  renderProgressBar = () => {
    if (this.state.isUploading) {
      return <Progress percent={this.state.progress} indicating />;
    } else {
      return null;
    }
  };

  renderErrorMessage = () => {
    if (this.state.uploadError) {
      return (
        <div className="ui error message">
          <div className="header">Failed</div>
          <p>{this.state.uploadError}</p>
        </div>
      );
    } else {
      return null;
    }
  };

  render = () => {
    // console.log(this.state.uploadError);
    return (
      <div className="ui container">
        <h4>Hello World !</h4>
        <DragAndDrop handleDrop={this.handleDrop}>
          <div className="ui placeholder segment">
            <div className="ui icon header">
              <i className="pdf file outline icon"></i>
              <div className="ui form error">
                <form
                  method="POST"
                  encType="multipart/form-data"
                  className="ui form"
                  onSubmit={this.onFormSubmit}
                >
                  <div className="field">
                    <label>Upload file</label>
                    <label className="ui teal button" htmlFor="file-input">
                      Choose a file
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      name="material"
                      onChange={this.handleFileChange}
                      id="file-input"
                      hidden={true}
                    ></input>
                    {this.state.file ? this.state.file.name : null}
                  </div>

                  <div>{this.renderProgressBar()}</div>
                  <button className="ui green button" type="submit">
                    Upload
                  </button>
                </form>

                {this.renderErrorMessage()}
              </div>
            </div>
          </div>
        </DragAndDrop>
        {this.renderDocument()}
      </div>
    );
  };
}

export default App;
