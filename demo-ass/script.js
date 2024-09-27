function loadCSV() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a CSV file first!');
        return;
    }

    Papa.parse(file, {
        header: true, // Đọc dòng đầu tiên làm header
        skipEmptyLines: true, // Bỏ qua dòng trống
        complete: function(results) {
            displayData(results.data); // Hiển thị dữ liệu sau khi phân tích
        },
        error: function(error) {
            console.error('Error reading file:', error);
        }
    });
}

function displayData(data) {
    const table = document.getElementById('output');
    table.innerHTML = ''; // Xóa nội dung bảng trước khi thêm dữ liệu mới

    // Tạo dòng tiêu đề (header)
    if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);
    }

    // Tạo nội dung bảng (body)
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}
