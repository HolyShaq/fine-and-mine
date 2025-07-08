function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function toggleWishlist(productObject, button) {
  let wishlist = getWishlist();
  const index = wishlist.findIndex(
    (item) => item.handle === productObject.handle
  );

  const span = button.querySelector("span");
  const text = button.nextElementSibling;
  if (index > -1) {
    wishlist.splice(index, 1); // remove
    span.innerHTML = window.themeAssets.wishlistEmpty;
    if (text) {
      text.innerHTML = "Add to wishlist";
    }
  } else {
    wishlist.push(productObject); // add
    span.innerHTML = window.themeAssets.wishlistFilled;
    if (text) {
      text.innerHTML = "Remove from wishlist";
    }
  }

  saveWishlist(wishlist);
}

function removeProduct(handle) {
  // This is to be used inside the wishlist page
  wishlist = getWishlist();
  const index = wishlist.findIndex((item) => item.handle === handle);
  wishlist.splice(index, 1);
  saveWishlist(wishlist);
  renderWishlist();
}

async function fetchProduct(handle, brand) {
  const response = await fetch(
    `${window.location.origin}/products/${handle}.js`
  ).then(async (response) => {
    let result = await response.json();
    result.brand = brand;
    return result;
  });

  return response;
}

function productCard(product) {
  const featuredImageUrl = `https:${product.featured_image}`;
  const featuredImageWidth = 96;
  const featuredImageHeight = 96;

  const secondaryImageExists = product.images[1] != null;
  let secondaryImageHTML = "";
  if (secondaryImageExists) {
    const secondaryImage = product.images[1];
    const secondaryImageUrl = `https:${secondaryImage}`;
    const secondaryImageWidth = 96;
    const secondaryImageHeight = 96;
    secondaryImageHTML = `
        <img
          class="tw:absolute tw:top-0 tw:left-0 tw:w-96 tw:aspect-square tw:object-cover tw:opacity-0 tw:group-hover/img:opacity-100 tw:duration-300 tw:transition-opacity"
          src="${secondaryImageUrl}"
          width="${secondaryImageWidth}"
          height="${secondaryImageHeight}"
          loading="lazy"
        >
    `;
  }
  saleHTML = product.compare_at_price
    ? `
        <div class="tw:absolute tw:top-3 tw:right-3 tw:px-6 tw:py-1 tw:bg-red-700 tw:text-2xl tw:text-white tw:rounded-full">
          Sale
        </div>
  `
    : "";

  const hoverClass = secondaryImageExists
    ? "tw:opacity-100 tw:group-hover/img:opacity-0 tw:duration-300 tw:transition-opacity"
    : "";
  const productImage = `
    <div class="tw:relative tw:group/img">
      <img
        class="tw:w-96 tw:aspect-square tw:object-cover ${hoverClass}"
        src="${featuredImageUrl}"
        width="${featuredImageWidth}"
        height="${featuredImageHeight}"
      >
      ${secondaryImageHTML}
        <button
          data-handle="${product.handle}"
          data-brand="${product.brand}"
          class="wishlist_toggle tw:absolute tw:bottom-3 tw:left-3 tw:cursor-pointer"
          onclick="removeProduct(\'${product.handle}\')"
        >
          <span class="tw:m-auto tw:flex  tw:size-12 tw:items-center tw:justify-center tw:p-2 tw:rounded-full">
            ${window.themeAssets.wishlistFilled}
          </span>
        </button>
        ${saleHTML}
    </div>
  `;

  const formattedPrice = `₱${(product.price / 100).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedSalePrice = product.compare_at_price
    ? `₱${(product.compare_at_price / 100).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "";
  const productDetails = `
    <div class="tw:flex tw:flex-col tw:gap-2">
      <h3 class="tw:font-semibold tw:text-base">${product.brand.toUpperCase()}</h3>
      <h2 class="tw:line-clamp-2 tw:text-2xl tw:min-h-[4rem] tw:group-hover/div:underline tw:transition-all tw:duration-300">
        ${product.title}
      </h2>
      <div class="tw:flex tw:gap-3 tw:items-center">
        <h2 class="tw:text-2xl tw:text-[#9E9E9E] tw:line-through">${formattedSalePrice}</h2>
        <h2 class="tw:font-bold tw:text-2xl">${formattedPrice}</h2>
      </div>
    </div>
  `;
  const productInfo = `
  <div class="tw:flex tw:flex-col tw:gap-6">
    ${productImage}
    ${productDetails}
  </div>
  `;

  const loadingSpinner = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  class="loading__spinner hidden"
  width="40"
  height="40"
  viewBox="0 0 40 40"
  fill="none"
>
  <circle cx="20" cy="20" r="18" stroke="white" stroke-width="4" opacity="0"/>
  <path d="M38 20a18 18 0 1 1-18-18" stroke="white" stroke-width="4" stroke-linecap="round">
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 20 20"
      to="360 20 20"
      dur="1s"
      repeatCount="indefinite"/>
  </path>
</svg>
  `;
  const atcButton = `
<product-form>
    <form
      method="post"
      action="/cart/add"
      accept-charset="UTF-8"
      class="form"
      enctype="multipart/form-data"
      novalidate="novalidate"
      data-type="add-to-cart-form"
    >
    <input type="hidden" name="id" value="${product.variants[0].id}">
    <input type="hidden" name="product-id" value="${product.id}">
    <input type="hidden" name="form_type" value="product">
    <input type="hidden" name="utf8" value="✓">
    <button
      class="tw:font-bold tw:w-full tw:cursor-pointer tw:flex tw:justify-center tw:min-h-20 tw:items-center tw:py-3 tw:rounded-lg tw:transition-all tw:duration-100 tw:ease-in-out tw:hover:shadow-lg tw:hover:scale-102 ${
        product.available
          ? ""
          : "tw:bg-transparent tw:text-[#C2CFD6] tw:border-2 tw:border-[#C2CFD6] tw:pointer-events-none"
      }"
      style="background-color: #426c8a; color: #f9f9f9;"
      type="submit"
      name="add"
      ${product.available ? "" : "disabled"}
    >
      <span>
        ${product.available ? "Add to Cart" : "Sold Out"}
      </span>
        ${loadingSpinner}
    </button>
  </form>
</product-form>
  `;
  const mainContainer = `
<div
  class="tw:group/div tw:flex tw:flex-col tw:w-[261px] tw:p-4 tw:gap-6 tw:hover:scale-101 tw:overflow-hidden tw:transition-all tw:duration-300 tw:ease-in-out"
  style="background-color: #f9f9f9;"
>

  ${productInfo}

  <div class="tw:flex tw:flex-col tw:gap-2">
    <a
      href="${product.url}"
      class="tw:font-bold tw:w-full tw:bg-transparent tw:flex tw:justify-center tw:min-h-20 tw:items-center tw:text-black tw:py-3 tw:border-2 tw:border-black tw:rounded-xl tw:transition-all tw:duration-100 tw:ease-in-out tw:hover:shadow-lg tw:hover:scale-102"
    >
      View Details
    </a>
    ${atcButton}
  </div>
</div>
  `;

  console.log(mainContainer);
  return mainContainer;
}

async function renderWishlist() {
  const wishlist = getWishlist();
  const wishlistEmpty = document.querySelector("#wishlist-empty");
  const wishlistItems = document.querySelector("#wishlist-items");

  if (!wishlistEmpty || !wishlistItems) return;

  if (wishlist.length === 0) {
    wishlistEmpty.classList.remove("hidden");
    wishlistItems.classList.add("hidden");
  } else {
    wishlistEmpty.classList.add("hidden");

    const fetches = wishlist.map((item) =>
      fetchProduct(item.handle, item.brand)
    );
    const products = await Promise.all(fetches);
    console.log(products);

    wishlistItems.innerHTML = ""; // Clear previous items
    products.forEach((product) => {
      const div = document.createElement("div");
      div.innerHTML = productCard(product);
      wishlistItems.appendChild(div);
    });
    wishlistItems.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
});

document.querySelectorAll(".wishlist_toggle").forEach((button) => {
  const productObject = {
    brand: button.dataset.brand,
    handle: button.dataset.handle,
  };

  // Set initial icon
  const wishlist = getWishlist();
  const span = button.querySelector("span");
  const text = button.nextElementSibling;
  if (wishlist.some((item) => item.handle === productObject.handle)) {
    span.innerHTML = window.themeAssets.wishlistFilled;
    if (text && text.classList.contains("wishlist_text")) {
      text.innerHTML = "Remove from wishlist";
    }
  } else {
    span.innerHTML = window.themeAssets.wishlistEmpty;
    if (text && text.classList.contains("wishlist_text")) {
      text.innerHTML = "Add to wishlist";
    }
  }

  button.addEventListener("click", (evt) => {
    console.log("Wishlist button clicked", productObject);
    evt.preventDefault();
    toggleWishlist(productObject, button);
  });
});
