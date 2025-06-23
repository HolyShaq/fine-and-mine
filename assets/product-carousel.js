const sliderContainers = document.querySelectorAll(".product-carousel");
const carousel = sliderContainers[0].querySelector("[name='carousel']");
const gap = parseFloat(window.getComputedStyle(carousel).rowGap);
const optimalCardWidth = 261; // Based on Figma, actualCardWidth can be a bit larger
let translateDistance;
let cardsPerPage;

function calculateSizes() {
  // Update 'global' variables
  translateDistance = carousel.offsetWidth + gap;
  cardsPerPage = Math.floor(carousel.offsetWidth / optimalCardWidth);
  console.log(carousel.offsetWidth)

  const totalGap = gap * (cardsPerPage - 1);
  const actualCardwidth = (carousel.offsetWidth - totalGap) / cardsPerPage;
  sliderContainers.forEach((container) => {
    // Resize cards to fill containers
    const carousel = container.querySelector("[name='carousel']");
    const carouselCards = carousel.querySelectorAll("[name='carousel-card']");
    carousel.style.transform = "translateX(0px)"; // Reset all carousel translations
    carouselCards.forEach((card) => {
      card.style.width = `${actualCardwidth}px`;
    });

    // Update nav text to match total pages
    const totalPages = Math.ceil(carouselCards.length / cardsPerPage);
    const navText = container.querySelector("[name='nav-text']");
    navText.textContent = `1 of ${totalPages}`;
  });
}
calculateSizes();

function parseNavText(navText) {
  const [currentIndex, totalPages] = navText.textContent.split(" of ");
  return [Number(currentIndex), Number(totalPages)];
}

function prevPage(carousel, navText) {
  const [currentIndex, totalPages] = parseNavText(navText);

  const newIndex = currentIndex == 1 ? totalPages : currentIndex - 1;
  carousel.style.transform = `translateX(-${
    (newIndex - 1) * translateDistance
  }px)`;
  navText.textContent = `${newIndex} of ${totalPages}`;
}

function nextPage(carousel, navText) {
  const [currentIndex, totalPages] = parseNavText(navText);

  const newIndex = currentIndex == totalPages ? 1 : currentIndex + 1;
  carousel.style.transform = `translateX(-${
    (newIndex - 1) * translateDistance
  }px)`;
  navText.textContent = `${newIndex} of ${totalPages}`;
}

// Add functionality to nav buttons
sliderContainers.forEach((container) => {
  const carousel = container.querySelector("[name='carousel']");
  const carouselCards = carousel.querySelectorAll("[name='carousel-card']");

  const navText = container.querySelector("[name='nav-text']");
  const prev = container.querySelector("[name='prev']");
  const next = container.querySelector("[name='next']");

  prev.addEventListener("click", () => prevPage(carousel, navText, prev));
  next.addEventListener("click", () => nextPage(carousel, navText, next));
});

window.addEventListener("resize", calculateSizes);
