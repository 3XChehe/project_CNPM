import './Nhankhau.scss'

const nhankhau = (props) => {
    return (
        <div className="nk-table-container">
            <div className="nk-header">
                <h3>Danh sách hộ khẩu</h3>
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc CCCD..."
                // onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>CCCD</th>
                        <th>Họ tên</th>
                        <th>Giới tính</th>
                        <th>Số hộ khẩu</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>0981884</th>
                        <th>Nguyễn Văn A</th>
                        <th>Nam</th>
                        <th>00001</th>
                        <td>
                            <button className="view-btn" onClick={() => alert("me")}>
                                Xem
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <th>0943454</th>
                        <th>Trần thị B</th>
                        <th>Nữ</th>
                        <th>00002</th>
                        <td>
                            <button className="view-btn" onClick={() => alert("me")}>
                                Xem
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <th>09019084</th>
                        <th>Cao Tuấn C</th>
                        <th>Nam</th>
                        <th>00003</th>
                        <td>
                            <button className="view-btn" onClick={() => alert("me")}>
                                Xem
                            </button>
                        </td>
                    </tr>
                    {/* render data ở đây */}
                </tbody>
            </table>
        </div>
    )
}
export default nhankhau;