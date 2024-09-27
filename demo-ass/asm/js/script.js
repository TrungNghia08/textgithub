let transactions = [];


document.getElementById("csvFile").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true, 
            dynamicTyping: true, 
            complete: function(results) {
                transactions = results.data;
                alert("Tải file CSV thành công!");
               displayResults(transactions) 
                
            },
            error: function(err) {
                console.error("Error parsing CSV file:", err); 
            }
        });
    }
});

// Sự kiện lọc
document.getElementById("filterBtn").addEventListener("click", function() {
    const startTime = performance.now(); 

    const startDateValue = document.getElementById("startDate").value;
    const endDateValue = document.getElementById("endDate").value;
    const startDate = new Date(startDateValue); 
    const endDate = new Date(endDateValue); 
    const minAmount = parseFloat(document.getElementById("minAmount").value) || 0; 
    const maxAmount = parseFloat(document.getElementById("maxAmount").value) || Number.MAX_VALUE; 
    const contentFilter = document.getElementById("contentFilter").value.toLowerCase(); 

    
        const filteredTransactions = transactions.filter(transaction => {
            // Kiểm tra xem transactionDate có tồn tại không
            if (!transaction["transactionDate"]) return false; 

            // Chuyển đổi transactionDate từ chuỗi thành Date
            const dateTimeParts = transaction["transactionDate"].split('_');
            const datePart = dateTimeParts[0]; // 
            const timePart = dateTimeParts[1]; 

            // Chuyển phần ngày thành định dạng chuẩn của JavaScript
            const dateSegments = datePart.split('/');
            const formattedDate = `${dateSegments[2]}-${dateSegments[1]}-${dateSegments[0]}`; // Chuyển thành "2024-09-01"
            
            // Xử lý phần giờ và chuyển đổi nó thành "hh:mm:ss"
            const hours = Math.floor(timePart / 10000); // Lấy giờ từ phần đầu
            const minutes = Math.floor((timePart % 10000) / 100); // Lấy phút
            const seconds = Math.floor(timePart % 100); // Lấy giây
            const formattedTime = `${hours}:${minutes}:${seconds}`; // Tạo thành chuỗi "hh:mm:ss"

            const transactionDate = new Date(`${formattedDate} ${formattedTime}`); // Tạo đối tượng Date từ chuỗi
            const amount = parseFloat(transaction["amount"]); // Chuyển đổi chuỗi thành số
            const content = transaction["content"] ? transaction["content"].toLowerCase() : ""; // Kiểm tra xem cột content có tồn tại không, nếu có thì chuyển thành chữ thường(toan tu ba ngoi)

            // Điều kiện lọc: kiểm tra ngày, số tiền và nội dung có thỏa mãn không
            return (!isNaN(transactionDate) && transactionDate >= startDate && transactionDate <= endDate) &&
                (amount >= minAmount && amount <= maxAmount) &&
                content.includes(contentFilter);
        });

    // Kiểm tra số lượng giao dịch sau khi lọc
    if (filteredTransactions.length === 0) {
        alert("Không có giao dịch nào thỏa mãn điều kiện lọc.");
    }

    // Ghi nhật ký các giao dịch đã lọc để kiểm tra
    console.log("Filtered Transactions:", filteredTransactions);

    // Hiển thị kết quả lọc
    displayResults(filteredTransactions);

    // Kết thúc tính thời gian xử lý
    const endTime = performance.now();
    document.getElementById("processingTime").innerText = (endTime - startTime).toFixed(2);

    // Hiển thị số lượng giao dịch đã lọc
    document.getElementById("quantity").innerText = filteredTransactions.length; // Hiển thị số lượng
});

// Hàm hiển thị kết quả lọc lên bảng
function displayResults(transactions) {
    const tableBody = document.getElementById("resultsTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Xóa nội dung cũ của bảng

    let totalAmount = 0; // Biến lưu tổng số tiền

    // Duyệt qua từng giao dịch và thêm hàng vào bảng
    transactions.forEach(transaction => {
        const row = document.createElement("tr"); // Tạo dòng mới cho bảng

        const dateCell = document.createElement("td"); // Tạo ô cho ngày tháng
        dateCell.innerText = transaction["transactionDate"]; // Hiển thị ngày tháng
        row.appendChild(dateCell); // Thêm ô vào dòng

        const amountCell = document.createElement("td"); // Tạo ô cho số tiền
        amountCell.innerText = transaction["amount"]; // Hiển thị số tiền
      
        totalAmount += parseFloat(transaction["amount"]); // Cộng số tiền vào tổng
        row.appendChild(amountCell); // Thêm ô vào dòng

        const contentCell = document.createElement("td"); // Tạo ô cho nội dung
        contentCell.innerText = transaction["content"]; // Hiển thị nội dung
        row.appendChild(contentCell); // Thêm ô vào dòng

        tableBody.appendChild(row); // Thêm dòng vào bảng
    });

    // Hiển thị tổng số tiền
    document.getElementById("totalAmount").innerText = totalAmount.toFixed(2);
}
