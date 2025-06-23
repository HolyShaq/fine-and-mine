const sliderContainers = document.querySelectorAll(".product-carousel");
const carousel = sliderContainers[0].querySelector("[name='carousel']"); // Used to get the general width of all carousels
const optimalCardWidth = 261; // Based on Figma, actualCardWidth can be a bit larger
const minGapSize = 4;
const maxGapSize = 32;
let gapSize;
let translateDistance;
let cardsPerPage;
let cardWidth;

function calculateSizes() {
  cardsPerPage = Math.floor(carousel.offsetWidth / optimalCardWidth); // global var

  // Calculate card width and gap
  const gapNum = cardsPerPage - 1;
  gapSize = (carousel.offsetWidth - cardsPerPage * optimalCardWidth) / gapNum;

  // If gap size is within the allowed range, use optimal card width
  if (gapSize > minGapSize && gapSize < maxGapSize) {
    cardWidth = optimalCardWidth;
  } else {
    // If gap size is outside the allowed range, adjust card width instead
    targetGapSize = gapSize > maxGapSize ? maxGapSize : minGapSize;
    cardWidth = (carousel.offsetWidth - targetGapSize * gapNum) / cardsPerPage;
    gapSize = targetGapSize;
  }

  translateDistance = carousel.offsetWidth + gapSize; // global var

  sliderContainers.forEach((container) => {
    // Resize cards to fill containers
    const carousel = container.querySelector("[name='carousel']");
    const carouselCards = carousel.querySelectorAll("[name='carousel-card']");
    carousel.style.transform = "translateX(0px)"; // Reset all carousel translations
    carousel.style.gap = `${gapSize}px`;
    carouselCards.forEach((card) => {
      card.style.width = `${cardWidth}px`;
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

  cardsNum = carousel.querySelectorAll("[name='carousel-card']").length;
  excessCards = cardsNum % cardsPerPage;
  emptyCards = cardsPerPage - excessCards;
  let emptyOffset = 0;
  if (currentIndex == 1) {
    emptyOffset = emptyCards * (cardWidth + gapSize)
  }

  const newIndex = currentIndex == 1 ? totalPages : currentIndex - 1;
  carousel.style.transform = `translateX(-${
    (newIndex - 1) * translateDistance - emptyOffset
  }px)`;
  navText.textContent = `${newIndex} of ${totalPages}`;
}

function nextPage(carousel, navText) {
  const [currentIndex, totalPages] = parseNavText(navText);
  
  cardsNum = carousel.querySelectorAll("[name='carousel-card']").length;
  excessCards = cardsNum % cardsPerPage;
  emptyCards = cardsPerPage - excessCards;
  let emptyOffset = 0;
  if (currentIndex + 1 == totalPages) {
    emptyOffset = emptyCards * (cardWidth + gapSize)
  }

  const newIndex = currentIndex == totalPages ? 1 : currentIndex + 1;
  carousel.style.transform = `translateX(-${
    (newIndex - 1) * translateDistance - emptyOffset
  }px)`;
  navText.textContent = `${newIndex} of ${totalPages}`;
}

// Add functionality to nav buttons
sliderContainers.forEach((container) => {
  const carousel = container.querySelector("[name='carousel']");

  const navText = container.querySelector("[name='nav-text']");
  const prev = container.querySelector("[name='prev']");
  const next = container.querySelector("[name='next']");

  prev.addEventListener("click", () => prevPage(carousel, navText, prev));
  next.addEventListener("click", () => nextPage(carousel, navText, next));
});

window.addEventListener("resize", calculateSizes);
