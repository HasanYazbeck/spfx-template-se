import * as React from 'react';
import { ICalenderEventsSeProps , ICalenderEventsSeState , IEvent} from './ICalenderEventsSeProps';
import styles from './CalenderEventsSe.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SPCrudOperations } from '../../../Classes/SPCrudOperations';
import { SPHelpers } from '../../../Classes/SPHelpers';
import { ICommon, ISite } from '../../../Interfaces/ICommon';

export class CalenderEventsSe extends React.Component<ICalenderEventsSeProps,ICalenderEventsSeState> {
  private spCrudOperation: SPCrudOperations ;
  private spHelpers: SPHelpers = new SPHelpers();
  private timeInterval: number | undefined;
  // private loggedInUsername: string = this.props.context.pageContext.user.displayName;
  state: ICalenderEventsSeState = {
    events: [],
    sites:[],
    currentDate: new Date(),
    currentPage : 1,
    eventsPerPage: 3,
    selectedDate: new Date(),
    currentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
    showModal: false,
    IsTimeEarlier: false,
    newEvent: {Id: 0 , Title:'', EventDate: undefined,endDate:undefined , IsCategory:true , IsOtherCategory: false,StartTime: '',  // Initialize StartTime
    EndTime: '' },
    isLoading: false,
  }

  constructor(props: ICalenderEventsSeProps) {
    super(props);
  }
  
