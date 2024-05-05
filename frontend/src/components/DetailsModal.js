import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DetailsModal(props) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        {props.location_details.substring(0, 125) + ' ...'}
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {props.location_details}
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DetailsModal;