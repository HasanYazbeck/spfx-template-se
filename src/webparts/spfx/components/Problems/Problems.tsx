import * as React from 'react';

// Interfaces
import {IProblemsProps , IProblemsState , Problem , Severity , FileWithPreview} from './IProblems';

// Classes
import { SPCrudOperations } from '../../../../Classes/SPCrudOperations';
import { SPHelpers } from '../../../../Classes/SPHelpers';

// Components
import { FileUpload } from '../Common/FileUpload/FileUpload';
import { Grid } from '../Common/Grid/Grid';
import { Modal } from '../Common/Modal/Modal';
import { Loader } from '../Common/Loader/Loader';
import { IUser } from '../../../../Interfaces/IUser';

// Styles
import styles from '../../../common.module.scss';
import { SearchBar } from '../SearchBarComponent/SearchBar';
import { DateRange } from '../../../../Interfaces/ICommon';

export class Problems extends React.Component<IProblemsProps, IProblemsState> {
    private spCrudOperations: SPCrudOperations;
    private spHelpers: SPHelpers = new SPHelpers();
    private fileInputRef: HTMLInputElement | undefined = undefined;

    state: IProblemsState = {
        loading: true,
        error: undefined,
        originalProblems: [],
        problems: [],
        formProblem : { 
          Id: undefined,
          Site: undefined,
          DeviceCategory: undefined,
          DeviceType: undefined,
          IssueTitle: undefined,
          Description: undefined,
          Severity: undefined as Severity,
          Attachments: undefined,
          ContactNumber: undefined,
          Author: undefined,
          Created: undefined
        },
        showModal: false,
        selectedProblem: undefined,
        selectedCategory: undefined,
        startDate: undefined,
        endDate: undefined
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
        const attachment: FileWithPreview = prevState.formProblem.Attachments.filter(a => a.id === id).length > 0 ? prevState.formProblem.Attachments.filter(a => a.id === id)[0] : {file:undefined, id:''};
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
      const problem: Problem = this.state.problems !== undefined 
      && this.state.problems.length > 0  ? 
      this.state.problems.filter(p => p.Id.toString() === item.target.id.toString())[0] : undefined;
      this.setState({formProblem : problem , showModal: true});
   }

    private onCloseModal = () => {
      this.setState({showModal: false});
    }

    private handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredProblems = this.state.problems.filter(problem => 
        problem.Site!.Title!.toString().toLowerCase().indexOf(searchTerm) >= 0 ||
        problem.IssueTitle!.toString().toLowerCase().indexOf(searchTerm) >= 0 ||
        problem.Author!.Title!.toString().toLowerCase().indexOf(searchTerm) >= 0
      );

