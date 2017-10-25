import React,{ Component }  from 'react';
import { Button} from 'reactstrap';
import Select from 'react-select';
import Request from 'axios';
import { toastr } from 'react-redux-toastr'


const apiBaseUrl = 'api/v1/public/registration/';
const config = {
           headers: { 
           "Content-Type": "application/json",
           "AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
                    }
            };

class ProductConf extends Component {
	componentWillMount() {
		this.state = {
		ProductCreationRequest:{},
		productAdd : {}
		};
		this.getProductCreationPageDetails();
	}
	getProductList() {
		var self = this;
		Request.get(apiBaseUrl + 'getProductList').then(function(response) {
			console.log(response.data);
			if (response.data.productsList) {
				self.setState({
					productList: response.data.productsList
				});
			}
			}).catch(function(error) {
				console.log("Product Conf -- > getProductList"+error);
				toastr.error('Error', 'Not able to get Product Type List , Server Error');
			});
	}
	getProductCreationPageDetails() {
		var self = this;
		Request.get(apiBaseUrl + 'getProductCreationPageDetails')
			.then(function(response) {
				console.log(response.data);
				self.setState({productAdd : response.data});
				self.getProductList();
				var array3 = [];
				for (var i = 0; i < response.data.mProductNameBaseList.length; i++) {
					array3.push(response.data.mProductNameBaseList[i].id);
				}
				self.state.ProductCreationRequest["productNameBase"] = array3
				self.setState({
					prodId: array3
				});
			})
			.catch(function(error) {
				console.log("Product Conf -- > getProductCreationPageDetails"+error);
				toastr.error('Error', 'Not able to get Product Creation Detail, Server Error');
			});
	}
	onChangeProduct(keyName, stateName, e) {
		var newState = this.state[stateName];
		newState[keyName] = e.target.value;
		this.setState({
			[stateName]: newState
		})
	}
	addProduct(e) {
		var self = this;
		if(!this.state.ProductCreationRequest["productType"]){
			toastr.error('Error', 'Please Select Product Type');
		}else if(!this.state.ProductCreationRequest["year"]){
		toastr.error('Error', 'Please Select Year');
		}else{
			this.setState({ProductCreationRequest : {productNameBase : this.state.prodId}});
			Request.post(apiBaseUrl + 'createProduct/', this.state.ProductCreationRequest, config)
				.then(function(response) {
					toastr.success('Success', 'Product created successfully');
					self.getProductList();
				})
				.catch(function(error) {
					console.log("Product Conf -- > addProduct"+error);
					toastr.error('Error', 'Not able to add Product');
				});
		}
	}
	render(){
 		return(
			<div className="card">
				{/*<div className="card-header">*/}
					{/*Reports*/}
				{/*</div>*/}
				<div className="card-block">
					<div className="row">
						<div className="col-md-3">
							<div className="form-group">
								<label>Product Type</label>
								<select className="form-control"
										value={this.state.ProductCreationRequest.productType}
										defaultValue={this.state.ProductCreationRequest.productType ? this.state.ProductCreationRequest.productType : ''}
										onChange={this.onChangeProduct.bind(this,"productType","ProductCreationRequest")}>
									<option value="" disabled className="hide">Select Product Type</option>
									{ this.state.productAdd.productTypeList && this.state.productAdd.productTypeList.map(function(row, responseIndex) {
										return <option key={row.id} value={row.id} className="selection-style">{row.loadType.id !== 0 ? row.country.code + " " + 																		row.productCategory.code + " " + row.loadType.code + " " + row.transactionType.code :
										row.country.code + " " + row.productCategory.code + " " + row.transactionType.code}
										</option>
									})
									}
								</select>
							</div>
						</div>
						<div className="col-md-3">
							<div className="form-group">
								<label>Year</label>
								<select className="form-control"
										value={this.state.ProductCreationRequest.year}
										defaultValue={this.state.ProductCreationRequest.year ? this.state.ProductCreationRequest.year : ''}
										onChange={this.onChangeProduct.bind(this,"year","ProductCreationRequest")}>
									<option value="" disabled className="hide">Select Year</option>
									{ this.state.productAdd.yearList &&
									this.state.productAdd.yearList.map(function(options, responseIndex) {
										return <option key={options} value={options} className="selection-style">{options}
										</option>
									})
									}
								</select>
							</div>
						</div>
						<div className="col-md-6">
							<div className="form-group">
								<label>Product</label>
								<Select
									name="form-field-name2"
									value={this.state.prodId}
									options={this.state.productAdd.mProductNameBaseList}
									disabled
									multi
								/>
							</div>
						</div>
					</div>
					<Button color="primary" onClick={this.addProduct.bind(this)} >Save</Button>{' '}
					<div className="card card-outline-secondary">
						<div className="card-header">
							ProductList
						</div>
						<div className="card-block">
							<div className="scrollableContent">
								<table className="table table-bordered editableTable">
									<thead>
									<tr>
										<th>Product Type</th>
										<th>Year</th>
										<th>Product</th>
									</tr>
									</thead>
									<tbody>
									{this.state.productList && this.state.productList.map(( row, index ) => {
										return (
											<tr key={index}>
												<td>{row.productType.country.code} {row.productType.productCategory.code}
													{row.productType.loadType.code} {row.productType.transactionType.code}</td>
												<td>{row.year}</td>
												<td>{row.productBaseName.name}</td>
											</tr>
										);
									})}
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
export default ProductConf;

