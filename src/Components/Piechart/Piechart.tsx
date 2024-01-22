import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface PieChartProps {
    data: number[];
    labels: string[];
}

const PieChart: React.FC<PieChartProps> = ({ data, labels }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const pieChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: ['#FFA500', '#FF8C00', '#FF7F50', '#FF6347','#FF4500'],
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                    },
                });

                // Optional: Clean up the chart when the component unmounts
                return () => {
                    pieChart.destroy();
                };
            }
        }
    }, [data, labels]);

    return (
        <canvas ref={chartRef} width="1100" height="900"></canvas>
    );
};

export default PieChart;