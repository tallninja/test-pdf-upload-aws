import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const res = await axios.post("http://localhost:5000/", e.target.value);
//   console.log(res.data);
// };

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { file: null };
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
    const { success, key, url } = res.data;
    await axios.post(url, this.state.file, {
      headers: {
        "Content-Type": this.state.file.type,
      },
    });
  };

  // getPresignedURL = async () => {
  //   const res = await axios.get(
  //     "https://kr5r9xtegl.execute-api.af-south-1.amazonaws.com/get-presigned-url?fileType=application/pdf"
  //   );
  //   console.log(res);
  // };

  render = () => {
    // this.getPresignedURL();

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
                // console.log(event.target.files);
              }}
            ></input>
          </div>
          <button className="ui green button" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#root"));
