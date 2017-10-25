import React, { Component } from 'react';
import ReduxToastr from 'react-redux-toastr';

class Simple extends Component {
  render() {
    return (
<div>
      <div className="app flex-row align-items-center">
        {this.props.children}
      </div>
 <ReduxToastr
              timeOut={2000}
              newestOnTop={false}
              preventDuplicates={true}
              position="top-right"
              transitionIn="bounceIn"
              transitionOut="bounceOut"
              progressBar={false} />   
</div>    );
  }
}

export default Simple;
