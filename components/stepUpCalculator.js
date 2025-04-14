const form = document.getElementById('stepUpForm');
const downloadCSVBtn = document.getElementById('downloadCSV');
const downloadPDFBtn = document.getElementById('downloadPDF');
const resultContainer = document.getElementById('result');
const loading = document.getElementById('loading');

downloadCSVBtn.style.display = 'none';
downloadPDFBtn.style.display = 'none';

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const amount = parseFloat(document.getElementById('amount').value);
  const years = parseInt(document.getElementById('years').value);
  const duration = parseInt(document.getElementById('duration').value);
  const step = parseFloat(document.getElementById('step').value);

  const totalMonths = years * 12;
  if (totalMonths <= 0) {
    resultContainer.innerHTML = `<div class="alert alert-warning">Please enter a valid number of years.</div>`;
    return;
  }

  let currentAmount = amount;
  let cumulative = 0;
  let currentDate = new Date();

  let tableHTML = `
    <div id="exportArea">
    <table class="table table-bordered table-striped mt-4">
      <thead class="table-dark">
        <tr>
          <th scope="col">Sr No</th>
          <th scope="col">Month-Year</th>
          <th scope="col">Investment Amount (₹)</th>
          <th scope="col">Cumulative Investment (₹)</th>
        </tr>
      </thead>
      <tbody>
  `;

  loading.style.display = 'block';

  for (let i = 1; i <= totalMonths; i++) {
    if ((i - 1) % duration === 0 && i !== 1) {
      currentAmount += step;
    }

    cumulative += currentAmount;
    const monthYear = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });

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

  tableHTML += '</tbody></table></div>';

  setTimeout(() => {
    loading.style.display = 'none';
    resultContainer.innerHTML = tableHTML;
    downloadCSVBtn.style.display = 'inline-block';
    downloadPDFBtn.style.display = 'inline-block';
  }, 300);
});

function downloadTableAsCSV() {
  const rows = document.querySelectorAll("table tr");
  const csv = [];

  rows.forEach(row => {
    const cols = row.querySelectorAll("th, td");
    const rowData = Array.from(cols).map(col => `"${col.innerText.trim()}"`);
    csv.push(rowData.join(","));
  });

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv.join("\n")], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "stepup-investment.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPDF() {
  const element = document.getElementById('exportArea');
  const options = {
    filename: 'stepup-investment.pdf',
    margin: 0.3,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(options).from(element).save();
}

document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'downloadCSV') {
    downloadTableAsCSV();
  }
  if (e.target && e.target.id === 'downloadPDF') {
    downloadPDF();
  }
});
