(function ($) {
    "use strict";


    let monthlySalesArray = document.getElementById("monthlySalesArray").value;
    let monthlyOrdersCount = document.getElementById("monthlyOrdersCount").value;
    let monthlyUsersCount = document.getElementById("monthlyUsersCount").value;
    let monthlyCancelledOrders = document.getElementById("monthlyCancelledOrders").value;

    monthlyCancelledOrders = monthlyCancelledOrders.trim(); // Remove leading and trailing whitespace
    monthlyCancelledOrders = monthlyCancelledOrders.split(',')
    monthlyCancelledOrders = monthlyCancelledOrders.map((item)=> Number(item))
    monthlyCancelledOrders = Array(monthlyCancelledOrders);
    monthlyCancelledOrders = monthlyCancelledOrders[0]

    monthlySalesArray = monthlySalesArray.trim(); // Remove leading and trailing whitespace
    monthlySalesArray = monthlySalesArray.split(',')
    monthlySalesArray = monthlySalesArray.map((item)=> Number(item))
    monthlySalesArray = Array(monthlySalesArray);
    monthlySalesArray = monthlySalesArray[0]


    monthlyOrdersCount = monthlyOrdersCount.trim(); // Remove leading and trailing whitespace
    monthlyOrdersCount = monthlyOrdersCount.split(',')
    monthlyOrdersCount = monthlyOrdersCount.map((item)=> Number(item))
    monthlyOrdersCount = Array(monthlyOrdersCount);
    monthlyOrdersCount = monthlyOrdersCount[0]


    monthlyUsersCount = monthlyUsersCount.trim(); // Remove leading and trailing whitespace
    monthlyUsersCount = monthlyUsersCount.split(',')
    monthlyUsersCount = monthlyUsersCount.map((item)=> Number(item))
    monthlyUsersCount = Array(monthlyUsersCount);
    monthlyUsersCount = monthlyUsersCount[0]


    /*Sale statistics Chart*/
    if ($('#myChart').length) {
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            
            // The data for our dataset
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                        label: 'Sales',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(44, 120, 220, 0.2)',
                        borderColor: 'rgba(44, 120, 220)',
                        data: monthlySalesArray,
                    },
                    {
                        label: 'Orders',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(4, 209, 130, 0.2)',
                        borderColor: 'rgb(4, 209, 130)',
                        data:monthlyOrdersCount
                    },
                    {
                        label: 'Users',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(380, 200, 230, 0.2)',
                        borderColor: 'rgb(380, 200, 230)',
                        data: monthlyUsersCount
                    },{
                        label: 'Cancells',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(255, 165, 0, 0.2 )',
                        borderColor: 'rgb(255, 165, 0, 0.2)',
                        data: monthlyUsersCount
                    }

                ]
            },
            options: {
                plugins: {
                legend: {
                    labels: {
                    usePointStyle: true,
                    },
                }
                }
            }
        });
    } //End if

    /*Sale statistics Chart*/
    if ($('#myChart2').length) {
        var ctx = document.getElementById("myChart2");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
            labels: ["900", "1200", "1400", "1600"],
            datasets: [
                {
                    label: "US",
                    backgroundColor: "#5897fb",
                    barThickness:10,
                    data: [233,321,783,900]
                }, 
                {
                    label: "Europe",
                    backgroundColor: "#7bcf86",
                    barThickness:10,
                    data: [408,547,675,734]
                },
                {
                    label: "Asian",
                    backgroundColor: "#ff9076",
                    barThickness:10,
                    data: [208,447,575,634]
                },
                {
                    label: "Africa",
                    backgroundColor: "#d595e5",
                    barThickness:10,
                    data: [123,345,122,302]
                },
            ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                        usePointStyle: true,
                        },
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } //end if
    
})(jQuery);




