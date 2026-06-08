// LocalStorage Memory Initialization
let userActuals = JSON.parse(localStorage.getItem('wedding_actuals')) || {};
let userStatus = JSON.parse(localStorage.getItem('wedding_status')) || {};

// Initialize data values into inputs and buttons on page load
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

// Live calculation tracking system for Header Summary Dashboard
function calculateTotals() {
    let totalEst = 0, totalAct = 0, doneCount = 0;
    
    // 1. Sum up Estimated Budgets
    document.querySelectorAll('.est-value').forEach(el => {
        let val = parseFloat(el.getAttribute('data-val'));
        if (!isNaN(val)) totalEst += val;
    });

    // 2. Sum up Actual Spendings
    const items = document.querySelectorAll('.input-actual');
    items.forEach(input => {
        const id = input.getAttribute('data-id');
        const val = parseFloat(input.value);
        if (!isNaN(val)) totalAct += val;
        if (userStatus[id] === "done") doneCount++;
    });

    // 3. Update UI text strings with local MYR formatting rules
    document.getElementById('total-estimate').innerText = `RM ${totalEst.toLocaleString('en-MY', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    document.getElementById('total-actual').innerText = `RM ${totalAct.toLocaleString('en-MY', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    document.getElementById('completion-stats').innerText = `${doneCount} / ${items.length}`;
}

// Event Listeners for Live Inputs & Toggles
document.body.addEventListener('input', function(e) {
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

// Fire up calculations immediately when window is loaded
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
