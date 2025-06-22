const sliderContainer = document.querySelectorAll('.product-carousel');

function parseNavText(navText) {
    const [currentIndex, totalPages] = navText.textContent.split(" of ");
    return [Number(currentIndex), Number(totalPages)];
}

function prevPage(carousel, navText) {
    const [currentIndex, totalPages] = parseNavText(navText);

    const newIndex = currentIndex == 1 ? totalPages: currentIndex - 1
    carousel.style.transform = `translateX(-${newIndex * sliderContainer.offsetWidth}px)`;
    navText.textContent = `${newIndex} of ${totalPages}`
}

function nextPage(carousel, navText) {
    const [currentIndex, totalPages] = parseNavText(navText);

    const newIndex = (currentIndex + 1) % totalPages
    carousel.style.transform = `translateX(-${newIndex * sliderContainer.offsetWidth}px)`;
    navText.textContent = `${newIndex} of ${totalPages}`
}

const optimalCardWidth = 261;
sliderContainer.forEach((container) => {
    const carousel = container.querySelector("[name='carousel']")

    const gap = parseFloat(window.getComputedStyle(carousel).rowGap);
    const cardsPerPage = Math.floor(carousel.offsetWidth / optimalCardWidth);
    const totalGap = gap * (cardsPerPage - 1);
    const actualCardwidth = (carousel.offsetWidth - totalGap) / cardsPerPage

    const carouselCards = container.querySelectorAll("[name='carousel-card']")
    carouselCards.forEach((card) => {
        console.log(actualCardwidth);
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