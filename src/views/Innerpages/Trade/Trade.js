import React, { Component } from 'react';
import { Button,ModalFooter} from 'reactstrap';
import { toastr } from 'react-redux-toastr'
var  tradingLinks=[
    {
        value: 'Product',
        label: 'Product',
        dropdownLinks: [
            {
                id: 1,
                linkValue: 'Turkey Physical Base Load'
            },
            {
                id: 2,
                linkValue: 'Turkey Physical Peak Load'
            },
            {
                id: 3,
                linkValue: 'Turkey Financial Base Load'
            },
            {
                id: 4,
                linkValue: 'Turkey Financial Peak Load'
            },
				
            ]
    }    
    
    ];
var tradeTable={
    cardHeaderData:[
        {
            key: 1,
            label:'Turkey Physical Base Load'
        }
    ],
    tableHeading : [
        {
            key: 'Product',
            label: 'Product'
        },
        // {
        //     key: 'Lot',
        //     label: 'Lot'
        // },
        {
            key: 'Qty',
            label: 'Qty'
        },
        {
            key: 'Bid',
            label: 'Bid'
        },
        {
            key: 'Ask',
            label: 'Ask'
        },
        {
            key: 'Qty2',
            label: 'Qty'
        },
        // {
        //     key: 'Lot2',
        //     label: 'Lot'
        // },
        // {
        //     key: 'CMP',
        //     label: 'CMP'
        // },
        // {
        //     key: 'Change',
        //     label: 'Change'
        // }
    ],
    tableBody: [
        {
            id: 'a1',
            Product : 'JAN18',
            Lot: 1,
            Qty: 'Jan',
            Bid: '2',
            Ask: '1',
            Qty2: '12545',
            Lot2: '12545',
            CMP: '12545',
            Change: '12545',
        },
        {
            id: 'a2',
            Product : 'FEB17',
            Lot: 1,
            Qty: 'Jan',
            Bid: '2',
            Ask: '1',
            Qty2: '12545',
            Lot2: '12545',
            CMP: '12545',
            Change: '12545',
        },
        {
            id: 'a3',
            Product : 'MAR17',
            Lot: 1,
            Qty: 'Jan',
            Bid: '2',
            Ask: '1',
            Qty2: '12545',
            Lot2: '12545',
            CMP: '12545',
            Change: '12545',
        },
        {
            id: 'a4',
            Product : 'APR17',
            Lot: 1,
            Qty: 'Jan',
            Bid: '2',
            Ask: '1',
            Qty2: '12545',
            Lot2: '12545',
            CMP: '12545',
            Change: '12545',
        },
        {
            id: 'a2',
            Product : 'MAY17',
            Lot: 1,
            Qty: 'Jan',
            Bid: '2',
            Ask: '1',
            Qty2: '12545',
            Lot2: '12545',
            CMP: '12545',
            Change: '12545',
        }
    ]
}
// const leftPos = Math.random() + 100;
// var self = this;
var getRandomPositionForPopup={
}
class Trade extends Component {
    componentWillMount() {
        this.state = {
                tradinkArray : [],
                arrayList : [],
                addOrder : []
            }
    }
    handleCheck(val) {
        return this.state.tradinkArray.some(item => val === item);
    }
    selectTraderList(dropdownLink){
        console.log(dropdownLink);
        if(this.handleCheck(dropdownLink)){
            toastr.error('Error', 'Product is already selected');
        }else{
            this.state.tradinkArray.push(dropdownLink);            
            if(this.state.arrayList.length === 1){
                this.state.arrayList.push({dropdownLinks:dropdownLink.linkValue,tradeTable:tradeTable});
            }else{
                this.state.arrayList.push({dropdownLinks:dropdownLink.linkValue,tradeTable:tradeTable});
            }
            this.setState({arrayList:this.state.arrayList});
        }
    }
    removeTradeBox(item,index,e){
        console.log(item);
        this.state.arrayList.splice(index,1);
        this.state.tradinkArray.splice(index,1);
        this.setState({arrayList : this.state.arrayList,tradinkArray:this.state.tradinkArray});
    }
    generateCardHeaderData(){        
        return tradeTable.cardHeaderData.map(function(cardHeaderData){
            return <span key={cardHeaderData.key}>{cardHeaderData.label}</span>;
        });
    }
    generateHeaders() {       
        return tradeTable.tableHeading.map(function(colData){
            return <th key={colData.key}>{colData.label}</th>;
        });
    }
    deleteHandler(index){
        var array = this.state.tableHeading;
        console.log(array);
        var newArray = array.slice();
        console.log(newArray);
        newArray.splice(index, 1);
        this.setState({tradingLimitTable: newArray});
    };
	toggleLarge = (item) => {
        this.state.addOrder.push(1);
        console.log(item);
       // this.setState({leftPos : Math.random() + 100});
        this.setState({
            large: !this.state.large,
                addOrder :this.state.addOrder,
                modal: "showModal"
        });
	}
    generateRows() {
         var self = this;
         return tradeTable.tableBody.map(function(item) {
            var cells = tradeTable.tableHeading.map(function(colData,index) {
                if(index === 0){
                return <td key={index}> <a onClick={self.toggleLarge.bind(this,item)}>{item[colData.key]}</a></td>;
                }
                return <td key={item[colData.id]}>{item[colData.key]}</td>;
            });
            return <tr key={item.key}>{cells}</tr>;
        });
    }
    renderTradingLinks(){
        var self = this;
        return tradingLinks.map(function(tradingLink){
            return(
                <li key={tradingLink.value} className="nav-item dropdown">
                    <a key={tradingLink.label} href="#"
                       className="nav-link dropdown-toggle nav-link">
                        {tradingLink.value}
                    </a>
                    <ul className="dropdown-menu-right dropdown-menu">
                        {tradingLink.dropdownLinks &&   tradingLink.dropdownLinks.map((dropdownLink)=>(
                            <li key={tradingLink.id} className="dropdown-item">
                                <a key={tradingLink.linkValue} onClick={self.selectTraderList.bind(self,dropdownLink)}>{dropdownLink.linkValue}</a>
                            </li>
                        ))}
                    </ul>
                </li>
            )
        });
    }
    render(){
        var self = this;
		var cardHeaderData = this.generateCardHeaderData(),
            headerComponents = this.generateHeaders(),
            rowComponents = this.generateRows();
        return (
            <div className="animated fadeIn">
                <div className="flex ">
                    <div className="leftFixDropdown">
                        <ul className="nav navbar-nav ml-auto">
                            {this.renderTradingLinks()}
                        </ul>
                    </div>
                    <div className="trading-right--wrapper">
                        {self.state.arrayList.map(function(item,index){
                        return(
                            <div className="card tradingTableWrapper">
                                <div className="card-header flex justify-content-between align-items-center">
                                    {item.dropdownLinks
                                    }
                                    <a>
                                    <i className="glyphicons glyphicons-remove"
                                    onClick={self.removeTradeBox.bind(self,item,index)}>
                                    </i>
                                    </a>
                                </div>
                                <div className="scrollableContent">
                                    <table className="points_table table table-bordered">
                                        <thead>{headerComponents}</thead>
                                        <tbody>{rowComponents}</tbody>
                                    </table>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                </div>
                {this.state.addOrder.map(function(item){
                    return(
                    <div  className={'customPopup ' + self.state.modal} > {/*style={{left:Math.random()*100 + 100} }*/}
                        <div className="tradingTableWrapper">
                            <div className="card-header flex justify-content-between align-items-center">
                                Turkey Base Load
                                <a className="flex">
                                    <i onClick={self.toggleLarge.bind(self)} className="glyphicons glyphicons-remove"></i>
                                </a>
                            </div>
                            <div className="customPopupBody ">
                                <div className="row tradeProduct">
                                    <div className="col-sm-6 border-right-1 pt-80 tradingShowTable">
                                        <div className="scrollableContent">
                                            <table className="table condensed-table table-bordered table-align-middle ">
                                                <thead>
                                                <tr>
                                                    <th>Buy</th>
                                                    <th>Quantity</th>
                                                    <th>MD</th>
                                                    <th>Price</th>
                                                    <th>MD</th>
                                                    <th>Qty</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>1234</td>
                                                    <td></td>
                                                    <td>5687</td>
                                                    <td></td>
                                                    <td>5475</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>1234</td>
                                                    <td></td>
                                                    <td>5687</td>
                                                    <td></td>
                                                    <td>5475</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>1234</td>
                                                    <td></td>
                                                    <td>5687</td>
                                                    <td></td>
                                                    <td>5475</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>1234</td>
                                                    <td></td>
                                                    <td>5687</td>
                                                    <td></td>
                                                    <td>5475</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>1234</td>
                                                    <td></td>
                                                    <td>5687</td>
                                                    <td></td>
                                                    <td>5475</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>1234</td>
                                                    <td></td>
                                                    <td>5687</td>
                                                    <td></td>
                                                    <td>5475</td>
                                                    <td></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 pt-2 tradingActionTable">
                                        <div className="row">
                                            <div className="form-group col-sm-6">
                                                <label for="name">Trader</label>
                                                <select className="form-control" id="tList" >
                                                    <option value="Trader one">Trader one</option>
                                                    <option value="Trader one">Trader one</option>
                                                    <option value="Trader one">Trader one</option>
                                                    <option value="Trader one">Trader one</option>
                                                    <option value="Trader one">Trader one</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-sm-6">
                                                <label for="name">Brokers</label>
                                                <select className="form-control" id="bList" >
                                                    <option value="Broker one">Broker one</option>
                                                    <option value="Broker one">Broker one</option>
                                                    <option value="Broker one">Broker one</option>
                                                    <option value="Broker one">Broker one</option>
                                                    <option value="Broker one">Broker one</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="scrollableContent">
                                            <table className="table condensed-table table-bordered table-align-middle editableTable">
                                                <thead>
                                                <tr>
                                                    <th >Buy</th>
                                                    <th className="bg-primary">Quantity</th>
                                                    <th>MD</th>
                                                    <th className="bg-danger">Price</th>
                                                    <th>MD</th>
                                                    <th>Qty</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>1234</td>
                                                    <td className="bg-primary"></td>
                                                    <td>5687</td>
                                                    <td className="bg-danger"></td>
                                                    <td>5475</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td><input type="text" className="form-control" value="1234" /></td>
                                                    <td className="bg-primary"><input type="text" className="form-control"  /></td>
                                                    <td><input type="text" className="form-control" value="5687" /></td>
                                                    <td className="bg-danger"><input type="text" className="form-control"  /></td>
                                                    <td><input type="text" className="form-control"  value="1234" /></td>
                                                    <td><input type="text" className="form-control"  /></td>
                                                </tr>
                                                <tr>
                                                    <td>1234</td>
                                                    <td className="bg-primary"></td>
                                                    <td>5687</td>
                                                    <td className="bg-danger"></td>
                                                    <td>5475</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>1234</td>
                                                    <td className="bg-primary"></td>
                                                    <td>5687</td>
                                                    <td className="bg-danger"></td>
                                                    <td>5475</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>1234</td>
                                                    <td className="bg-primary"></td>
                                                    <td>5687</td>
                                                    <td className="bg-danger"></td>
                                                    <td>5475</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>1234</td>
                                                    <td className="bg-primary"></td>
                                                    <td>5687</td>
                                                    <td className="bg-danger"></td>
                                                    <td>5475</td>
                                                    <td></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row purchaseProduct">
                                    <div className="col-sm-6">
                                        <input type="text" className="form-control" placeholder="Quantity"/>
                                    </div>
                                    <div className="col-sm-6">
                                        <input type="text" className="form-control" placeholder="Price"/>
                                    </div>
                                    <div className="button-group">
                                        <Button className={ 'btn-md btn btn-primary' } color="primary">Buy</Button>{' '}
                                        <Button className={ 'btn-md btn btn-success' }  color="success">Sell</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )})}
			</div>
        )
    }
}
export default Trade;