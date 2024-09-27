document.getElementById('csv-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('file-input').files[0];

    if (fileInput) {
        Papa.parse(fileInput, {
            header: true,            // Đọc dữ liệu dưới dạng key-value (dòng đầu tiên là tiêu đề)
            dynamicTyping: true,     // Tự động chuyển đổi dữ liệu sang số nếu có thể
            complete: function(results) {
                displayData(results.data);
                document.getElementById('filter-section').style.display = 'block';  // Hiển thị phần lọc dữ liệu
            }
        });
    }
});

function displayData(data) {
    const csvOutput = document.getElementById('csv-output');
    let table = '<table><thead><tr>';

    // Lấy tên các cột
    const columns = Object.keys(data[0]);
    columns.forEach(column => {
        table += `<th>${column}</th>`;
    });
    table += '</tr></thead><tbody>';

    // Hiển thị dữ liệu các hàng
    data.forEach(row => {
        table += '<tr>';
        columns.forEach(column => {
            table += `<td>${row[column] || ''}</td>`;
        });
        table += '</tr>';
    });

    table += '</tbody></table>';
    csvOutput.innerHTML = table;
}

document.getElementById('filter-btn').addEventListener('click', function() {
    const dateFilter = document.getElementById('date-filter').value;
    const minAmount = parseFloat(document.getElementById('min-amount').value);
    const maxAmount = parseFloat(document.getElementById('max-amount').value);

    const startTime = performance.now();  // Đo thời gian bắt đầu xử lý

    // Lọc dữ liệu dựa trên các tiêu chí đã nhập
    const filteredData = filteredTransactions.filter(transaction => {
        let valid = true;

        // Kiểm tra ngày
        if (dateFilter) {
            const transactionDate = transaction["Ngày giao dịch"].split(' ')[0]; // Giả sử cột ngày có tên "Ngày giao dịch"
            valid = valid && (transactionDate === dateFilter);
        }

        // Kiểm tra số tiền tối thiểu
        if (!isNaN(minAmount)) {
            valid = valid && (transaction["Số tiền"] >= minAmount);  // Giả sử cột số tiền có tên là "Số tiền"
        }

        // Kiểm tra số tiền tối đa
        if (!isNaN(maxAmount)) {
            valid = valid && (transaction["Số tiền"] <= maxAmount);
        }

        return valid;
    });

    displayData(filteredData);  // Hiển thị dữ liệu sau khi lọc

    const endTime = performance.now();  // Đo thời gian kết thúc
    console.log(`Thời gian xử lý: ${(endTime - startTime).toFixed(2)} ms`);
});

// Thống kê tổng số tiền theo khoảng thời gian
function calculateTotalAmount(data, startDate, endDate) {
    const filteredData = data.filter(transaction => {
        const transactionDate = new Date(transaction["Ngày giao dịch"]);
        return transactionDate >= startDate && transactionDate <= endDate;
    });

    const totalAmount = filteredData.reduce((sum, transaction) => {
        return sum + transaction["Số tiền"];
    }, 0);

    return totalAmount;
}
