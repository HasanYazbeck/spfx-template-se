import * as React from 'react';
import {IProblemsProps , IProblemsState , Problem , Severity , FileWithPreview} from './IProblems';
import { ISite , IDeviceCategory , IDeviceType } from '../../../../Interfaces/ICommon';
import { SPCrudOperations } from '../../../../Classes/SPCrudOperations';
import { SearchBar } from '../SearchBarComponent/SearchBar';
import { FileUpload } from '../Common/FileUpload';

export class Problems extends React.Component<IProblemsProps, IProblemsState> {
    private spCrudOperations: SPCrudOperations;
    private fileInputRef: HTMLInputElement | null = null;
    //   {
    //     category: 'Air Conditioning',
    //     types: ['Indoor Unit', 'Outdoor Unit']
    //   },
    //   {
    //     category: 'Network Equipment',
    //     types: ['Switch', 'Router', 'POE']
    //   },
    //   {
    //     category: 'Security Systems',
    //     types: ['Indoor Camera', 'Outdoor Camera', 'Motion Detection Sensor']
    //   },
    //   {
    //     category: 'Communication Equipment',
    //     types: ['Motorola Mobile Transceiver Station']
    //   },
    //   {
    //     category: 'Microwave Links',
    //     types: ['Cambium', 'Mikrotik', 'Sia', 'Ericsson']
    //   },
    //   {
    //     category: 'Cabling',
    //     types: ['Single Mode Fiber', 'Multi Mode Fiber', 'Network Cable']
    //   }
    // ];

    state: IProblemsState = {
        searchResults: [],
        selectedItem: null,
        loading: true,
        error: null,
        formProblem : { 
          siteName: '',
          siteLocation: '',
          deviceCategory: {Id: '', Title: ''},
          deviceType: {Id: '', Title: ''},
          issueTitle: '',
          description: '',
          severity: '' as Severity,
          reportedBy: '',
          contactNumber: ''},
          attachments: [],
          selectedCategory: null
      }

    constructor(props: IProblemsProps) {
        super(props);
    }

    componentWillMount(): void {
      this.fetchSites();
    }
    
