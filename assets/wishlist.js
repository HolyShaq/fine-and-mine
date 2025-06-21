function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function toggleWishlist(productObject, button) {
  let wishlist = getWishlist();
  const index = wishlist.findIndex(item => item.handle === productObject.handle);

  const span = button.querySelector('span');
  if (index > -1) {
    wishlist.splice(index, 1); // remove
    span.innerHTML = window.themeAssets.wishlistEmpty
  } else {
    wishlist.push(productObject); // add
    span.innerHTML = window.themeAssets.wishlistFilled
  }

  saveWishlist(wishlist);
}

document.querySelectorAll('.wishlist_toggle').forEach((button) => {
  const productObject = {
    brand: button.dataset.brand,
    handle: button.dataset.handle,
  }

  // Set initial icon
  console.log("tite");
  const wishlist = getWishlist();
  const span = button.querySelector('span');
  if (wishlist.some(item => item.handle === productObject.handle)) {
    span.innerHTML = window.themeAssets.wishlistFilled;
  } else {
    span.innerHTML = window.themeAssets.wishlistEmpty;
  }

  button.addEventListener('click', (evt) => {
    console.log('Wishlist button clicked', productObject);
    evt.preventDefault();
    toggleWishlist(productObject, button);
  });
})