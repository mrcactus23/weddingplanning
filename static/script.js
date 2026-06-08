let userActuals = JSON.parse(localStorage.getItem('wedding_actuals')) || {};
let userStatus = JSON.parse(localStorage.getItem('wedding_status')) || {};

function initData() {
    document.querySelectorAll('.input-actual').forEach(input => {
        const id = input.getAttribute('data-id');
        if (userActuals[id] !== undefined) input.value = userActuals[id];
    });

    document.querySelectorAll('.btn-status').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (userStatus[id] === "done") {
            btn.className = "btn-status done";
            btn.innerText = "✓ Done";
        }
    });
    calculateTotals();
}

function calculateTotals() {
    let totalEst = 0, totalAct = 0, doneCount = 0;
    
    // 1. Calculate Estimated Total dynamically from the input boxes
    document.querySelectorAll('.input-estimate').forEach(input => {
        let val = parseFloat(input.value);
        if (!isNaN(val)) totalEst += val;
    });

    // 2. Calculate Actual Total Spendings
    const items = document.querySelectorAll('.input-actual');
    items.forEach(input => {
        const id = input.getAttribute('data-id');
        const val = parseFloat(input.value);
        if (!isNaN(val)) totalAct += val;
        if (userStatus[id] === "done") doneCount++;
    });

    document.getElementById('total-estimate').innerText = `RM ${totalEst.toLocaleString('en-MY', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    document.getElementById('total-actual').innerText = `RM ${totalAct.toLocaleString('en-MY', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    document.getElementById('completion-stats').innerText = `${doneCount} / ${items.length}`;
}

// Monitors live typed changes for Estimated inputs and pushes them securely to the server
document.body.addEventListener('input', function(e) {
    if (e.target.classList.contains('input-estimate')) {
        const id = e.target.getAttribute('data-id');
        const val = parseFloat(e.target.value) || 0;
        
        calculateTotals();

        // Pushes the modified entry to python database file without needing page refresh
        fetch('/update_est', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, est: val })
        });
    }

    if (e.target.classList.contains('input-actual')) {
        const id = e.target.getAttribute('data-id');
        if(e.target.value === "") delete userActuals[id];
        else userActuals[id] = parseFloat(e.target.value);
        localStorage.setItem('wedding_actuals', JSON.stringify(userActuals));
        calculateTotals();
    }
});

document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-status')) {
        const id = e.target.getAttribute('data-id');
        if (userStatus[id] === "done") {
            userStatus[id] = "pending";
            e.target.className = "btn-status pending";
            e.target.innerText = "○ Pending";
        } else {
            userStatus[id] = "done";
            e.target.className = "btn-status done";
            e.target.innerText = "✓ Done";
        }
        localStorage.setItem('wedding_status', JSON.stringify(userStatus));
        calculateTotals();
    }
});

window.addEventListener('DOMContentLoaded', initData);

document.getElementById('toggleFormBtn').addEventListener('click', function() {
    const formBox = document.getElementById('addFormBox');
    if (formBox.style.display === 'block') {
        formBox.style.display = 'none';
        this.innerText = '+ Add New Item';
    } else {
        formBox.style.display = 'block';
        this.innerText = '× Close Form';
    }
});
