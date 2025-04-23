const SHEET_ID = "1oOPYVuRWhzaeGNhhD6zGJ681_eJRz0FLjOs2MAkb9M8";
const PRODUCT_SHEET = "0"; // gid for product sheet

// Lấy ID từ URL
const getProductIdFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

// Fetch dữ liệu từ Google Sheets
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

// Render slideshow
const renderSlideshow = (product) => {
  const slideshow = document.getElementById("slideshow");
  slideshow.innerHTML = "";

  let slides = "";

  // Thêm video nếu có
  if (product["video"]) {
    slides += `
      <div class="slide">
        <video controls>
          <source src="${product["video"]}" type="video/mp4">
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      </div>
    `;
  }

  // Thêm hình ảnh
  for (let i = 1; i <= 5; i++) {
    if (product[`hình ảnh ${i}`]) {
      slides += `
        <div class="slide">
          <img src="${product[`hình ảnh ${i}`]}" alt="Ảnh sản phẩm ${i}">
        </div>
      `;
    }
  }

  // Nếu không có ảnh hoặc video
  if (!slides) {
    slides = `<p>Không có hình ảnh hoặc video cho sản phẩm này.</p>`;
  }

  // Thêm slideshow vào DOM
  slideshow.innerHTML = `
    <div class="slides-container">
      ${slides}
    </div>
    <button class="prev" onclick="changeSlide(-1)">&#10094;</button>
    <button class="next" onclick="changeSlide(1)">&#10095;</button>
  `;

  // Hiển thị slide đầu tiên
  let currentSlide = 0;
  const slidesElements = document.querySelectorAll(".slide");
  const showSlide = (index) => {
    slidesElements.forEach((slide, i) => {
      slide.style.display = i === index ? "block" : "none";
    });
  };
  showSlide(currentSlide);

  // Thay đổi slide
  window.changeSlide = (direction) => {
    currentSlide = (currentSlide + direction + slidesElements.length) % slidesElements.length;
    showSlide(currentSlide);
  };
  showSlide(currentSlide);
};

// Render thông tin chính
const renderProductSummary = (product) => {
  document.getElementById("productName").textContent = product["tên"];
  document.getElementById("productBrand").textContent = `Hãng: ${product["hãng"]}`;
  document.getElementById("productPrice").textContent = `Giá bán: ${parseInt(product["giá bán"]).toLocaleString()}₫`;
  document.getElementById("productDescription").textContent = product["Thông tin mô tả sản phẩm"];

  const productSummary = document.querySelector(".product-summary");

  // Tạo container cho ô nhập số lượng và nút
  const cartContainer = document.createElement("div");
  cartContainer.className = "cart-container";

  // Input để nhập số lượng
  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.min = 1;
  quantityInput.max = product["số lượng"];
  quantityInput.value = 1;
  quantityInput.className = "quantity-input";

  // Nút "Thêm vào giỏ hàng"
  const addToCartButton = document.createElement("button");
  addToCartButton.textContent = "Thêm vào giỏ hàng";
  addToCartButton.className = "btn-add-to-cart";

  addToCartButton.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    const quantityInStock = parseInt(product["số lượng"]);

    if (quantity > quantityInStock) {
      alert(`Số lượng trong kho không đủ. Chỉ còn ${quantityInStock} sản phẩm.`);
    } else if (quantity <= 0) {
      alert("Số lượng phải lớn hơn 0.");
    } else {
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      // Giảm số lượng trong kho (chỉ để minh họa, thực tế cần cập nhật trên server)
      product["số lượng"] = quantityInStock - quantity;
    }
  });

  // Thêm input và nút vào container
  cartContainer.appendChild(quantityInput);
  cartContainer.appendChild(addToCartButton);

  // Thêm container vào productSummary
  productSummary.appendChild(cartContainer);
};

// Render popup thông tin chi tiết
const renderProductDetail = (product) => {
  const productDetail = document.getElementById("productDetail");
  productDetail.innerHTML = `
    <h1>${product["tên"]}</h1>
    <p><strong>Hãng:</strong> ${product["hãng"]}</p>
    <p><strong>Giá bán:</strong> ${parseInt(product["giá bán"]).toLocaleString()}₫</p>
    <p><strong>Chip:</strong> ${product["chip"]}</p>
    <p><strong>Bộ nhớ:</strong> ${product["bộ nhớ"]}</p>
    <p><strong>RAM:</strong> ${product["ram"]}</p>
    <p><strong>Kích thước màn hình:</strong> ${product["kích thước màn hình"]}</p>
    <p><strong>Pin:</strong> ${product["pin"]}</p>
    <p><strong>Màu sắc:</strong> ${product["màu sắc"]}</p>
    <p><strong>Tần số quét:</strong> ${product["tần số quét"]}</p>
    <p><strong>NFC:</strong> ${product["NFC"]}</p>
    <p><strong>Camera trước:</strong> ${product["cam trước"]}</p>
    <p><strong>Camera sau:</strong> ${product["cam sau"]}</p>
    <p><strong>Độ phân giải màn hình:</strong> ${product["Độ phân giải màn hình"]}</p>
    <p><strong>Hệ điều hành:</strong> ${product["hệ điều hành"]}</p>
    <p><strong>Thẻ SIM:</strong> ${product["thẻ sim"]}</p>
  `;
};

// Hiển thị popup
const showPopup = () => {
  document.getElementById("productPopup").style.display = "block";
};

// Đóng popup
const closePopup = () => {
  document.getElementById("productPopup").style.display = "none";
};

// Khởi chạy
(async () => {
  const productId = getProductIdFromURL();
  const products = await fetchSheetData(PRODUCT_SHEET);
  const product = products.find(p => p["id"] === productId);

  if (product) {
    renderSlideshow(product);
    renderProductSummary(product);
    renderProductDetail(product);
  } else {
    document.getElementById("slideshow").innerHTML = "<p>Sản phẩm không tồn tại.</p>";
  }

  document.getElementById("showDetails").addEventListener("click", showPopup);
  document.getElementById("closePopup").addEventListener("click", closePopup);
})();

fetch("components/header.html")
.then(response => response.text())
.then(data => {
  document.querySelector("header").outerHTML = data;
});

// Import footer
fetch("components/footer.html")
.then(response => response.text())
.then(data => {
  document.querySelector("footer").outerHTML = data;
});