import * as React from 'react';

// Interfaces
import {IProblemsProps , IProblemsState , Problem , Severity , FileWithPreview} from './IProblems';

// Classes
import { SPCrudOperations } from '../../../../Classes/SPCrudOperations';

// Components
import { FileUpload } from '../Common/FileUpload/FileUpload';
import { Grid } from '../Common/Grid/Grid';
import { Modal } from '../Common/Modal/Modal';
import { Loader } from '../Common/Loader/Loader';
// import { SearchBar } from '../SearchBarComponent/SearchBar';

export class Problems extends React.Component<IProblemsProps, IProblemsState> {
    private spCrudOperations: SPCrudOperations;
    private fileInputRef: HTMLInputElement | null = null;

    state: IProblemsState = {
        loading: true,
        error: null,
        searchResults: [],
        formProblem : { 
          Id: '',
          SiteName: '',
          DeviceCategory: null,
          DeviceType: null,
          IssueTitle: '',
          Description: '',
          Severity: '' as Severity,
          ReportedBy: '',
          Attachments: null,
          ContactNumber: ''},
        showModal: false,
        selectedProblem: null,
        selectedCategory: null
      }

    constructor(props: IProblemsProps) {
        super(props);
       
    }

    async componentWillMount(): Promise<void> {
      this.getProblems();
      this.setState({loading: false});
    }

    private handleCategoryChange = (category: string) => {
      const selected = this.props.deviceCategories.filter(eq => eq.Title === category);
      // this.setState({selectedCategory : selected || null});
      this.setState(prev => ({
        ...prev,
        DeviceCategory: category,
        DeviceType: ''
      }));
    };

