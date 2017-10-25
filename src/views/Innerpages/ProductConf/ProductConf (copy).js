import React,{ Component }  from 'react';
import { Button} from 'reactstrap';
import Select from 'react-select';
import moment from "moment";
import Reactable from 'reactable';
import ReactPaginate from 'react-paginate';


const apiBaseUrl = 'http://localhost:8793/api/v1/user/';
const config = {
           headers: { 
           "Content-Type": "application/json",
           "AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
                    }
            };
var Table = Reactable.Table,
    Thead = Reactable.Thead,
    Th = Reactable.Th;

var sgTeams = [
  {name: "SG-1", leader: "Oneil", assignment: "Exploration", members: 4},
  {name: "SG-2", leader: "Kawalsky", assignment: "Search and Rescue", members: 5},
  {name: "SG-3", leader: "Reynolds", assignment: "Marine Combat", members: 10},
  {name: "SG-4", leader: "Howe", assignment: "Medical", members: 4},
  {name: "SG-5", leader: "Davis", assignment: "Marine Combat", members: 6},
  {name: "SG-6", leader: "Fischer", assignment: "Search and Rescue", members: 10},
  {name: "SG-7", leader: "Isaacs", assignment: "Scientific", members: 6},
  {name: "SG-8", leader: "Yip", assignment: "Medical", members: 6},
  {name: "SG-9", leader: "Winters", assignment: "Diplomatic", members: 7},
  {name: "SG-10", leader: "Colville", assignment: "Military Exploration", members: 5}
];



var options = [
  { value: 'AL', label: 'Alabama', disabled: true },
  { value: 'AK', label: 'Alaska' },
  { value: 'AS', label: 'American Samoa' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District Of Columbia' },
  { value: 'FM', label: 'Federated States Of Micronesia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'GU', label: 'Guam' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MH', label: 'Marshall Islands' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'MP', label: 'Northern Mariana Islands' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PW', label: 'Palau' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VI', label: 'Virgin Islands' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

function logChange(val) {
    console.log("Selected: " + val);
}

console.clear();

class ProductConf extends Component {
constructor(props) {
    super(props);
    this.state = {     
  value: 'UT',
todos: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r'],
          currentPage: 1,
          todosPerPage: 3,
 data : [
  {name: "SG-1", leader: "Oneil", assignment: "Exploration", members: 4},
  {name: "SG-2", leader: "Kawalsky", assignment: "Search and Rescue", members: 5},
  {name: "SG-3", leader: "Reynolds", assignment: "Marine Combat", members: 10},
  {name: "SG-4", leader: "Howe", assignment: "Medical", members: 4},
  {name: "SG-5", leader: "Davis", assignment: "Marine Combat", members: 6},
  {name: "SG-6", leader: "Fischer", assignment: "Search and Rescue", members: 10},
  {name: "SG-7", leader: "Isaacs", assignment: "Scientific", members: 6},
  {name: "SG-8", leader: "Yip", assignment: "Medical", members: 6},
  {name: "SG-9", leader: "Winters", assignment: "Diplomatic", members: 7},
  {name: "SG-10", leader: "Colville", assignment: "Military Exploration", members: 5}
],
 offset: 0,
 activePage: 15
    };
  this.saveChanges = this.saveChanges.bind(this);
this.handleClick = this.handleClick.bind(this);
  }

 saveChanges(value) {
    this.setState({ value });
  }


componentDidMount() {
     this.setState({data: this.state.data, pageCount: Math.ceil(5)});
  }



handleClick(event) {
        this.setState({
          currentPage: Number(event.target.id)
        });
      }




 handlePageClick = (data) => {
    let selected = data.selected;
console.log('selected -- '+selected);
console.log('this.props.perPage -- '+this.props.perPage);
    let offset = Math.ceil(selected * this.props.perPage);

    this.setState({offset: offset}, () => {
this.setState({data: this.state.data, pageCount: Math.ceil(5)});
   
    });
  };










renderTable() {
   return (
    <Table className="table" data={sgTeams} />
   )
 }

render(){

  const { todos, currentPage, todosPerPage } = this.state;

        // Logic for displaying current todos
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

        const renderTodos = currentTodos.map((todo, index) => {
          return <li key={index}>{todo}</li>;
        });



 const data1 = this.state.data.map((todo, index) => {
          return <li key={index}>{todo}</li>;
        });



        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
          pageNumbers.push(i);
        }


 const renderPageNumbers = pageNumbers.map(number => {
          return (
           <div className="pull-right">
                            <nav>
                                <ul className="pagination">                                   
<li className="page-item">
                                        <a className="page-link"  key={number}
              id={number} onClick={this.handleClick}>{number}</a>
                                    </li>
                                   
                                </ul>
                            </nav>
                        </div>

          );
        });




        return(
           <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            Reports
                        </div>
                        <div className="card-block">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Product Type</label>
                                        <select name="rType" id="rType" className="form-control">
                                            <option value="Transaction Details Report">Transaction Details Report</option>
                                            <option value="Transaction Details Report">Transaction Details Report</option>
                                            <option value="Transaction Details Report">Transaction Details Report</option>
                                            <option value="Transaction Details Report">Transaction Details Report</option>
                                        </select>
                                    </div>
                                </div> 
 				<div className="col-md-3">
                                    <div className="form-group">
                                        <label>Year</label>
 {renderTodos}

  {renderPageNumbers}




 <div className="commentBox">

        <ReactPaginate previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={<a href="">...</a>}
                       breakClassName={"break-me"}
                       pageCount={this.state.pageCount}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={this.handlePageClick}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active"} />
         </div>




                                    </div>
                                </div> 
                              
				  <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Product</label>
                               <Select
                 		 name="form-field-name2"
                 		 value={this.state.value}
                 		 options={options}
                		  onChange={this.saveChanges}
               			   multi
             			   />
                                    </div>
                                </div>
                             </div>
                            
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <Button color="primary" onClick={this.toggle}>Download</Button>{' '}
                                    <Button color="secondary" onClick={this.toggle}>Reset</Button>
  				<div className="row">
                      				  </div>
                                  </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ProductConf;

