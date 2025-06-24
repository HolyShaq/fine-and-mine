const sliderContainers = document.querySelectorAll(".product-carousel");
if (sliderContainers.length == 0) return;

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

function navigate(carousel, navText, direction) {
  const [currentIndex, totalPages] = parseNavText(navText);

  let newIndex = currentIndex + direction;
  if (direction == 1) {
    newIndex = currentIndex == totalPages ? 1 : newIndex;
  } else {
    newIndex = currentIndex == 1 ? totalPages : newIndex;
  }

  // Calculate empty space in last page
  cardsNum = carousel.querySelectorAll("[name='carousel-card']").length;
  excessCards = cardsNum % cardsPerPage;
  emptyCards = cardsPerPage - excessCards;
  let emptySpaceOffset = 0;
  if (newIndex == totalPages) {
    emptySpaceOffset = emptyCards * (cardWidth + gapSize)
  }

  carousel.style.transform = `translateX(-${
    (newIndex - 1) * translateDistance - emptySpaceOffset
  }px)`;
  navText.textContent = `${newIndex} of ${totalPages}`;
}

// Add functionality to nav buttons
sliderContainers.forEach((container) => {
  const carousel = container.querySelector("[name='carousel']");

  const navText = container.querySelector("[name='nav-text']");
  const prev = container.querySelector("[name='prev']");
  const next = container.querySelector("[name='next']");

  prev.addEventListener("click", () => navigate(carousel, navText, -1));
  next.addEventListener("click", () => navigate(carousel, navText, 1));
});

window.addEventListener("resize", calculateSizes);
