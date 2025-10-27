import './Hokhau.scss'
const hokhau = (props) => {
    return (
        <div className="hk-table-container">
            <div className="hk-header">
                <h3>Danh sách hộ khẩu</h3>
                <input
                    type="text"
                    placeholder="Tìm theo chủ hộ hoặc số nhà..."
                // onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Số hộ khẩu</th>
                        <th>Số nhà</th>
                        <th>Đường</th>
                        <th>Phường</th>
                        <th>Quận</th>
                        <th>Ngày lập</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>00001</th>
                        <th>12</th>
                        <th>Trần Đại Nghĩa</th>
                        <th>Đồng Tâm</th>
                        <th>Hai Bà Trưng</th>
                        <th>12/1/2000</th>
                    </tr>
                    <tr>
                        <th>00002</th>
                        <th>99</th>
                        <th>Trần Đại Nghĩa</th>
                        <th>Đồng Tâm</th>
                        <th>Hai Bà Trưng</th>
                        <th>31/1/1998</th>
                    </tr>
                    <tr>
                        <th>00003</th>
                        <th>12</th>
                        <th>Trần Đại Nghĩa</th>
                        <th>Đồng Tâm</th>
                        <th>Hai Bà Trưng</th>
                        <th>23/6/1977</th>
                    </tr>
                    {/* render data ở đây */}
                </tbody>
            </table>
        </div>
    )
}
export default hokhau;