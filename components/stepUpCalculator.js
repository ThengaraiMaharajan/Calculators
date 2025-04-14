alert('Step Up Investment Calculator loaded successfully!');
// elements
const downloadCSVBtn = document.getElementById('downloadCSV');
downloadCSVBtn.style.display = 'none';

// calculator for step up investment
document.getElementById('stepUpForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const years = parseInt(document.getElementById('years').value);
    const duration = parseInt(document.getElementById('duration').value);
    const step = parseFloat(document.getElementById('step').value);

    let totalMonths = years * 12;
    let currentAmount = amount;
    let cumulative = 0;
    let currentDate = new Date();
    let tableHTML = `
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>Sr No</th>
            <th>Month-Year</th>
            <th>Investment Amount (₹)</th>
            <th>Cumulative Investment (₹)</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 1; i <= totalMonths; i++) {
        if ((i - 1) % duration === 0 && i !== 1) {
            currentAmount += step;
        }

        cumulative += currentAmount;

        let monthYear = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });

        tableHTML += `
        <tr>
          <td>${i}</td>
          <td>${monthYear}</td>
          <td>₹${currentAmount.toFixed(2)}</td>
          <td>₹${cumulative.toFixed(2)}</td>
        </tr>
      `;

        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    tableHTML += '</tbody></table>';
    document.getElementById('result').innerHTML = tableHTML;
    downloadCSVBtn.style.display = 'block';
});

// excel download

function downloadTableAsCSV() {
    const rows = document.querySelectorAll("table tr");
    let csv = [];

    rows.forEach(row => {
        let cols = row.querySelectorAll("th, td");
        let rowData = Array.from(cols).map(col => `"${col.innerText.trim()}"`);
        csv.push(rowData.join(","));
    });

    const BOM = '\uFEFF'; // Fix for ₹ symbol
    const blob = new Blob([BOM + csv.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "stepup-investment.csv";
    a.click();

    window.URL.revokeObjectURL(url);
}

document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'downloadCSV') {
        downloadTableAsCSV();
    }
});