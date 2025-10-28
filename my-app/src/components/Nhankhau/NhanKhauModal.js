import './Nhankhau.scss'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

function NhanKhauModal(props) {
    return (
        <Modal {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Chi tiết
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                <div className="nk-detail">
                    <h4 className="mb-3">Thông tin nhân khẩu</h4>

                    <Row className="mb-2">
                        <Col xs={12} md={8}>
                            <label className="label">Họ tên</label>
                            <div className="info">Nguyễn Văn A</div>
                        </Col>
                        <Col xs={6} md={4}>
                            <label className="label">CCCD</label>
                            <div className="info">123456789012</div>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={6} md={4}>
                            <label className="label">Số hộ khẩu</label>
                            <div className="info">00001</div>
                        </Col>
                        <Col xs={6} md={4}>
                            <label className="label">Ngày sinh</label>
                            <div className="info">12/12/2000</div>
                        </Col>
                        <Col xs={6} md={4}>
                            <label className="label">Giới tính</label>
                            <div className="info">Nam</div>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={12} md={8}>
                            <label className="label">Địa chỉ</label>
                            <div className="info">123 Đường ABC, P.XYZ, Hà Nội</div>
                        </Col>
                    </Row>

                    <hr />

                    <Row className="mb-2">
                        <Col xs={6} md={4}>
                            <label className="label">Quan hệ với chủ hộ</label>
                            <div className="info">Con</div>
                        </Col>
                        <Col xs={6} md={4}>
                            <label className="label">Bí danh</label>
                            <div className="info">Anh A</div>
                        </Col>
                        <Col xs={6} md={4}>
                            <label className="label">Trạng thái</label>
                            <div className="info active">Thường trú</div>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NhanKhauModal;