  componentDidMount(): void { 
    this.loadWebPartLists();
     // Update the time every second
     this.timeInterval = window.setInterval( () => {
      this.setState({
        currentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }, 1000);
  }

  componentWillUnmount(): void {
    // Clean up the interval when the component unmounts
    if (this.timeInterval) {
      window.clearInterval(this.timeInterval);
    }
  }

   private loadWebPartLists = async (): Promise<void> => {
    const events: IEvent[] =  await this.GetEvents();
    const sites: ISite[] = await this.GetSites();
     this.setState({events: events , sites: sites});
  }

  private getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  }
  // ***************************** JSX Elements ***********************************

  private CalendarDays = (): JSX.Element => {
    const year = this.state.currentDate.getFullYear();
    const month = this.state.currentDate.getMonth();
    const daysInMonth = this.getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const days = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    const emptyDays: (null | undefined)[] = [];
    for (let i = 0; i < firstDay; i++) {
        emptyDays.push(null);
    }
    const monthDays: number[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      monthDays.push(i);
    }

    return (
      <div>
        <div className={styles.calendarHeader}>
          {days.map(day => (
            <div key={day} className={styles.dayHeader}>{day}</div>
          ))}
        </div>
        <div className={styles.calendarDays}>
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className={`${styles.calendarDay} ${styles.empty}`} />
          ))}
          { monthDays.map(day => {

            const hasEvents = this.state.events.some(event => 
              event.startDate.getDate() === day && 
              event.startDate.getMonth() === month &&
              event.startDate.getFullYear() === year
            );

            const isSelected = this.state.selectedDate && this.state.selectedDate.getDate() === day &&
            this.state.selectedDate.getMonth() === month &&
            this.state.selectedDate.getFullYear() === year;
            
            return (
              <div key={day} className={`${styles.calendarDay} ${hasEvents ? styles.hasEvents : ''} ${isSelected ? styles.selectedDay : ''}`} 
                onClick={() => this.handleDayClick(day)}>
                <span className={styles.dayNumber}>{day}</span>
                {hasEvents && <span className={styles.eventIndicator} />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private EventsList = (): JSX.Element => {
    const { selectedDate, events } = this.state;

    // Use the method that already filters events by the selected date
    const currentPageEvents = this.getCurrentPageEvents(events);
    return (
      <div className={styles.eventsList}>
        {currentPageEvents.map((event, index) => (
          <div key={index} className={`${styles.eventItem} ${event.IsCompleted ? styles.completed : ''}`}>
            <div className={styles.eventCheckbox} onClick={() => this.EventCompletion(event)} role=''>
              {event.IsCompleted ? '✓' : '○'}
            </div>
            <div className={styles.eventDetails}>
              <span className={styles.eventTitle}>{event.Title}</span>
              <span className={styles.eventTime}>{event.fAllDayEvent? 'all-day' : 
              (<div>
                <div>
                  Starts @ {event.StartTime}
                </div> 
                <div>
                  Ends @ {event.EndTime}
                </div>
              </div>)
              }</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  private Pagination = (): JSX.Element => {
    const totalPages = this.getTotalPages();
  
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    if(pageNumbers.length > 0){
      return (
        <div className={styles.pagination}>
          <button className={styles.prev} onClick={this.handlePrevPage} disabled={this.state.currentPage === 1}>❮</button>
          {pageNumbers.map(page => (
            <span key={page} 
              className={`${styles.pageNumber} ${this.state.currentPage === page ? styles.active : ''}`}
              onClick={() => this.handlePageClick(page)} role=''>
              {page}
            </span>
          ))}
          <button className={styles.next} onClick={this.handleNextPage} disabled={this.state.currentPage === totalPages} role=''>❯</button>
        </div>
      );
    }
    else {
      return null;
    }
  }

  private EventModal = (): JSX.Element => {
    return(
          <div className={`modal show ${styles.modal} ${styles.show}`} style={{ display: 'block'}} aria-modal='true'>
              <div className='modal-dialog modal-dialog-centered modal-lg'>
                <div className='modal-content'>
                  <div className={`modal-header ${styles.modalHeaderCustomPadding} `}>
                    <h5 className='modal-title'>Add Mission</h5>
                    <button type='button' className={`${styles.close}`} data-dismiss='modal' aria-label='Close' onClick={this.toggleModal}>
                      <span aria-hidden='true'>&times;</span>
                    </button>
                  </div>
                  <div className='modal-body'>
                    <form>
                    <div className='container'>
                      <div className='row mb-1 align-items-center'>
                        <div className='col-md-3'>
                          <label className='form-label'>Title</label>
                        </div>
                        <div className='col-md-9'>
                            <input type='text' className='form-control'
                              placeholder='Enter event title' value={this.state.newEvent.Title}
                              onChange={(e) => this.handleInputChange(e, 'Title')}/>
                        </div>
                      </div>

                      <div className='row mb-1 align-items-center'>
                      <div className='col-md-3'>
                          <label className='form-label'>Site</label>
                        </div>
                        <div className='col-md-9'>
                              <select id='Site' className= {`form-select ${styles.formTextCustom} w-100`}
                                    onChange={(e) => this.handleSiteChange(e)}>
                                    <option value=''>Select Site</option>
                                    {this.state.sites.map(item => (
                                        <option key={item.Id} value={item.Id}>
                                            {item.Title}
                                        </option>
                                 ))}
                             </select>
                             </div>
                        </div>
                      
                      <div className='row mb-1 align-items-center'>
                        <div className='col-md-3'>
                          <label className='form-label'>Location</label>
                        </div>
                        <div className='col-md-9'>
                            <input type='text' className='form-control'
                              placeholder='Enter event location' value={this.state.newEvent.Location}
                              onChange={(e) => this.handleInputChange(e, 'Location')}/>
                        </div>
                      </div>

                      <div className='row mb-1 align-items-center'>
                        <div className='col-md-3'>
                          <label className='form-label'>Start Time</label>
                        </div>
                        <div className='col-md-5'>
                          <input type='time' className='form-control' style={{ 
                                borderColor: this.state.IsTimeEarlier ? 'red' : '',
                                backgroundColor: this.state.IsTimeEarlier ? '#fff0f0' : ''}}
                                value={this.state.newEvent.StartTime || ''}
                                onChange={(date) => this.handleDateChange(date, 'StartTime')} step='600'/>
                        </div>
                      </div>

                      <div className='row mb-1 align-items-center'>
                        <div className='col-md-3'>
                          <label className='form-label'>End Time</label>
                        </div>
                        <div className='col-md-5'>
                          <input type='time' value={this.state.newEvent.EndTime || ''}
                                 style={{ 
                                  borderColor: this.state.IsTimeEarlier ? 'red' : '',
                                  backgroundColor: this.state.IsTimeEarlier ? '#fff0f0' : ''}}
                                 className='form-control'
                                 onChange={(date) => this.handleDateChange(date, 'EndTime')} step='600'/>
                          {this.state.IsTimeEarlier && (<small className='text-danger'>End Time must be later than Start Time</small>)}
                        </div>
                      </div>

                      <div className='row mb-1'>
                        <div className='col-md-3'>
                          <label className='form-label'>Description</label>
                        </div>
                        <div className='col-md-9'>
                            <textarea className='form-control'
                              placeholder='Enter event description' value={this.state.newEvent.Description}
                              onChange={(e) => this.handleInputChange(e, 'Description')} rows={2}/>
                        </div>
                      </div>

                      <div className='row mb-1 align-items-center'>
                        <div className='col-md-3'>
                          <label className='form-label'>Category</label>
                        </div>

                        <div className='col-md-6'>
                           <div className='d-flex align-items-center mb-2'>
                           <input type='checkbox' className=' me-2'  style={{border:'1px solid'}}
                                  checked={this.state.newEvent.IsCategory} 
                                  onChange={(e) => this.handleCheckboxChange(e, 'IsCategory')}/>
                              <select id='Category' className= {`form-select ${styles.formTextCustom} w-100`} disabled = {!this.state.newEvent.IsCategory}
                                    onChange={(e) => this.handleCategoryChange(e)}>
                                    <option value=''>Select a Category</option>
                                    {this.props.categories.map(category => (
                                        <option key={category.Id} value={category.Id}>
                                            {category.Title}
                                        </option>
                                 ))}
                             </select>
                           </div>

                           <div className='d-flex align-items-center'>
                           <input type='checkbox' className=' me-2'  style={{border:'1px solid'}}
                                  checked={this.state.newEvent.IsOtherCategory} 
                                  onChange={(e) => this.handleCheckboxChange(e, 'IsOtherCategory')}/>
                            
                            <input type='text' className={`form-control ${styles.formTextCustom} w-100`} disabled = {!this.state.newEvent.IsOtherCategory}
                              placeholder='Enter your Category' value={this.state.newEvent.OtherCategory}
                              onChange={(e) => this.handleInputChange(e, 'OtherCategory')}/>
                           </div>
                        </div>
                      </div>

                      <div className='row mb-1 align-items-center mt-2'>
                        <div className='col-md-3'>
                          <label className='form-label'>All Day Event</label>
                        </div>
                        <div className='col-md-1'>
                          <input type='checkbox' className='' style={{border:'1px solid'}}
                                checked={this.state.newEvent.fAllDayEvent} 
                                onChange={(e) => this.handleCheckboxChange(e, 'fAllDayEvent')}/>
                        </div>
                        <div className='col-md-7'>
                        <label className='form-check-label'>Make this an all-day activity that doesn't start or end at a specific hour.</label>
                        </div>
                      </div>  
                      {/* <div className='row mb-1 align-items-center'>
                        <div className='col-md-3'>
                          <label className='form-label'>Recurrence</label>
                        </div>
                        <div className='col-md-1'>
                          <input type='checkbox' className='' style={{border:'1px solid'}}
                                checked={this.state.newEvent.fRecurrence} 
                                onChange={(e) => this.handleCheckboxChange(e, 'fRecurrence')}/>
                        </div>
                        <div className='col-md-7'>
                        <label className='form-check-label'>Make this a repeating event.</label>
                        </div>
                      </div>  */} 
                    </div>            
                    </form>
                  </div>
                  <div className='modal-footer'>
                    <button type='button' style={{backgroundColor:'#675645'}} className='btn btn-primary' 
                      onClick={this.handleAddRemark}>Save Event</button>
                  </div>
                </div>
              </div>
          </div>
    );
  }

  // *****************************End JSX Elements ***********************************

  // ***************************** Handle onClick Events functions ********************
  private handlePrevMonth = () => {
    const currentMonth: Date  = this.state.currentDate; // Assuming `currentMonth` is part of your state
    const newDate: Date = new Date(currentMonth.toDateString());
    newDate.setMonth(newDate.getMonth() - 1);
    this.setState({ currentDate: newDate });
  }

  private handleNextMonth = () => {
    const currentMonth: Date  = this.state.currentDate; // Assuming `currentMonth` is part of your state
    const newDate: Date = new Date(currentMonth.toDateString());
    newDate.setMonth(newDate.getMonth() + 1);
    this.setState({ currentDate: newDate });
  }

  private handleDayClick = (day: number): void => {
    const selectedDate = new Date(this.state.currentDate.toDateString());
    selectedDate.setDate(day);
    this.setState({ selectedDate , currentPage: 1 });
  }

  private handlePrevPage = () => {
    this.setState(prevState => ({
      currentPage: Math.max(1, prevState.currentPage - 1) // Ensure page is at least 1
    }));
  }

  private handleNextPage = () => {
    const totalPages = this.getTotalPages();
    this.setState(prevState => ({
      currentPage: Math.min(totalPages, prevState.currentPage + 1) // Ensure page doesn't exceed total pages
    }));
  }

  private handlePageClick = (page: number) => {
    this.setState({ currentPage: page });
  }

  // Handle input changes for text and date fields
  private handleInputChange = (event: React.ChangeEvent<any>, field: string) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState(prevState => ({
      newEvent: {
        ...prevState.newEvent,
        [field]: value
      }
    }));
  }

  // Handle changes for category selection
  private handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = this.props.categories.filter(category => category.Id === event.target.value);
    
    this.setState(prevState => ({
      newEvent: {
        ...prevState.newEvent,
        Category: selectedCategory || { Id: '', Title: '' }
      }
    }));
  }

  // Handle changes for category selection
  private handleSiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedSite = this.state.sites.filter(site => site.Id!.toString() === event.target.value);
      
      this.setState(prevState => ({
        newEvent: {
          ...prevState.newEvent,
          Site: selectedSite || { Id: '', Title: ''}
          // Category: selectedCategory || { Id: '', Title: '' }
        }
      }));
  }

  // Handle checkbox changes for recurrence and other boolean fields
  private handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value: boolean = event.target.checked;
    const emptyCategory = this.props.categories.filter(category => category.Id === '');

    if(field === 'IsCategory'){
      const dropdown: HTMLSelectElement = document.getElementById('Category') as HTMLSelectElement;
    if (dropdown) {
      // Clear the selected option
      dropdown.selectedIndex = 0; // Or use dropdown.value = '' to reset
    }
      this.setState(prevState => ({ 
        newEvent: {
          ...prevState.newEvent,
          IsOtherCategory : !value,
          IsCategory: value,
          OtherCategory: '',
          Category: emptyCategory || { Id: '', Title: '' },
        }
      }));
    } else if(field === 'IsOtherCategory'){
      const dropdown: HTMLSelectElement = document.getElementById('Category') as HTMLSelectElement;
      if (dropdown) {
        // Clear the selected option
        dropdown.selectedIndex = 0; // Or use dropdown.value = '' to reset
      }
      this.setState(prevState => ({ 
        newEvent: {
          ...prevState.newEvent,
          IsCategory : !value,
          IsOtherCategory: value,
          Category: emptyCategory || { Id: '', Title: '' },
        }
      }));
    }
    else {
      this.setState(prevState => ({
        newEvent: {
          ...prevState.newEvent,
          [field]: value
        }
      }));
    }
  }

   // Handle input changes for text and date fields
   private handleDateChange = (date: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value: string = date.target.value;
    if(field === 'StartTime' || field === 'EndTime'){

    const newStartTime: string = field === 'StartTime' ? value : this.state.newEvent.StartTime;
    const newEndTime: string = field === 'EndTime' ? value : this.state.newEvent.EndTime;
    const isTimeEarlier: boolean = newStartTime && newEndTime && newStartTime >= newEndTime;

      this.setState(prevState => ({
        newEvent: {
          ...prevState.newEvent,
          [field]: value
        }, IsTimeEarlier:isTimeEarlier
      }));
    }
  }

  private handleAddRemark = async (): Promise<void> => {
    try {
      
      const { newEvent} = this.state;
      const calendarDateSelected: Date = this.state.selectedDate;
      const startDate: Date = this.spHelpers.setDateWithSelectedTime(new Date(calendarDateSelected.toDateString()),newEvent.StartTime);
      const endDate: Date = this.spHelpers.setDateWithSelectedTime(new Date(calendarDateSelected.toDateString()),newEvent.EndTime);
      
      let categoryValue: string = '';
      if (newEvent.IsCategory && newEvent.Category.length > 0) {
          categoryValue = newEvent.Category[0].Title || ''; // Use the selected category from dropdown
      } else if (newEvent.IsOtherCategory && newEvent.OtherCategory) {
          categoryValue = newEvent.OtherCategory; // Use the custom category input
      }

      const item: any = {
        Title: newEvent.Title,
        SiteId: newEvent.Site[0].Id,
        // ParticipantsPicker: ,
        Location: newEvent.Location,
        Description: newEvent.Description,
        Category: categoryValue,
        fAllDayEvent: newEvent.fAllDayEvent,
        // fRecurrence: newEvent.fRecurrence,
        EventDate: startDate,
        EndDate: endDate,
        IsCompleted: false,
      };
  
      await this.addEvent(item);
      // Clear the form
      this.setState({ newEvent: {
            Id: 0,
            Title: '',
            Location: '',
            Description: '',
            Category: undefined,
            StartTime: '',
            EndTime: '',
            fAllDayEvent: false,
            fRecurrence: false,
            IsCategory: false,
            IsOtherCategory: false,
            OtherCategory: ''
        }
    });
  
    // Close the modal
    this.toggleModal();
  
      // Add a small delay before refreshing the events
      setTimeout(() => {
        this.loadWebPartLists();
    }, 1000);

    } catch (error) {
      console.error('An error occurred while adding the event:', error);
    }
  }
  // ***************************** End Handle onClick Events functions ********************

  private getTotalPages = (): number => {
    const { eventsPerPage, selectedDate, events } = this.state;
     // Filter events based on the selected date before calculating pages
    let filteredEvents: IEvent[] = events;
      if (selectedDate) {
        filteredEvents = events.filter(event => 
          event.startDate.getDate() === selectedDate.getDate() &&
          event.startDate.getMonth() === selectedDate.getMonth() &&
          event.startDate.getFullYear() === selectedDate.getFullYear()
        );
      }
  return Math.ceil(filteredEvents.length / eventsPerPage);
  }

  private getCurrentPageEvents = (events: IEvent[]): IEvent[] => {
    const { currentPage, eventsPerPage , selectedDate} = this.state;

    // Filter events by the selected date (if any)
  let filteredEvents: IEvent[]= events;
  if (selectedDate) {
    if(events.length > 0){
      filteredEvents = events.filter(event => 
        event.startDate.getDate() === selectedDate.getDate() &&
        event.startDate.getMonth() === selectedDate.getMonth() &&
        event.startDate.getFullYear() === selectedDate.getFullYear()
      );
    }
  }
 
  const startIndex = (currentPage - 1) * eventsPerPage;
    return filteredEvents.slice(startIndex, startIndex + eventsPerPage);
  }

  // Toggle modal visibility
  private toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
      newEvent: { ...prevState.newEvent, Title: '', 
                                         Location: '', 
                                         StartTime: '', 
                                         EndTime: '', 
                                         Description: '', 
                                         Category: { Id: '', Title: '' }, 
                                         OtherCategory: '', 
                                         Recurrence: false, 
                                         IsCompleted: false , 
                                          }
    }));
  }

// Event Completion Function, sets the field IsCompleted to true or false in SharePoint Events List.
  private EventCompletion = (event: IEvent) => {

    this.setState(prevState => {
      const updatedEvents = prevState.events.map(obj => {
        // Check if the current event's ID matches the specificID
        if (obj.Id === event.Id) {
            // Toggle the IsCompleted property
            const updatedObj =  {
                ...obj,
                IsCompleted: !obj.IsCompleted
            };

            this.spCrudOperation = new SPCrudOperations(this.props.context.spHttpClient, this.props.context.pageContext.web.absoluteUrl, 'Events','');
            const item: any = { Id: updatedObj.Id.toString, IsCompleted: updatedObj.IsCompleted};
            this.spCrudOperation._updateItem(updatedObj.Id.toString(), item);
            return updatedObj;
          }
        // If not the event we want, return it unchanged
        return obj;
    });
      return { events: updatedEvents };
    });
  }
 
  async addEvent(event: IEvent): Promise<void> {
    try {
      this.spCrudOperation = new SPCrudOperations(this.props.context.spHttpClient,this.props.context.pageContext.web.absoluteUrl, 'Events', '');
      await this.spCrudOperation._insertItem(event);
    } catch (error) {
    console.error('An error has occurred!', error);
    }
  }

  public render(): React.ReactElement<{}> {
    const now: Date = new Date();
    const dayNumber: number = now.getDate();  // Get the current day of the month (1-31)
    const time: string = this.state.currentTime;
    const dayName: string = now.toLocaleString('default', { weekday: 'long' }).toUpperCase();  // Get the full name of the weekday (e.g., 'Friday')
    
  return (
    <div className={styles.eventsCalendar}>
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeaderContainer}>
          <div className={styles.currentDay}>
            <span className={styles.dayNumber}>{dayNumber}</span>
            <div className={styles.dayInfo}>
              <span className={styles.time}>{time}</span>
              <span className={styles.dayName}>{dayName}</span>
            </div>
          </div>
          <div className={styles.navigation}>
            {/* <button className={styles.mapBtn}>Map</button> */}
            <button className={styles.messagesBtn}>Messages</button>
          </div>
        </div>
        <this.EventsList/>
        <this.Pagination/>
      </div>
      
      <div className={`${styles.calendarView}`}>
        <div className={styles.monthNavigation}>
          <button className={styles.prevMonth} onClick={this.handlePrevMonth}>❮</button>
          <span className={styles.currentMonth}>
            {this.state.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button className={styles.nextMonth} onClick={this.handleNextMonth}>❯</button>
        </div>
        <this.CalendarDays />
        <div className={styles.addEventContainer}>
          <input type='text' placeholder='00:00 Meeting' className={styles.addEventInput} />
          <button className={styles.addEventBtn}onClick={this.toggleModal} >+</button>
        </div>
      </div>
      {this.state.showModal && <this.EventModal/>}
    </div>
  );
  }

  private async GetEvents(): Promise<IEvent []> {
    try {
      const query: string ='';
      let result: IEvent [] = [];
      this.spCrudOperation = new SPCrudOperations(this.props.context.spHttpClient, this.props.context.pageContext.web.absoluteUrl,'Events',query);
      const reponse: any =  await this.spCrudOperation._getItems();
    
      if(reponse !== undefined && reponse.length > 0){
       reponse.map(item => {
          let temp: IEvent = {Id:0, Title:''};
          temp.GUID = item.GUID !== undefined ? item.GUID: undefined;
          temp.Id = item.Id !== undefined ? item.Id : 0;
          temp.Title = item.Title !== undefined ? item.Title : '';
          temp.IsCompleted = item.IsCompleted !== undefined ? item.IsCompleted : undefined;
          temp.Category =item.Category !== undefined ? item.Category : '';
          temp.Location = item.Location !== undefined ? item.Location : '';
          temp.Description = item.Description !== undefined ? item.Description : '';
          temp.fAllDayEvent = item.fAllDayEvent !== undefined ? item.fAllDayEvent : undefined;
          temp.fRecurrence = item.fRecurrence !== undefined ? item.fRecurrence : undefined;
          if (item.EventDate !== undefined) {
            temp.StartTime = this.spHelpers.convertGMTToLocalTime12Hour(item.EventDate);
            temp.startDate = new Date(item.EventDate);
          } else {
            temp.StartTime = '';
            temp.startDate = new Date(2024, 10, 29); // Default fallback date
          }

          if(item.EndDate !== undefined) {
            temp.EndTime = this.spHelpers.convertGMTToLocalTime12Hour(item.EndDate);
            temp.endDate = new Date(item.EndDate);
          } else {
            temp.EndTime = '';
            temp.endDate = new Date(2024, 10, 29); // Default fallback date
          }
          result.push(temp);
        });
        }
     return result;
    }
    catch (err) {
      console.log(err);
    }
  }

  private async GetSites(): Promise<ISite []> {
    try {
      const query: string ='';
      let result: ISite [] = [];
      this.spCrudOperation = new SPCrudOperations(this.props.context.spHttpClient, this.props.context.pageContext.web.absoluteUrl,'Site',query);
      const reponse: any =  await this.spCrudOperation._getItems();
    
      if(reponse !== undefined && reponse.length > 0){
       reponse.map(item => {
          const temp: ISite = {
            Id : item.Id !== undefined ? item.Id : 0,
            Title: item.Title !== undefined ? item.Title : '',
            MTSID: item.MTSID !== undefined ? item.MTSID : '',
            PowerTechSiteName: item.PowerTechSiteName !== undefined ? item.PowerTechSiteName : undefined,
            SiteType:''
           }
          result.push(temp);
        });
        }
     return result;
    }
    catch (err) {
      console.log(err);
    } 
  }

  private async GetSitesTypes(): Promise<ICommon[]> {
    try {
      const query: string ='';
      let result: ICommon [] = [];
      this.spCrudOperation = new SPCrudOperations(this.props.context.spHttpClient, this.props.context.pageContext.web.absoluteUrl,'SiteType',query);
      const reponse: any =  await this.spCrudOperation._getItems();
    
      if(reponse !== undefined && reponse.length > 0){
       reponse.map(item => {
          const temp: ICommon = {
            Id : item.Id !== undefined ? item.Id : 0,
            Title: item.Title !== undefined ? item.Title : '',
           }
          result.push(temp);
        });
        };
     return result;
    }
    catch (err) {
      console.log(err);
    } 
  }
}