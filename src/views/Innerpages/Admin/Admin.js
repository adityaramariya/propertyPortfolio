import React, { Component }   from 'react';
import AdminData   from './AdminData';
var cols = [
    {
        key: 'name',
        label:  'Company Name'
    },
    {
        key: 'companyType',
        label: 'Company Type'
    },
    {
        key: 'taxNo',
        label: 'Company Tax No.'
    },
    {
        key: 'country',
        label: 'Country'
    },
    {
        key: 'phone1',
        label: 'Contact'
    },
    {
        key: 'cApproval',
        label: 'Approval'
    }
];

class Admin extends Component {
    render(){
        return(
            <AdminData cols={cols} />
        )
    }
}
export default Admin;

