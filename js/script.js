let chartInstance = null;
const chartTypeInput = document.getElementById("chartType");
const themeInput = document.getElementById("theme");
const ctx = document.getElementById("myChart").getContext("2d");
const addRowBtn = document.getElementById("addRowBtn");
const deleteRowBtn = document.getElementById("deleteRowBtn");
const dataTable = document
  .getElementById("dataTable")
  .getElementsByTagName("tbody")[0];
const downloadBtn = document.getElementById("downloadBtn");

// Register the plugin globally
Chart.register(ChartDataLabels);

showChart("bar", ctx);
chartTypeInput.addEventListener("change", () => {
  const newCtx = document.getElementById("myChart").getContext("2d");
  let chartType = chartTypeInput.value;
  showChart(chartType, newCtx);
});

themeInput.addEventListener("change", () => {
  updateChartColors();
});

addRowBtn.addEventListener("click", () => {
  const newRow = dataTable.insertRow();
  const newLabelCell = newRow.insertCell(0);
  const newValueCell = newRow.insertCell(1);

  newLabelCell.contentEditable = "true";
  newValueCell.contentEditable = "true";

  newLabelCell.addEventListener("input", updateChartData);
  newValueCell.addEventListener("input", updateChartData);
  updateChartData();
});

// Add delete row functionality
deleteRowBtn.addEventListener("click", () => {
  const rowCount = dataTable.rows.length;
  if (rowCount > 0) {
    dataTable.deleteRow(rowCount - 1);
    updateChartData();
  } else {
    alert("No rows to delete!");
  }
});

