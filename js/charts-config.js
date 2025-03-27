// Chart.js Implementation
document.addEventListener('DOMContentLoaded', () => {
    const impactChart = new Chart(document.getElementById('impactChart'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Carbon Footprint',
                data: [2.8, 2.6, 2.5, 2.3, 2.1, 2.0],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    const activityChart = new Chart(document.getElementById('activityChart'), {
        type: 'doughnut',
        data: {
            labels: ['Recycling', 'Energy Saving', 'Water Conservation', 'Transportation'],
            datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: [
                    '#22c55e',
                    '#16a34a',
                    '#15803d',
                    '#166534'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 20
                    }
                }
            },
            cutout: '70%'
        }
    });
});