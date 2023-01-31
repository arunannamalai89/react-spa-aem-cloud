
import React from 'react';
const Modal = (props) => {
    return (
        <div className="modal-conatiner hide" aria-modal="true" role="dialog" aria-labelledby="modal-content">
            <div className="modal-conatiner-content msg" aria-expanded="true">
                <span tabIndex="0" role="button" aria-label="close" className="close">
                    <i className="icon icon-overlay-window-close-x"></i>
                </span>
                <div id="modal-content" className="content-text" style={{maxHeight:'100%'}}>
                </div>
            </div>
        </div>
    )
}
export default Modal;