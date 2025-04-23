// File: /js/products.js

const SHEET_ID = "1oOPYVuRWhzaeGNhhD6zGJ681_eJRz0FLjOs2MAkb9M8";
const PRODUCT_SHEET = "0"; // gid for product sheet
const BRAND_SHEET = "1703176556"; // gid for brand sheet

const fetchSheetData = async (gid) => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}`;
  const res = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substring(47).slice(0, -2));
  const cols = json.table.cols.map(col => col.label);
  const rows = json.table.rows.map(row => {
    const obj = {};
    row.c.forEach((cell, i) => {
      obj[cols[i]] = cell ? cell.v : "";
    });
    return obj;
  });
  return rows;
};

const renderProducts = (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    const img = product["hình ảnh 1"] || "https://via.placeholder.com/150";

    card.innerHTML = `
      <img src="${img}" alt="${product["tên"]}">
      <h3>${product["tên"]}</h3>
      <p>Hãng: ${product["hãng"]}</p>
      <p>Giá bán: ${parseInt(product["giá bán"]).toLocaleString()}₫</p>
    `;
    productList.appendChild(card);
  });
};

const populateBrands = (brands) => {
  const select = document.getElementById("brandFilter");
  select.innerHTML = `<option value="">-- Tất cả hãng --</option>`;
  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand["tên hãng"];
    option.textContent = brand["tên hãng"];
    select.appendChild(option);
  });
};

let allProducts = [];

const applyFilters = () => {
  const search = document.getElementById("search").value.toLowerCase();
  const brand = document.getElementById("brandFilter").value;
  const sort = document.getElementById("sortPrice").value;

  let filtered = allProducts.filter(p =>
    p["tên"].toLowerCase().includes(search) &&
    (brand === "" || p["hãng"] === brand)
  );

  if (sort === "asc") {
    filtered.sort((a, b) => parseInt(a["giá bán"]) - parseInt(b["giá bán"]));
  } else if (sort === "desc") {
    filtered.sort((a, b) => parseInt(b["giá bán"]) - parseInt(a["giá bán"]));
  }

  renderProducts(filtered);
};

(async () => {
  allProducts = await fetchSheetData(PRODUCT_SHEET);
  const brands = await fetchSheetData(BRAND_SHEET);

  populateBrands(brands);
  renderProducts(allProducts);

  document.getElementById("search").addEventListener("input", applyFilters);
  document.getElementById("brandFilter").addEventListener("change", applyFilters);
  document.getElementById("sortPrice").addEventListener("change", applyFilters);
})();

console.log("Products loaded successfully.");