import * as React from 'react';


export class FileUpload extends React.Component<{}, IFileUploadState> {
  private fileInput: HTMLInputElement | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      files: [],
    };
  }

  // Handle file input change
  private handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.prototype.slice.call(event.target.files || []); 
    // const files = event.target.files ? Array.from(event.target.files) : [];
    this.setState({ files });
  };

  // Trigger the file input's click method
  private handleButtonClick = () => {
    if (this.fileInput) {
      this.fileInput.click();
    }
  };

  // Render the component
  public render() {
    const { files } = this.state;

    return (
      <div>
        <button
          type='button'
          onClick={this.handleButtonClick}
          className='inline-flex items-center gap-2 rounded-md bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100'
        >
          {/* Replace Upload icon with a suitable icon or text */}
          <span className='h-4 w-4'>📤</span> Add Files
        </button>

        {/* Hidden file input using callback ref */}
        <input
          ref={(input) => { this.fileInput = input; }} // callback ref
          type='file'
          onChange={this.handleFileChange}
          style={{ display: 'none' }}
          multiple
        />

        {/* Display the selected file names */}
        {files.length > 0 && (
          <div>
            <h4>Selected Files:</h4>
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
