const sliderContainer = document.querySelectorAll('.product-carousel');
const gap = parseFloat(window.getComputedStyle(sliderContainer[0].querySelector("[name='carousel']")).rowGap);

function parseNavText(navText) {
    const [currentIndex, totalPages] = navText.textContent.split(" of ");
    return [Number(currentIndex), Number(totalPages)];
}

function prevPage(carousel, navText) {
    const [currentIndex, totalPages] = parseNavText(navText);

    const offsetWidth = carousel.offsetWidth + gap
    const newIndex = currentIndex == 1 ? totalPages: currentIndex - 1
    console.log((newIndex - 1) * offsetWidth)
    carousel.style.transform = `translateX(-${(newIndex - 1) * offsetWidth}px)`;
    navText.textContent = `${newIndex} of ${totalPages}`
}

function nextPage(carousel, navText) {
    const [currentIndex, totalPages] = parseNavText(navText);

    const offsetWidth = carousel.offsetWidth + gap
    const newIndex = currentIndex == totalPages ? 1: currentIndex + 1
    carousel.style.transform = `translateX(-${(newIndex - 1) * offsetWidth}px)`;
    navText.textContent = `${newIndex} of ${totalPages}`
}

const optimalCardWidth = 261;
sliderContainer.forEach((container) => {
    const carousel = container.querySelector("[name='carousel']")

    const cardsPerPage = Math.floor(carousel.offsetWidth / optimalCardWidth);
    const totalGap = gap * (cardsPerPage - 1);
    const actualCardwidth = (carousel.offsetWidth - totalGap) / cardsPerPage

    const carouselCards = container.querySelectorAll("[name='carousel-card']")
    carouselCards.forEach((card) => {
        card.style.width = `${actualCardwidth}px`;
    })

    const totalPages = Math.ceil(carouselCards.length / cardsPerPage);

    const navText = container.querySelector("[name='nav-text']")
    navText.textContent = `1 of ${totalPages}`

    const prev = container.querySelector("[name='prev']")
    const next = container.querySelector("[name='next']")

    prev.addEventListener('click', () => prevPage(carousel, navText, prev))
    next.addEventListener('click', () => nextPage(carousel, navText, next))
})