    private handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.prototype.slice.call(e.target.files || []); 
      const newAttachments = files.map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        id: ''//crypto.randomUUID()
      }));
      this.setState(prevState =>  ({
        ...prevState, attachments: [...prevState.formProblem.Attachments, ...newAttachments]
      }));
       
      
      // Reset file input
      if (this.fileInputRef) {
        this.fileInputRef.value = '';
      }
    };

    private removeAttachment = (id: string) => {
      this.setState(prevState => {
        const attachment: FileWithPreview = prevState.formProblem.Attachments.filter(a => a.id === id).length > 0 ? prevState.formProblem.Attachments.filter(a => a.id === id)[0] : {file:null, id:''};
        // const attachment = prev.filter(a => a.id === id);
        if (attachment!.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
        return { ...prevState,
          formProblem: {
            ...prevState.formProblem,
            attachments: prevState.formProblem.Attachments.filter(a => a.id !== id) 
          }
        }
      });
    };

    // e: React.FormEvent<HTMLFormElement>
    private handleSubmit = () => {
      alert('Under Construction. Please try again later.');
      // e.preventDefault();
      // try {
      //   // Simulate API call
      //   await new Promise(resolve => setTimeout(resolve, 1000));
      //   // console.log('Form submitted:', { ...formData, attachments });
      //   alert('Issue reported successfully!');
        
      //   // Cleanup previews
      //   this.state.attachments.forEach(attachment => {
      //     if (attachment.preview) {
      //       URL.revokeObjectURL(attachment.preview);
      //     }
      //   });
        
      //   // Reset form
      //   this.setState( { formProblem : {
      //     siteName: '',
      //     siteLocation: '',
      //     equipmentCategory: '',
      //     equipmentType: '',
      //     issueTitle: '',
      //     description: '',
      //     severity: '' as Severity,
      //     reportedBy: '',
      //     contactNumber: ''
      //   }
         
      //   });
      //   this.setState({attachments : []}); //setAttachments([]);
      // } catch (err) {
      //   console.error('Error submitting issue:', err);
      //   alert('Failed to submit issue. Please try again.');
      // }
    };

    private openProblemDetails = (item: any) => {
      this.setState({formProblem : item , showModal: true});
   }

    private onCloseModal = () => {
      this.setState({showModal: false});
    }

  public render(): React.ReactElement<{}> {
      if (this.state.loading) {
        return (
          <Loader/>
        );
      }
    
      else if (this.state.error) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-600">{this.state.error}</div>
          </div>
        );
      }

      else {
        return (
          <div className={`directory-container`}>
              {/* <div className={`mt-1 position-relative`}>
                <SearchBar keyId={'PropblemsSearchBar'} itemTitle='Problems' OnChange={this.handleSearchChange}
                onSelectItem={this.handleItemSelect} searchResults={this.state.searchResults}/>
              </div> */}
              
              <div className={`p-3 text-white`}>
                <Grid list={this.state.searchResults} OnViewDetailsClick={(problem) => this.openProblemDetails(problem)}/>
                <Modal
                  showModalTitle={true}
                  modalTitle='Problem Details' 
                  onClose={this.onCloseModal}
                  onSave={this.handleSubmit}
                  showModal={this.state.showModal}
                  buttonText='Submit Issue'
                  modalClassSize='modal-xl'
                  showSaveButton={false}
                >
                  {this.state.formProblem !== null && <this.ProblemForm />}
                </Modal>
              </div>
          </div>
      );
      }
  }

  private ProblemForm = (): JSX.Element => {
      return (
      <div className="card">
        <div className="card-body">
            <form>
            <div className="row mb-2">
              {/* Site Name Dropdown */}
              <div className="form-group col-md-4">
                <label>Site Name</label>
                <select required className="form-select" value={this.state.formProblem.SiteName} 
                  onChange={(e) => this.setState(prev => ({ ...prev, siteName: e.target.value }))}>
                  <option value="">Select Site</option>
                  {this.props.sites.map(site => (
                    <option key={site.Id} value={site.Id}>
                      {site.Title}
                    </option>
                  ))}
                </select>
              </div>

             {/* Site Location */}
              <div className="form-group col-md-4">
                {/* <label className="block text-sm font-medium text-gray-700">Site Location</label>
                <input type="text" required  className='form-control' value={this.state.formProblem.siteLocation}
                  onChange={(e) => this.setState(prev => ({ ...prev, siteLocation: e.target.value }))}/> */}
              </div>

              {/* Equipment Type */}
              <div className='form-group col-md-4'>
                <label>Equipment Type</label>
                  <select required className="form-select"
                    value={this.state.formProblem.DeviceType !== undefined && 
                      this.state.formProblem.DeviceType !== null ? this.state.formProblem.DeviceType.Id : ''}
                    onChange={(e) => this.setState(prev => ({ ...prev, DeviceType: e.target.value }))}>
                    <option value="">Select Type</option>
                    {this.props.deviceTypes.map(eq => (<option key={eq.Id} value={eq.Id}>{eq.Title}</option>))}
                  </select>
              </div>
            </div>
   
            <div className="row mb-2">
                {/* Issue Title */}
              <div className='form-group col-md-4'>
                <label>Issue Title</label>
                <input type="text" required className="border"
                value={this.state.formProblem.IssueTitle}
                onChange={(e) => this.setState(prev => ({ ...prev, issueTitle: e.target.value }))}/>
              </div>

               {/* Contact Information */}
               <div className='form-group col-md-4'>
                <label>Reported By</label>
                <input type="text" required className="border"
                  value={this.state.formProblem.ReportedBy}
                  onChange={(e) => this.setState(prev => ({ ...prev, reportedBy: e.target.value }))}/>
              </div>
                
              {/* Equipment Category */}
              <div className='form-group col-md-4'>
                <label>Equipment Category</label>
                <select required className='form-select' 
                value={this.state.formProblem.DeviceCategory !== null ? this.state.formProblem.DeviceCategory.Id : ''}
                  onChange={(e) => this.handleCategoryChange(e.target.value)}>
                  <option value="">Select Category</option>
                    {/* {this.state.selectedCategory.types.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))} */}
                  {this.props.deviceCategories.map(eq => (
                    <option key={eq.Id} value={eq.Id}>
                      {eq.Title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='row mb-2'>
               {/* Severity */}
              <div className='form-group col-md-4'>
                <label >Severity Level</label>
                <select required className="form-select"
                  value={this.state.formProblem.Severity}
                  onChange={(e) => this.setState(prev => ({ ...prev, severity: e.target.value as Severity }))}>
                  <option value="">Select Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className='form-group col-md-4'>
                <label>Contact Number</label>
                <input type="tel" required className="form-control"
                  value={this.state.formProblem.ContactNumber}
                  onChange={(e) => this.setState(prev => ({ ...prev, contactNumber: e.target.value }))}/>
              </div>

              <div className='form-group col-md-4'>
                  {/* File Attachments */}
              <label className=""> Attachments</label>
              <div className="">
                <div className="flex items-center gap-4">
                  <button type="button" 
                    onClick={() => this.fileInputRef && this.fileInputRef.click()}
                    style={{display: 'none'}}
                    aria-label="Add attachments"> 
                    Add Files
                  </button>
                  <p className="text-sm text-gray-500"> Upload images or documents related to the issue</p>
                </div>
                <input type="file" ref={(input) => {this.fileInputRef = input}}
                  onChange={this.handleFileChange}
                  className="hidden" multiple accept="image/*,.pdf,.doc,.docx,.txt" />

                {/* Attachment Preview */}
                {this.state.formProblem.Attachments !== null && this.state.formProblem.Attachments.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {this.state.formProblem.Attachments.map(attachment => (
                      <div key={attachment.id} >
                        <button type="button" onClick={() => this.removeAttachment(attachment.id)}
                          aria-label={`Remove ${attachment.file.name}`}>
                          Remove
                        </button>
                        
                        {attachment.preview ? (
                          <div className="relative aspect-square">
                            <img src={attachment.preview} alt="Preview" 
                            className="h-full w-full object-cover rounded"/>
                          </div>
                        ) : (
                          <div className="aspect-square flex items-center justify-center bg-gray-50 rounded">
                            <FileUpload />
                          </div>
                        )}
                        <p className="mt-1 text-xs text-gray-500 truncate">
                          {attachment.file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </div>
            </div>

            <div className='row mb-2'>
                {/* Description */}
                <div className='form-group col-md-12'>
                    <label>Issue Description</label>
                    <textarea required rows={3} className='form-control'
                      value={this.state.formProblem.Description}
                      onChange={(e) => this.setState(prev => ({ ...prev, description: e.target.value }))}/>
                </div>
            </div>
          </form>
        </div>
    </div>
    )
  }

  public getProblems = async (): Promise<void> => {
      const result: Problem [] = [];
        try {
          const query: string = `?$select=Id,Title,IssueTitle,Description,Severity,ContactNumber,`+
        `Site/Id,Site/Title,DeviceType/Id,DeviceType/Title,DeviceCategory/Id,DeviceCategory/Title`+
        `&$expand=Site,DeviceType,DeviceCategory`;

          this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
                                  this.props.context.pageContext.web.absoluteUrl, 'Problems', query);
          await this.spCrudOperations._getItemsWithQuery()
          .then((data) => {
            data.map((obj) => {
              const temp: Problem = {
                Id: obj['ID'] !== undefined && obj['ID'] !== null ? obj['ID'] : '',
                SiteName: obj.Site !== undefined && obj.Site !== null ? obj.Site.Title.toString() : '',
                IssueTitle: obj.IssueTitle !== undefined && obj.IssueTitle !== null ? obj.IssueTitle.toString() : '',
                Description: obj.Description !== undefined && obj.Description !== null ? obj.Description.toString() : '',
                Severity: obj.Severity !== undefined && obj.Severity !== null ? obj.Severity.toString() : '',
                ReportedBy: obj.ReportedBy !== undefined && obj.ReportedBy !== null ? obj.ReportedBy.toString() : '',
                ContactNumber: obj.ContactNumber !== undefined && obj.ContactNumber !== null ? obj.ContactNumber.toString() : '',
                // Attachments: obj.Attachments !== undefined && obj.Attachments !== null ? obj.Attachments.toString() : '',
                DeviceType: obj.DeviceType !== undefined && obj.DeviceType !== null ? {Id: obj.DeviceType.Id.toString(), Title: obj.DeviceType.Title.toString()} : {Id: '', Title: ''},
                DeviceCategory: obj.DeviceCategory !== undefined && obj.DeviceCategory !== null ? {Id: obj.DeviceCategory.Id.toString(), Title: obj.DeviceCategory.Title.toString()} : {Id: '', Title: ''},
              };
              result.push(temp);
            });
            this.setState({searchResults: result , loading: false});
          })
          .catch(error => {
            console.error('An error has occurred while retrieving items!', error);
          });
        } catch (error) {
        console.error('An error has occurred!', error);
      }
  }
}