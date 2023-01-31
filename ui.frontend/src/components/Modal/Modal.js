import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactDOM from 'react-dom';
import { OPEN_MODAL, CLOSE_MODAL } from '../../store/constants';

const Modal = (props) => {
  const [loader, setLoader] = useState(false);
  const modalActive = useSelector(state => {
    return state.modal.modalActive
  });
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('modal opened::')
    document.body.addEventListener('keydown', closeOnEscapeKeyDown);
    return function cleanUp() {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDown)
    }
  }, []);


  var closeModal = function () {
    dispatch({ type: CLOSE_MODAL })
  };

  var closeOnEscapeKeyDown = function (e) {
    if ((e.charCode || e.keyCode) === 27) {
      closeModal();
    }
  }

  let modalContent =
    <div>
      <div className={modalActive ? 'modal-gradeout' : 'modal-overlay-module'} onClick={closeModal}>
      </div>
      <div className="modal-conatiner" aria-modal="true" role="dialog" aria-labelledby="modal-content">
        <div className="modal-conatiner-content msg" aria-expanded="true">
          <span onClick={closeModal} tabIndex="0" role="button" aria-label="close" className="close">
            <i className="icon icon-overlay-window-close-x"></i>
          </span>
          <div id="modal-content" className="content-text" style={{ maxHeight: '100%' }}>
            {
              loader &&
              <div className="loadertext">
                <img src="/content/dam/alcs/pmusa/marlboro/images/loyaltyenrollnow/enrollmentform/loadingicon.gif" alt="Loading" />
              </div>
            }
            {props.children}
          </div>
        </div>
      </div>
    </div>;

  return ReactDOM.createPortal(
    modalActive && modalContent
    ,
    document.getElementById('spa-root')
  );

}
export default Modal;