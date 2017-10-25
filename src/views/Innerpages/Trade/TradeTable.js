import React, { Component } from 'react';
class TradingData extends Component {
    deleteHandler(index){
        var array = this.state.tableHeading;
        console.log(array);
        var newArray = array.slice();
        console.log(newArray);
        newArray.splice(index, 1);
        this.setState({tradingLimitTable: newArray});
    };
    render(){
        var cardHeaderData = this.generateCardHeaderData(),
            headerComponents = this.generateHeaders(),
            rowComponents = this.generateRows();

        // var rowComponents = this.generateRows();
        return(
            <div className="card tradingTableWrapper">
                <div className="card-header flex justify-content-between align-items-center">
                    {cardHeaderData}
                    <a className="flex" onClick={this.deleteHandler.bind(this)}>
                        <i className="glyphicons glyphicons-remove"></i>
                    </a>
                </div>
                <div className="scrollableContent">
                   <table className="points_table condensed-table table table-bordered">
                        <thead>{headerComponents}</thead>
                        <tbody>{rowComponents}</tbody>
                    </table>
                </div>
            </div>
      )
    }



    generateCardHeaderData(){
        const cardHeaderData = this.props.cardHeaderData.cardHeaderData;
        return cardHeaderData.map(function(cardHeaderData){
            return <span key={cardHeaderData.key}>{cardHeaderData.label}</span>;
        });
    }
    generateHeaders() {
        var tableHeading = this.props.tableHeading.tableHeading;
        return tableHeading.map(function(colData){
            return <th key={colData.key}>{colData.label}</th>;
        });
    }

    // generateRows() {
    //     const tableRows = this.props.tableData;
    //     console.log('tableRows is', tableRows);
    //         return tableRows.map(function (x) {
    //             return x.tableBody && x.tableBody.map(function(item){
    //                 alert('yo yo');
    //                     var cells = x.tableHeading && x.tableHeading.map(function(colData){
    //                             console.log('tableHeading key is', colData.key);
    //                             return <td key={item[colData.id]}>{item[colData.key]}</td>;
    //                         });
    //                     console.log('cells', cells);
    //                     return <tr key={item.id} className={item.id}>{cells}</tr>;
    //             });
    //         });
    // }
    generateRows() {
        var tableHeading = this.props.tableHeading.tableHeading,
            tableBody = this.props.tableBody.tableBody;
        return tableBody.map(function(item) {
            var cells = tableHeading.map(function(colData) {
                return <td key={item[colData.id]}>{item[colData.key]}</td>;
            });
            return <tr key={item.key}>{cells}</tr>;
        });
    }
  /*  generateRows() {
     var tableHeading = this.props.tableHeading.tableHeading,
         tableBody = this.props.tableBody.tableBody;
        return tableBody.map(function(item) {
            var cells = tableHeading.map(function(colData) {
                return <td key={item[colData.id]} className={item[colData.key]}>{item[colData.key]}</td>;
            });
            return <tr key={item.key} className={item.key}>{cells}</tr>;
        });
    }*/
}
export default TradingData;