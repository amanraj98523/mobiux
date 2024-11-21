const fs = require("fs");

const filePath = "./data.csv";
let data = fs.readFileSync(filePath, "utf-8");
data = data.split("\n");

function processData(data) {
  const salesData = data
    .slice(1)
    .map((line) => {
      const [date, sku, unitPrice, quantity, totalPrice] = line.split(",");
      return {
        date: new Date(date),
        sku: sku.trim(),
        unitPrice: parseFloat(unitPrice.trim()),
        quantity: parseInt(quantity.trim(), 10),
        totalPrice: parseFloat(totalPrice.trim()),
      };
    })
    .filter((entry) => entry.date);

  return salesData;
}

function totalSales(salesData) {
  return salesData.reduce((total, entry) => total + entry.totalPrice, 0);
}

function monthWiseSales(salesData) {
  const monthlySales = {};

  salesData.forEach((entry) => {
    const monthYear = `${entry.date.getFullYear()}-${String(
      entry.date.getMonth() + 1
    ).padStart(2, "0")}`;
    if (!monthlySales[monthYear]) {
      monthlySales[monthYear] = 0;
    }
    monthlySales[monthYear] += entry.totalPrice;
  });

  return monthlySales;
}

function mostPopularItem(salesData) {
  const monthlyPopularity = {};

  salesData.forEach((entry) => {
    const monthYear = `${entry.date.getFullYear()}-${String(
      entry.date.getMonth() + 1
    ).padStart(2, "0")}`;
    if (!monthlyPopularity[monthYear]) {
      monthlyPopularity[monthYear] = {};
    }

    if (!monthlyPopularity[monthYear][entry.sku]) {
      monthlyPopularity[monthYear][entry.sku] = 0;
    }
    monthlyPopularity[monthYear][entry.sku] += entry.quantity;
  });

  const mostPopularItems = {};
  Object.keys(monthlyPopularity).forEach((month) => {
    const items = monthlyPopularity[month];
    const mostPopular = Object.keys(items).reduce((a, b) =>
      items[a] > items[b] ? a : b
    );
    mostPopularItems[month] = mostPopular;
  });

  return mostPopularItems;
}

function itemsGeneratingMostRevenue(salesData) {
  const monthlyRevenue = {};

  salesData.forEach((entry) => {
    const monthYear = `${entry.date.getFullYear()}-${String(
      entry.date.getMonth() + 1
    ).padStart(2, "0")}`;
    if (!monthlyRevenue[monthYear]) {
      monthlyRevenue[monthYear] = {};
    }

    if (!monthlyRevenue[monthYear][entry.sku]) {
      monthlyRevenue[monthYear][entry.sku] = 0;
    }
    monthlyRevenue[monthYear][entry.sku] += entry.totalPrice;
  });

  const mostRevenueItems = {};
  Object.keys(monthlyRevenue).forEach((month) => {
    const items = monthlyRevenue[month];
    const mostRevenueItem = Object.keys(items).reduce((a, b) =>
      items[a] > items[b] ? a : b
    );
    mostRevenueItems[month] = mostRevenueItem;
  });

  return mostRevenueItems;
}

function mostPopularItemStats(salesData, mostPopularItems) {
  const monthlyStats = {};

  salesData.forEach((entry) => {
    const monthYear = `${entry.date.getFullYear()}-${String(
      entry.date.getMonth() + 1
    ).padStart(2, "0")}`;
    const popularItem = mostPopularItems[monthYear];

    if (entry.sku === popularItem) {
      if (!monthlyStats[monthYear]) {
        monthlyStats[monthYear] = {
          quantities: [],
        };
      }
      monthlyStats[monthYear].quantities.push(entry.quantity);
    }
  });

  const stats = {};
  Object.keys(monthlyStats).forEach((month) => {
    const quantities = monthlyStats[month].quantities;
    const min = Math.min(...quantities);
    const max = Math.max(...quantities);
    const avg =
      quantities.reduce((sum, qty) => sum + qty, 0) / quantities.length;
    stats[month] = { min, max, avg };
  });

  return stats;
}

const salesData = processData(data);

const total = totalSales(salesData);
console.log("Total Sales of the Store:", total);

const monthSales = monthWiseSales(salesData);
console.log("Month-wise Sales Totals:", monthSales);

const popularItems = mostPopularItem(salesData);
console.log("Most Popular Item in Each Month:", popularItems);

const revenueItems = itemsGeneratingMostRevenue(salesData);
console.log("Items Generating Most Revenue in Each Month:", revenueItems);

const popularItemStats = mostPopularItemStats(salesData, popularItems);
console.log(
  "Most Popular Item Stats (Min, Max, Avg Orders per Month):",
  popularItemStats
);
