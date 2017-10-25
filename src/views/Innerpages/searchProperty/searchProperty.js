import React, { Component } from 'react';
import {FormWithConstraints, FieldFeedbacks, FieldFeedback, Bootstrap4} from 'react-form-with-constraints';
const {FormGroup, FormControlInput} = Bootstrap4;
import Select from 'react-select';
// React select
var options = [
  { value: 'AL', label: 'Alabama', disabled: true },
  { value: 'AK', label: 'Alaska' },
  { value: 'AS', label: 'American Samoa' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
];


class searchProperty extends FormWithConstraints {
   constructor(props) {
     super(props)
     this.saveChanges = this.saveChanges.bind(this)
     this.state = {
       value: ''
     }
   }

   saveChanges(value) {
     this.setState({ value });
   }


    onChange(e) {
        const target = e.currentTarget;
        this.setState({
            [target.name]: target.value
        });
        
        super.handleChange(e);
        this.setState({
            submitButtonDisabled: !this.isValid()
        });
    }
    render(){    
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="card">
                            <div className="card-block">                                
                                <h5>Heading</h5>  
                                <FormGroup for="name">
                                    <FormControlInput
                                        type="text"
                                        name="Name"
                                        value={this.state.Name}
                                        onChange={this.onChange.bind(this)}
                                        placeholder="Name"
                                        required/>
                                    <FieldFeedbacks for="Name">
                                        <FieldFeedback when="*"/>
                                    </FieldFeedbacks>
                                </FormGroup>
                                <FormGroup for="AreaNumber">
                                    <FormControlInput
                                        type="password"
                                        id="AreaNumber"
                                        name="AreaNumber"
                                        value={this.state.AreaNumber}
                                        onChange={this.onChange.bind(this)}
                                        pattern=".{5,}"
                                        placeholder="Area Number"
                                        required/>
                                    <FieldFeedbacks for="AreaNumber" show="all">
                                        <FieldFeedback when="valueMissing"/>                                        
                                    </FieldFeedbacks>
                                </FormGroup> 
                                <FormGroup for="Type">
                                    <Select
                                      name="form-field-name2"
                                      value={this.state.value}
                                      options={options}
                                      onChange={this.saveChanges}
                                      multi
                                    />
                                </FormGroup>
                                <div className="di">
                                    <div className="col-sm-6 p-0">
                                        <FormGroup for="dateFrom">
                                           <FormControlInput
                                               type="text"
                                               name="dateFrom"
                                               value={this.state.dateFrom}
                                               onChange={this.onChange.bind(this)}
                                               placeholder="Date From"
                                               required/>
                                           <FieldFeedbacks for="dateFrom">
                                               <FieldFeedback when="*"/>
                                           </FieldFeedbacks>
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm-6 p-0">
                                        <FormGroup for="dateTo">
                                           <FormControlInput
                                               type="text"
                                               name="dateTo"
                                               value={this.state.dateTo}
                                               onChange={this.onChange.bind(this)}
                                               placeholder="Date To"
                                               required/>
                                           <FieldFeedbacks for="dateTo">
                                               <FieldFeedback when="*"/>
                                           </FieldFeedbacks>
                                        </FormGroup>
                                    </div>
                                   
                                </div>
                                  <div className="text-center">
                                    <button
                                        type="button"
                                        className="btn btn-primary">Search
                                    </button> 
                                  </div>                              
                            </div>                                     
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="card">
                            <div className="card-block">
                                <div className="di justify-content-between">
                                    <h5>Heading</h5>
                                    <button type="button" className="btn btn-success btn-sm">Add Property</button>
                                </div>                               
                                <table className="table mt-1">
                                    <thead>
                                    <tr>
                                        <th>Property ID</th>
                                        <th>Name</th>
                                        <th>Buy Price</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Land</td>
                                        <td>Property Name 1</td>
                                        <td>5</td>
                                        <td>$10,000</td>
                                    </tr>
                                    <tr>
                                        <td>Hotel</td>
                                        <td>Property Name 1</td>
                                        <td>5</td>
                                        <td>$10,000</td>
                                    </tr>
                                    <tr>
                                        <td>Apartment</td>
                                        <td>Property Name 1</td>
                                        <td>5</td>
                                        <td>$10,000</td>
                                    </tr>  
                                    <tr>
                                        <td>Total</td>
                                        <td>Property Name 1</td>
                                        <td>5</td>
                                        <td>$10,000</td>
                                    </tr>
                                    
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default searchProperty;