// Addon prices
const addonPrices = {
    'addon-flea': { name: 'Flea & Tick', price: 20 },
    'addon-deshed': { name: 'De-shedding', price: 20 },
    'addon-ear': { name: 'Ear Cleaning', price: 20 },
    'addon-nail': { name: 'Nail Trimming', price: 20 },
    'addon-teeth': { name: 'Teeth Brushing', price: 20 },
    'addon-massage': { name: 'Massage', price: 20 }
};

function getBasePrice(age)
{
    if (age <= 3) return 30;
    if (age <= 7) return 30 + ((age - 3) / 4) * 10;  // 30-40 across puppy years
    if (age <= 10) return 40 + ((age - 7) / 3) * 10; // 40-50 across adult years
    return Math.min(50 + ((age - 10) / 5) * 10, 60); // 50-60 capped at 60
}

function updateSummary()
{
    const breed = document.getElementById('breed').value || '—';
    document.getElementById('summary-service').textContent = breed;

    const datetime = document.getElementById('datetime').value;
    if (datetime)
    {
        const d = new Date(datetime);
        document.getElementById('summary-appointment').textContent =
            d.toLocaleString('en-NZ', { dateStyle: 'medium', timeStyle: 'short' });
    }
    else
    {
        document.getElementById('summary-appointment').textContent = '—';
    }

    // Age-based base price
    const age = parseFloat(document.getElementById('age').value);
    const basePrice = isNaN(age) ? 0 : getBasePrice(age);

    // Addons
    let addonTotal = 0;
    const selected = [];
    for (const [id, addon] of Object.entries(addonPrices))
    {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked)
        {
            addonTotal += addon.price;
            selected.push(addon.name);
        }
    }

    // Medical needs surcharge
    const medical = document.getElementById('medical');
    const medicalCost = (medical && medical.checked) ? 30 : 0;
    const total = basePrice + addonTotal + medicalCost;

    document.getElementById('summary-cost').textContent =
        `$${total.toFixed(2)} ${selected.length ? '' : '(No add-ons)'}`;
}

// Watch all relevant inputs
['breed', 'datetime', 'age', 'medical'].forEach(id =>
    document.getElementById(id).addEventListener('input', updateSummary));

Object.keys(addonPrices).forEach(id =>
    document.getElementById(id).addEventListener('change', updateSummary));

updateSummary();