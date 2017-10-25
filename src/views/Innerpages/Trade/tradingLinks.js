import React, {Component} from 'react';
class TradingLinks extends Component{
    renderTradingLinks(){
        var tradingLinks = this.props.tradingLinks.tradingLinks;
        console.log(tradingLinks);
        return tradingLinks.map(function(tradingLink){
            return(
                <li key={tradingLink.value} className="nav-item dropdown">
                    <a key={tradingLink.label} href="#"
                       className="nav-link dropdown-toggle nav-link"
                    >
                        {tradingLink.value}
                    </a>
                    <ul className="dropdown-menu-right dropdown-menu">
                        {tradingLink.dropdownLinks &&   tradingLink.dropdownLinks.map((dropdownLink)=>(
                            <li key={tradingLink.id} className="dropdown-item">
                                <a key={tradingLink.linkValue} href="#">{dropdownLink.linkValue}</a>
                            </li>
                        ))}
                    </ul>
                </li>
            )
        });
    }
    render(){
        return
        (
            <ul
                className="nav navbar-nav ml-auto">
                {this.renderTradingLinks()}
            </ul>
        )

    }
}
export default TradingLinks;

/*  const linkList = ({dropdown, dropdown_toggle, className, ...props}) =>{
 return <linkList
 type="button"
 className={classNames(
 "nav-item",
 dropdown && "dropdown",
 className
 )}>
 <a
 className={classNames(
 "nav-link ",
 dropdown_toggle && "dropdown-toggle",
 className
 )}
 href="#">
 </a>
 </linkList>
 }*/
/*  renderDropdownLinks(){
 var dropdownLinks = tradingLinks;
 console.log(dropdownLinks);
 return(
 dropdownLinks.map((dropdownLink)=> {
 return (
 <li className="dropdown-item">
 <a
 onClick={this.addTable.bind(this)}>
 {dropdownLink.linkValue}
 </a>
 </li>
 )
 })
 )
 }*/
/*    renderTradingLinks(){
 return tradingLinks.map(function(tradingLink){
 console.log(tradingLink.dropdownLinks[0].linkValue);
 return(
 <li className="nav-item dropdown">
 <a
 className="nav-link dropdown-toggle nav-link"
 href="#">
 {tradingLink.value}
 </a>
 </li>


 )
 /!* {tradingLink.dropdownLinks.map(function(dropdownLink){
 <ul className="dropdown-menu-right dropdown-menu">
 {dropdownLink.linkValue}
 </ul>
 })}*!/

 });
 }*/