      this.setState({problems: filteredProblems});
    }

    
    private filterProblemsByDate = () => {
      const { startDate, endDate } = this.state;
      
      // Only filter if we have both dates
      if (startDate && endDate) {
        // Reset time portions to compare dates only
        const start = new Date(startDate.toString());
        const end = new Date(endDate.toString());
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
    
        const filteredProblems = this.state.problems.filter(problem => {
          if (!problem.Created) return false;
          
          const problemDate = new Date(problem.Created.toString());
          return problemDate >= start && problemDate <= end;
        });
    
        this.setState({ problems: filteredProblems });
      }
    }

    private applyFilters = () => {
      const searchInput = document.getElementById('ProblemsSearchBar') as HTMLInputElement;
      
      let filteredProblems = [...this.state.originalProblems];
      const searchTerm = searchInput.value.toLowerCase() || '';
    
      // Apply date filter if dates are set
      if (this.state.startDate && this.state.endDate) {
        const start = new Date(this.state.startDate.toString());
        const end = new Date(this.state.endDate.toString());
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
    
        filteredProblems = filteredProblems.filter(problem => {
          if (!problem.Created) return false;
          const problemDate = new Date(problem.Created.toString());
          return problemDate >= start && problemDate <= end;
        });
      }
    
      // Apply search filter
      if (searchTerm) {
        filteredProblems = filteredProblems.filter(problem => 
          problem.Site!.Title!.toString().toLowerCase().indexOf(searchTerm) >= 0 ||
          problem.IssueTitle!.toString().toLowerCase().indexOf(searchTerm) >= 0 ||
          problem.Author!.Title!.toString().toLowerCase().indexOf(searchTerm) >= 0
        );
      }
    
      this.setState({problems: filteredProblems});
    }

    private resetDateFilter = () => {
      const searchInput = document.getElementById('ProblemsSearchBar') as HTMLInputElement;
      if (searchInput) {
        searchInput.value = '';
      }
      this.setState(prevState => ({
        startDate: undefined,
        endDate: undefined,
        problems: [...prevState.originalProblems] // Reset to original problems
      }));
    }

  public render(): React.ReactElement<{}> {
      if (this.state.loading) {return (<Loader/>);}
      else if (this.state.error) {
        return (
          <div className='min-h-screen flex items-center justify-center'>
            <div className='text-red-600'>{this.state.error}</div>
          </div>
        );
      }
      else {
        return (
          <div className={`directory-container`}>
            <div className='row'>
              <div className='col-md-12'>
                <div className={`mt-1 position-relative`}>
                  <SearchBar keyId={'ProblemsSearchBar'} itemTitle='Problems' 
                  OnChange={() => {}}
                  onSelectItem={() => {}} 
                  searchResults={[]}
                  placeholder='Search by Site, Issue Title, Reported By'
                  />
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='col-md-12'>
                <div className={`mt-1 position-relative d-flex gap-2`}>
                  <div className='form-range input-group flex-grow-1'>
                   <span className='input-group-text' id='inputGroup-sizing-sm'>Start Date</span>
                    <input type='date' id='startDate' className='form-control'
                      value={this.state.startDate !== undefined ? 
                        this.state.startDate.toString().split('T')[0] : ''}/>
                  </div>
                  <div className='form-range input-group flex-grow-1'>
                  <span className='input-group-text' id='inputGroup-sizing-sm'>End Date</span>
                    <input type='date' id='endDate' className='form-control'
                      value={this.state.endDate !== undefined ? 
                        this.state.endDate.toString().split('T')[0] : ''}/>
                  </div>
                </div>
              </div>
            </div>

            <div className='row'>
                <div className='col-md-12'>
                <button className='btn btn-primary btn-sm align-self-end mt-3 float-end'
                         onClick={this.applyFilters} 
                        >Apply Filter</button>
                  <button className='btn btn-secondary btn-sm btn-warning align-self-end mt-3 m-2 float-end' 
                    onClick={this.resetDateFilter}
                  >Reset</button>
                </div>
            </div>

              <div className={`p-3 text-white`}>
                <Grid list={this.state.problems} OnViewDetailsClick={(problem) => this.openProblemDetails(problem)}/>
                <Modal
                  showModalTitle={true}
                  modalTitle='Problem Details' 
                  onClose={this.onCloseModal}
                  onSave={this.handleSubmit}
                  showModal={this.state.showModal}
                  buttonText='Submit Issue'
                  modalClassSize='modal-fullscreen'
                  showSaveButton={false}
                >
                  {this.state.formProblem !== undefined && <this.ProblemForm  {...this.state.formProblem}/>}
                </Modal>
              </div>
          </div>
      );
      }
  }

  private ProblemForm = (formProblem: Problem): JSX.Element => {
      return (
      <div className='card'>
        <div className={`card-body ${styles.militaryGreenBackground}`}>
            <form>
            <div className='row mb-2'>
              {/* Site Name Dropdown */}
              <div className='form-group col-md-4'>
                <label className={`text-white`}>Site Name</label>
                <select required className='form-select' value={formProblem.Site !== undefined ? formProblem.Site.Id : ''} 
                  onChange={(e) => this.setState(prev => ({ ...prev, siteName: e.target.value }))}>
                  <option value=''>Select Site</option>
                  {this.props.sites.map(site => (
                    <option key={site.Id} value={site.Id}>
                      {site.Title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div className='form-group col-md-4'>
                <label className={`text-white`}>Severity Level</label>
                <select required className='form-select'
                  value={this.state.formProblem.Severity}
                  onChange={(e) => this.setState(prev => ({ ...prev, severity: e.target.value as Severity }))}>
                  <option value=''>Select Severity</option>
                  <option value='critical'>Critical</option>
                  <option value='high'>High</option>
                  <option value='medium'>Medium</option>
                  <option value='low'>Low</option>
                </select>
              </div>

              {/* Device Type */}
              <div className='form-group col-md-4'>
                <label className={`text-white`}>Device Type</label>
                  <select required className='form-select'
                    value={this.state.formProblem.DeviceType !== undefined ? this.state.formProblem.DeviceType.Id : ''}
                    onChange={(e) => this.setState(prev => ({ ...prev, DeviceType: e.target.value }))}>
                    <option value=''>Select Type</option>
                    {this.props.deviceTypes.map(eq => (<option key={eq.Id} value={eq.Id}>{eq.Title}</option>))}
                  </select>
              </div>
            </div>
   
            <div className='row mb-2'>
                {/* Issue Title */}
              <div className='form-group col-md-4'>
                <label className={`text-white`}>Issue Title</label>
                <input type='text' required className='border'
                value={formProblem.IssueTitle}
                onChange={(e) => this.setState(prev => ({ ...prev, issueTitle: e.target.value }))}/>
              </div>

               {/* Contact Information */}
               <div className='form-group col-md-4'>
                <label className={`text-white`}>Reported By</label>
                <input type='text' required className='border'
                  value={this.state.formProblem.Author !== undefined ? this.state.formProblem.Author.Title : ''}
                  onChange={(e) => this.setState(prev => ({ ...prev, reportedBy: e.target.value }))}/>
              </div>
                
              {/* Device Category */}
              <div className='form-group col-md-4'>
                <label className={`text-white`}>Device Category</label>
                <select required className='form-select' 
                value={this.state.formProblem.DeviceCategory !== undefined ? 
                  this.state.formProblem.DeviceCategory.Id : ''}
                  onChange={(e) => this.handleCategoryChange(e.target.value)}>
                  <option value=''>Select Category</option>
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
              
              <div className='form-group col-md-4'>
                <label className={`text-white`}>Contact Number</label>
                <input type='tel' required className='form-control'
                  value={this.state.formProblem.ContactNumber}
                  onChange={(e) => this.setState(prev => ({ ...prev, contactNumber: e.target.value }))}/>
              </div>
              <div className='form-group col-md-4'>
                  {/* File Attachments */}
              {/* <label className={`text-white`}> Attachments</label> */}
              <div>
                <div className='flex items-center gap-4'>
                  <button type='button' 
                    onClick={() => this.fileInputRef && this.fileInputRef.click()}
                    style={{display: 'none'}}
                    aria-label='Add attachments'> 
                    Add Files
                  </button>
                </div>
                <label className='text-white'> Upload images or documents related to the issue</label>
                <input type='file' ref={(input) => {this.fileInputRef = input}}
                  onChange={this.handleFileChange} className={`form-control hidden ${styles.borderNone}`}
                  style={{border: 'none !important'}} multiple accept='image/*,.pdf,.doc,.docx,.txt' />

                {/* Attachment Preview */}
                {formProblem.Attachments !== undefined && formProblem.Attachments.length > 0 && (
                  <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                    {formProblem.Attachments.map(attachment => (
                      <div key={attachment.id} >
                        <button type='button' onClick={() => this.removeAttachment(attachment.id)}
                          aria-label={`Remove ${attachment.file.name}`}>
                          Remove
                        </button>
                        
                        {attachment.preview ? (
                          <div className='relative aspect-square'>
                            <img src={attachment.preview} alt='Preview' 
                            className='h-full w-full object-cover rounded'/>
                          </div>
                        ) : (
                          <div className='aspect-square flex items-center justify-center bg-gray-50 rounded'>
                            <FileUpload />
                          </div>
                        )}
                        <p className='mt-1 text-xs text-gray-500 truncate'>
                          {attachment.file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </div>
              <div className='form-group col-md-4'></div>
            </div>

            <div className='row mb-2'>
                {/* Description */}
                <div className='form-group col-md-12'>
                    <label className={`text-white`}>Issue Description</label>
                    <textarea required rows={3} className='form-control'
                      value={formProblem.Description}
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
          const query: string = `?$select=Id,Title,IssueTitle,Description,Severity,ContactNumber,AuthorId,Created,`+
        `Site/Id,Site/Title,DeviceType/Id,DeviceType/Title,DeviceCategory/Id,DeviceCategory/Title`+
        `&$expand=Site,DeviceType,DeviceCategory`;

          this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
                                  this.props.context.pageContext.web.absoluteUrl, 'Problems', query);
          await this.spCrudOperations._getItemsWithQuery()
          .then((data) => {
            data.map((obj) => {
              if(obj !== undefined){
                const author: IUser = this.props.users !== undefined && this.props.users.length > 0 ? this.props.users.filter(user => user.Id.toString() === obj.AuthorId.toString())[0] : undefined;
                let created: Date | undefined;
                if (obj.Created !== undefined) {// Convert string to Date first
                    created = new Date(this.spHelpers.adjustDateForGMTOffset(obj.Created));
                }
                const temp: Problem = {
                  Id: obj.Id !== undefined && obj.Id !== null ? obj.Id : undefined,
                  Author: author !== undefined ? author : undefined,
                  Created: created !== undefined ? created : undefined,
                  Site: obj.Site !== undefined && obj.Site !== null ? {Id: obj.Site.Id.toString(), Title: obj.Site.Title.toString()} : {Id: '', Title: ''},
                  IssueTitle: obj.IssueTitle !== undefined && obj.IssueTitle !== null ? obj.IssueTitle.toString() : '',
                  Description: obj.Description !== undefined && obj.Description !== null ? obj.Description.toString() : '',
                  Severity: obj.Severity !== undefined && obj.Severity !== null ? obj.Severity.toString() : '',
                  ContactNumber: obj.ContactNumber !== undefined && obj.ContactNumber !== null ? obj.ContactNumber.toString() : '',
                  DeviceType: obj.DeviceType !== undefined && obj.DeviceType !== null ? {Id: obj.DeviceType.Id.toString(), Title: obj.DeviceType.Title.toString()} : {Id: '', Title: ''},
                  DeviceCategory: obj.DeviceCategory !== undefined && obj.DeviceCategory !== null ? {Id: obj.DeviceCategory.Id.toString(), Title: obj.DeviceCategory.Title.toString()} : {Id: '', Title: ''},
                // Attachments: obj.Attachments !== undefined && obj.Attachments !== null ? obj.Attachments.toString() : '',
                };
                result.push(temp);
              }
            });
            this.setState({problems: result , originalProblems: result , loading: false});
          })
          .catch(error => {
            console.error('An error has occurred while retrieving items!', error);
          });
        } catch (error) {
        console.error('An error has occurred!', error);
      }
  }
}