import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DropdownDate from 'react-dropdown-date';
import LoadingOverlay from 'react-loading-overlay';

import { userActions } from '../_actions';

const formatDate = (date) => {	// formats a JS date to 'yyyy-mm-dd'
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                mobileNumber: '',
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            dateOfBirth:{
                day: -1,
                month: -1,
                year: -1
            },
            overlayActive: false,
            submitted: false,
            date: null,
            selectedDate: new Date()
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true });
        const { user } = this.state;
        if (user.mobileNumber && 
            (/\+62?([ -]?\d+)+|\(\d+\)([ -]\d+)/.test(user.mobileNumber)) &&
            user.firstName && 
            user.lastName && 
            user.email && 
            (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) &&
            user.password && 
            user.confirmPassword &&
            user.password == user.confirmPassword) {
            
            this.props.register(user);

            window.scrollTo(0, 0);
        }
    }

    render() {
        const { registering  } = this.props;
        const { user, submitted, dateOfBirth } = this.state;
        return (
            <div className="col-md-12">
                <form name="form" onSubmit={this.handleSubmit} disabled="disabled"  style={{padding: 30}}>
                    <h2>Registration</h2>
                    <div className={'form-group' + (submitted && (!user.mobileNumber || !(/\+62?([ -]?\d+)+|\(\d+\)([ -]\d+)/.test(user.mobileNumber))) ? ' has-error' : '')}>
                        <label htmlFor="firstName">Mobile Number</label>
                        {submitted && !user.mobileNumber &&
                            <div className="help-block">Mobile Number is required</div>
                        }
                        {submitted && user.mobileNumber != '' && !(/\+62?([ -]?\d+)+|\(\d+\)([ -]\d+)/.test(user.mobileNumber)) &&
                            <div className="help-block">Please enter indonesian mobile number with +62</div>
                        }
                        <input type="text" className="form-control" placeholder="Indonesian Mobile Number (with : +62)" name="mobileNumber" value={user.mobileNumber} onChange={this.handleChange} />
                    </div>
                    <div className={'form-group' + (submitted && !user.firstName ? ' has-error' : '')}>
                        <label htmlFor="firstName">First Name</label>
                        {submitted && !user.firstName &&
                            <div className="help-block">First Name is required</div>
                        }
                        <input type="text" className="form-control" placeholder="First Name" name="firstName" value={user.firstName} onChange={this.handleChange} />
                    </div>
                    <div className={'form-group' + (submitted && !user.lastName ? ' has-error' : '')}>
                        <label htmlFor="lastName">Last Name</label>
                        {submitted && !user.lastName &&
                            <div className="help-block">Last Name is required</div>
                        }
                        <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={user.lastName} onChange={this.handleChange} />
                    </div>
                    <div className={'form-group' + (submitted && ((dateOfBirth.day!=-1 || dateOfBirth.month!=-1 || dateOfBirth.year!=-1) && (dateOfBirth.day==-1 || dateOfBirth.month==-1 || dateOfBirth.year==-1)) ? ' has-error' : '')}>
                        <label>Date of Birth</label>
                        {submitted && ((dateOfBirth.day!=-1 || dateOfBirth.month!=-1 || dateOfBirth.year!=-1) && (dateOfBirth.day==-1 || dateOfBirth.month==-1 || dateOfBirth.year==-1)) &&
                            <div className="help-block">Please select valid DoB or keep the fields empty</div>
                        }
                        <DropdownDate
                            startDate={                         // optional, if not provided 1900-01-01 is startDate
                                '1950-01-01'                    // 'yyyy-mm-dd' format only
                            }
                            endDate={                           // optional, if not provided current date is endDate
                                new Date()                    // 'yyyy-mm-dd' format only
                            }
                            /*selectedDate={                      // optional
                                this.state.selectedDate         // 'yyyy-mm-dd' format only
                            }*/
                            order={                             // optional
                                ['month', 'day', 'year']        // Order of the dropdowns
                            }
                            onMonthChange={(month) => {         // optional
                                console.log(month);
                                if(typeof(month) == 'undefined'){
                                    dateOfBirth.month = -1;
                                    this.setState({ date: null, selectedDate: null });
                                    user.dateOfBirth = '';
                                    this.handleChange;
                                }else{
                                    dateOfBirth.month = month;
                                }
                            }}
                            onDayChange={(day) => {             // optional
                                console.log(day);
                                if(day == -1){
                                    this.setState({ date: null, selectedDate: null });
                                    user.dateOfBirth = '';
                                    this.handleChange;
                                }

                                dateOfBirth.day = day;
                            }}
                            onYearChange={(year) => {           // optional
                                console.log(year);
                                if(year == -1){
                                    this.setState({ date: null, selectedDate: null });
                                    user.dateOfBirth = '';
                                    this.handleChange;
                                }
                                
                                dateOfBirth.year = year;
                            }}
                            onDateChange={(date) => {           // optional
                                console.log(date);
                                this.setState({ date: date, selectedDate: formatDate(date) });
                                user.dateOfBirth = date;
                                this.handleChange;
                            }}
                            ids={                               // optional
                                {
                                    year: 'select-year',
                                    month: 'select-month',
                                    day: 'select-day'
                                }
                            }
                            names={                             // optional
                                {
                                    year: 'dobYear',
                                    month: 'dobMonth',
                                    day: 'dobDate'
                                }
                            }
                            classes={                           // optional
                                {
                                    dateContainer: 'row',
                                    yearContainer: 'col-md-4',
                                    monthContainer: 'col-md-4',
                                    dayContainer: 'col-md-4',
                                    year: 'form-control',
                                    month: 'form-control',
                                    day: 'form-control',
                                    yearOptions: 'row',
                                    monthOptions: 'row',
                                    dayOptions: 'row'
                                }
                            }
                            defaultValues={                     // optional
                                {
                                    year: 'Year',
                                    month: 'Month',
                                    day: 'Day'
                                }
                            }
                            options={                           // optional
                                {
                                    yearReverse: true,              // false by default
                                    monthShort: true,               // false by default
                                    monthCaps: true                 // false by default
                                }
                            }
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="gender">Gender</label>
                        <div class="form-check form-check-inline">

                            <input type="radio" class="form-check-input" name="gender" id="genderMale" value="M" checked={user.gender === "M"} onChange={this.handleChange} /> 
                            <label class="form-check-label" for="genderMale">&nbsp;Male</label>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="radio" class="form-check-input" name="gender" id="genderFemale" value="F" checked={user.gender === "F"} onChange={this.handleChange} /> 
                            <label class="form-check-label" for="genderFemale">&nbsp;Female</label>
                        </div>
                        
                    </div>
                    <div className={'form-group' + (submitted && (!user.email || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email))) ? ' has-error' : '')}>
                        <label htmlFor="email">Email</label>
                        {submitted && !user.email &&
                            <div className="help-block">Email is required</div>
                        }
                        {submitted && user.email != '' && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) &&
                            <div className="help-block">Please enter a valid email</div>
                        }
                        <input type="text" className="form-control" placeholder="Type your email" name="email" value={user.email} onChange={this.handleChange} />
                    </div>
                    <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" placeholder="Type your password" name="password" value={user.password} onChange={this.handleChange} />
                        {submitted && !user.password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && (!user.confirmPassword || user.confirmPassword != user.password) ? ' has-error' : '')}>
                        <label htmlFor="confirmPassword">Re-Enter Password</label>
                        <input type="password" className="form-control" placeholder="Confirm your password" name="confirmPassword" value={user.confirmPassword} onChange={this.handleChange} />
                        {submitted && !user.confirmPassword &&
                            <div className="help-block">Password is required</div>
                        }
                        {submitted && user.confirmPassword != user.password &&
                            <div className="help-block">Your password doesn't match</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary regis-button">Register {registering}</button>
                        
                        {registering && 
                            <div className="overlay"></div>
                        }
                        <Link to="/login" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }
}

function mapState(state) {
    const { registering } = state.registration;
    return { registering };
}

const actionCreators = {
    register: userActions.register
}

const connectedRegisterPage = connect(mapState, actionCreators)(RegisterPage);
export { connectedRegisterPage as RegisterPage };