// Replace the existing downloadBtn event listener with a simpler, more direct approach
downloadBtn.addEventListener("click", () => {
  // Get the original canvas
  const originalCanvas = document.getElementById("myChart");

  // Create a temporary canvas for the high-resolution image
  const tempCanvas = document.createElement("canvas");
  const scale = 2; // Increase resolution by 2x
  tempCanvas.width = originalCanvas.width * scale;
  tempCanvas.height = originalCanvas.height * scale;

  // Get the 2D context of the temporary canvas
  const tempCtx = tempCanvas.getContext("2d");
  
  // Scale the drawing
  tempCtx.scale(scale, scale);

  // Draw the original canvas onto the temporary one, preserving exact appearance
  tempCtx.drawImage(
    originalCanvas,
    0,
    0,
    originalCanvas.width,
    originalCanvas.height
  );

  // Create and trigger the download
  const link = document.createElement("a");
  link.download = "chart_image.png";
  link.href = tempCanvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

function showChart(chartType, ctx) {
  if (chartInstance) {
    chartInstance.destroy();
  }
  const chartData = getChartData();
  const animationOptions =
    chartType === "line"
      ? {
          tension: {
            duration: 1000,
            easing: "linear",
            from: 1,
            to: 0,
            loop: true,
          },
        }
      : {
          duration: 1000,
          easing: "easeInOutBounce",
        };

  // Configure display options based on chart type
  const isPieTypeChart = ["pie", "doughnut", "polarArea"].includes(chartType);

  chartInstance = new Chart(ctx, {
    type: chartType,
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          display: !isPieTypeChart, // Hide scales for pie-type charts
          ticks: {
            font: {
              size: 16, // Larger font for Y axis
            },
          },
        },
        x: {
          display: !isPieTypeChart, // Hide scales for pie-type charts
          ticks: {
            font: {
              size: 16, // Larger font for X axis
            },
          },
        },
      },
      animations: animationOptions,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 16, // Larger font for legend
            },
          },
        },
        datalabels: {
          color: "#333333", // Dark grey color for all chart labels
          font: {
            weight: "bold",
            size: 18, // Significantly increased font size for better export quality
          },
          formatter: function (value, context) {
            if (isPieTypeChart) {
              // Calculate percentage for pie charts
              const dataset = context.chart.data.datasets[context.datasetIndex];
              const total = dataset.data.reduce((acc, data) => acc + data, 0);
              const percentage = Math.round((value / total) * 100);
              return (
                context.chart.data.labels[context.dataIndex] +
                ": " +
                percentage +
                "%"
              );
            } else {
              return value;
            }
          },
          display: function (context) {
            return true; // Always display labels
          },
          // Adjust alignment for better visibility
          align: isPieTypeChart ? "center" : "end",
          anchor: isPieTypeChart ? "center" : "end",
          // For pie charts, position the labels on the slices
          offset: isPieTypeChart ? 0 : 4,
          // Enhanced text shadow for better contrast against various backgrounds
          textShadow: "0px 0px 3px rgba(255, 255, 255, 0.8)",
          // Add a subtle stroke for better visibility
          textStrokeColor: "#ffffff",
          textStrokeWidth: 1,
          padding: 6, // Increased padding around labels
        },
        tooltip: {
          enabled: true,
          titleFont: {
            size: 16, // Larger font for tooltip title
          },
          bodyFont: {
            size: 14, // Larger font for tooltip body
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

function getChartData() {
  const labels = [];
  const data = [];
  const rows = dataTable.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    if (cells.length > 1) {
      labels.push(cells[0].innerText);
      const value = parseInt(cells[1].innerText) || 0;
      if (
        chartTypeInput.value === "bubble" ||
        chartTypeInput.value === "scatter"
      ) {
        data.push({ x: i, y: value, r: value });
      } else {
        data.push(value);
      }
    }
  }
  return {
    labels: labels,
    datasets: [
      {
        label: "#chart ",
        data: data,
        borderWidth: 1,
      },
    ],
  };
}

function updateChartData() {
  const chartData = getChartData();
  if (chartInstance) {
    chartInstance.destroy();
  }
  const animationOptions =
    chartTypeInput.value === "line"
      ? {
          tension: {
            duration: 1000,
            easing: "linear",
            from: 1,
            to: 0,
            loop: true,
          },
        }
      : {
          duration: 1000,
          easing: "easeInOutBounce",
        };

  const chartType = chartTypeInput.value;
  const isPieTypeChart = ["pie", "doughnut", "polarArea"].includes(chartType);

  chartInstance = new Chart(ctx, {
    type: chartType,
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          display: !isPieTypeChart,
          ticks: {
            font: {
              size: 16, // Larger font for Y axis
            },
          },
        },
        x: {
          display: !isPieTypeChart,
          ticks: {
            font: {
              size: 16, // Larger font for X axis
            },
          },
        },
      },
      animations: animationOptions,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 16, // Larger font for legend
            },
          },
        },
        datalabels: {
          color: "#333333", // Dark grey color for all chart labels
          font: {
            weight: "bold",
            size: 18, // Significantly increased font size for better export quality
          },
          formatter: function (value, context) {
            if (isPieTypeChart) {
              // Calculate percentage for pie charts
              const dataset = context.chart.data.datasets[context.datasetIndex];
              const total = dataset.data.reduce((acc, data) => acc + data, 0);
              const percentage = Math.round((value / total) * 100);
              return (
                context.chart.data.labels[context.dataIndex] +
                ": " +
                percentage +
                "%"
              );
            } else {
              return value;
            }
          },
          display: true,
          align: isPieTypeChart ? "center" : "end",
          anchor: isPieTypeChart ? "center" : "end",
          offset: isPieTypeChart ? 0 : 4,
          // Enhanced text shadow for better contrast against various backgrounds
          textShadow: "0px 0px 3px rgba(255, 255, 255, 0.8)",
          // Add a subtle stroke for better visibility
          textStrokeColor: "#ffffff",
          textStrokeWidth: 1,
          padding: 6, // Increased padding around labels
        },
        tooltip: {
          enabled: true,
          titleFont: {
            size: 16, // Larger font for tooltip title
          },
          bodyFont: {
            size: 14, // Larger font for tooltip body
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
  updateChartColors(); // Ensure colors are updated as well
}

function updateChartColors() {
  const theme = themeInput.value;
  let colors, textColor, borderColor;
  if (theme === "theme1") {
    colors = ["#9ad0f5", "#9ad0f5", "#9ad0f5", "#9ad0f5", "#9ad0f5"];
    textColor = "#000000";
    borderColor = "#9ad0f5";
  } else if (theme === "theme2") {
    colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
    textColor = "#000000";
    borderColor = "transparent";
  } else if (theme === "theme3") {
    colors = ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"];
    textColor = "#FFFFFF";
    borderColor = "transparent";
  } else if (theme === "theme4") {
    colors = ["#cdb4db", "#ffc8dd", "#ffafcc", "#bde0fe", "#a2d2ff"];
    textColor = "#000000";
    borderColor = "transparent";
  } else if (theme === "theme5") {
    colors = ["#9b5de5", "#f15bb5", "#fee440", "#00bbf9", "#00f5d4"];
    textColor = "#FFFFFF"; // Example text color for theme5
    borderColor = "transparent";
  } else if (theme === "theme6") {
    colors = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"];
    textColor = "#000000"; // Example text color for theme6
    borderColor = "transparent";
  } else if (theme === "theme7") {
    colors = [
      "#10002b",
      "#240046",
      "#3c096c",
      "#5a189a",
      "#7b2cbf",
      "#9d4edd",
      "#c77dff",
      "#e0aaff",
    ];
    textColor = "#FFFFFF"; // Example text color for theme7
    borderColor = "transparent";
  } else if (theme === "theme8") {
    colors = ["#d8a47f", "#ef8354", "#ee4b6a", "#df3b57", "#0f7173"];
    textColor = "#000000"; // Example text color for theme8
    borderColor = "transparent";
  } else if (theme === "theme9") {
    colors = ["#ffac81", "#ff928b", "#fec3a6", "#efe9ae", "#cdeac0"];
    textColor = "#FFFFFF"; // Example text color for theme9
    borderColor = "transparent";
  } else if (theme === "theme10") {
    colors = ["#fdc5f5", "#f7aef8", "#b388eb", "#8093f1", "#72ddf7"];
    textColor = "#000000"; // Example text color for theme10
    borderColor = "transparent";
  }

  // Set CSS root variables
  const root = document.documentElement;
  colors.forEach((color, index) => {
    root.style.setProperty(`--theme-color-${index + 1}`, color);
  });

  chartInstance.data.datasets[0].backgroundColor = colors;
  chartInstance.data.datasets[0].borderColor = borderColor;
  chartInstance.update();
  updateRowTextColors(textColor);
  updateRowBackgroundColors(colors);
}

function updateRowTextColors(color) {
  const rows = dataTable.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      cells[j].style.color = color;
    }
  }
}

function updateRowBackgroundColors(colors) {
  const rows = dataTable.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const color = colors[i % colors.length];
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      cells[j].style.backgroundColor = color;
    }
  }
}

// Add event listeners to existing table cells
const existingRows = dataTable.getElementsByTagName("tr");
for (let i = 0; i < existingRows.length; i++) {
  const cells = existingRows[i].getElementsByTagName("td");
  for (let j = 0; j < cells.length; j++) {
    cells[j].contentEditable = "true";
    cells[j].addEventListener("input", updateChartData);
  }
}
