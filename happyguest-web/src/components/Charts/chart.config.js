export const chartColors = {
    default: {
        primary: "#00D1B2",
        info: "#209CEE",
        danger: "#FF3860",
    },
};

const setChartData = (n, data) => {
    const finalData = [];

    for (let i = 0; i < n; i++) {
        data.map((item) => {
            if (item.month === i + 1) {
                finalData[i] = item.total;
            }
        });
        if (!finalData[i]) {
            finalData[i] = 0;
        }
    }

    return finalData;
};

const datasetObject = (color, points, data) => {
    return {
        fill: false,
        borderColor: chartColors.default[color],
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: chartColors.default[color],
        pointBorderColor: "rgba(255,255,255,0)",
        pointHoverBackgroundColor: chartColors.default[color],
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: setChartData(points, data),
        tension: 0.5,
        cubicInterpolationMode: "default",
    };
};

export const chartData = (points, data) => {
    const labels = [];

    for (let i = 1; i <= points; i++) {
        labels.push(`${i}`);
    }

    return {
        labels,
        datasets: [
            datasetObject("primary", points, data.clientsByMonth),
            datasetObject("info", points, data.codesByMonth),
            datasetObject("danger", points, data.complaintsByMonth),
        ],
    };
};
