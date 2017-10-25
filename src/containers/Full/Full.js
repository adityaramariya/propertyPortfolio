import React, { Component } from 'react';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Aside from '../../components/Aside/';
import ReduxToastr from 'react-redux-toastr';
class Full extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
            <Sidebar {...this.props}/>
            <main className="main">
                {this.props.children}
          </main>
            <Aside />
        </div>
        {/* <Footer /> */}
 <ReduxToastr
              timeOut={2000}
              newestOnTop={false}
              preventDuplicates={true}
              position="top-right"
              transitionIn="bounceIn"
              transitionOut="bounceOut"
              progressBar={false} /> 
      </div>
    );
  }
}

export default Full;