    private fetchSites = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // this.setState({ sites: this.props.sites});
      } catch (err) {
        this.setState({error: 'Failed to load sites. Please try again later.'});
        console.error('Error fetching sites:', err);
      } finally {
        this.setState({loading:false});
      }
    };

    private handleCategoryChange = (category: string) => {
      const selected = this.props.deviceCategories.filter(eq => eq.Title === category);
      // this.setState({selectedCategory : selected || null});
      this.setState(prev => ({
        ...prev,
        deviceCategory: category,
        deviceType: ''
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
        ...prevState, attachments: [...prevState.attachments, ...newAttachments]
      }));
       
      
      // Reset file input
      if (this.fileInputRef) {
        this.fileInputRef.value = '';
      }
    };

    private removeAttachment = (id: string) => {
      this.setState(prevState => {
        const attachment: FileWithPreview = prevState.attachments.filter(a => a.id === id).length > 0 ? prevState.attachments.filter(a => a.id === id)[0] : {file:null, id:''};
        // const attachment = prev.filter(a => a.id === id);
        if (attachment!.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
        return { ...prevState,
          attachments: prevState.attachments.filter(a => a.id !== id) 
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

    public render(): React.ReactElement<{}> {

      if (this.state.loading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-gray-600">Loading sites...</div>
          </div>
        );
      }
    
      if (this.state.error) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-600">{this.state.error}</div>
          </div>
        );
      }

        return (
            <div className={`directory-container`}>
                {/* <div className={`mt-1 position-relative`}>
                  <SearchBar keyId={'PropblemsSearchBar'} itemTitle='Problems' OnChange={this.handleSearchChange}
                  onSelectItem={this.handleItemSelect} searchResults={this.state.searchResults}/>
                </div> */}
                <div className={`p-3 text-white`}>
                {<this.ProblemForm/>}
                </div>
            </div>
        );
    }

    private ProblemForm = (): JSX.Element => {
      return (
      <div className="card">
        <div className={`card-header text-white text-center`} style={{backgroundColor: '#4d784e'}}>
            {/* <AlertCircle className="h-6 w-6 text-red-500" /> */}
            <h1 className="text-2xl font-bold text-gray-900">NOC Problem Form</h1>
        </div>
        <div className="card-body">
          {/* <form onSubmit={this.handleSubmit}> */}
            <form>
            <div className="row mb-2">
              {/* Site Name Dropdown */}
              <div className="form-group col-md-6">
                <label>Site Name</label>
                <select required className="form-select" value={this.state.formProblem.siteName} 
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
              <div className="form-group col-md-6">
                <label className="block text-sm font-medium text-gray-700">Site Location</label>
                <input type="text" required  className='form-control' value={this.state.formProblem.siteLocation}
                  onChange={(e) => this.setState(prev => ({ ...prev, siteLocation: e.target.value }))}/>
              </div>
            </div>
   
            <div className="row mb-2">
                {/* Equipment Type */}
                <div className='form-group col-md-6'>
                  <label>Equipment Type</label>
                  <select required className="form-select"
                    value={this.state.formProblem.deviceType.Id}
                    onChange={(e) => this.setState(prev => ({ ...prev, deviceType: e.target.value }))}>
                    <option value="">Select Type</option>
                    {this.props.deviceTypes.map(eq => (<option key={eq.Id} value={eq.Id}>{eq.Title}</option>))}
                  </select>
                </div>

               {/* Equipment Category */}
               <div className='form-group col-md-6'>
                <label>Equipment Category</label>
                <select required className='form-select' value={this.state.formProblem.deviceCategory.Id}
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
               {/* Issue Title */}
               <div className='form-group col-md-6'>
               <label>Issue Title</label>
              <input type="text" required className="border"
                value={this.state.formProblem.issueTitle}
                onChange={(e) => this.setState(prev => ({ ...prev, issueTitle: e.target.value }))}/>
               </div>
                
              {/* Contact Information */}
              <div className='form-group col-md-6'>
                <label>Reported By</label>
                <input type="text" required className="border"
                  value={this.state.formProblem.reportedBy}
                  onChange={(e) => this.setState(prev => ({ ...prev, reportedBy: e.target.value }))}/>
              </div>
            </div>

            <div className='row mb-2'>
                {/* Description */}
                <div className='form-group col-md-12'>
                    <label>Issue Description</label>
                    <textarea required rows={4} className='form-control'
                      value={this.state.formProblem.description}
                      onChange={(e) => this.setState(prev => ({ ...prev, description: e.target.value }))}/>
                </div>
            </div>

            <div className='row mb-2'>
               {/* Severity */}
              <div className='form-group col-md-6'>
                <label >Severity Level</label>
                <select required className="form-select"
                  value={this.state.formProblem.severity}
                  onChange={(e) => this.setState(prev => ({ ...prev, severity: e.target.value as Severity }))}>
                  <option value="">Select Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className='form-group col-md-6'>
                <label>Contact Number</label>
                <input type="tel" required className="form-control"
                  value={this.state.formProblem.contactNumber}
                  onChange={(e) => this.setState(prev => ({ ...prev, contactNumber: e.target.value }))}/>
              </div>
            </div>
            
            {/* File Attachments */}
            <div className='row mb-2'>
              <label className=""> Attachments</label>
              <div className="">
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => this.fileInputRef && this.fileInputRef.click()}
                    className="">
                    Add Files
                  </button>
                  <p className="text-sm text-gray-500"> Upload images or documents related to the issue</p>
                </div>
                <input type="file" ref={(input) => {this.fileInputRef = input}}
                  onChange={this.handleFileChange}
                  className="hidden" multiple accept="image/*,.pdf,.doc,.docx,.txt" />

                {/* Attachment Preview */}
                {this.state.attachments.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {this.state.attachments.map(attachment => (
                      <div key={attachment.id} className="relative group rounded-lg border border-gray-200 p-2" >
                        <button type="button" onClick={() => this.removeAttachment(attachment.id)}
                          className="absolute -right-2 -top-2 z-10 rounded-full bg-red-100 p-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* <X className="h-4 w-4" /> */}
                        </button>
                        
                        {attachment.preview ? (
                          <div className="relative aspect-square">
                            <img src={attachment.preview} alt="Preview" className="h-full w-full object-cover rounded"/>
                          </div>
                        ) : (
                          <div className="aspect-square flex items-center justify-center bg-gray-50 rounded">
                            <FileUpload />
                            {/* className="h-8 w-8 text-gray-400"  */}
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

            {/* Submit Button */}
            <div className="float-end">
              <button type="submit" className="btn btn-primary" onSubmit={() => this.handleSubmit}>
                {/* <Send className="h-4 w-4" />  */}
                Submit Issue </button>
            </div>
          </form>
        </div>
    </div>
    )
  }

    // Handle search input change
    private handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let probkemTitle: string = event.currentTarget.value;
      probkemTitle = probkemTitle.replace(/'/g, "''");
        if (probkemTitle === '' ) {
          this.setState({ selectedItem: null, searchResults: []});
        } else {
          // this.searchProblem(probkemTitle);
        }
      }

    // Handle site selection
    private handleItemSelect = (problem: Problem) => {
      if (problem !== null ) {
        this.setState({ selectedItem: problem, searchResults: []});
      } else {
        this.setState({ selectedItem: null, searchResults: []});
      }
    }
}