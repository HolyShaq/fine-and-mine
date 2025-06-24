const containers = document.querySelectorAll(".shop-the-look");
const generalNormalViewer = containers[0].querySelector(".normal-viewer");
const generalCompactViewer = containers[0].querySelector(".compact-viewer");

function getTranslateX(el) {
  return new DOMMatrixReadOnly(getComputedStyle(el).transform).m41;
}

function prepForInfScrolling(viewer) {
  const translationDistance = viewer.offsetWidth;
  const slides = Array.from(viewer.children);

  const firstSlide = slides[0].cloneNode(true);
  const lastSlide = slides[slides.length - 1].cloneNode(true);

  viewer.appendChild(firstSlide);
  viewer.insertBefore(lastSlide, slides[0]);

  viewer.style.transform = `translateX(-${translationDistance}px)`;
}

function resetTranslation(viewer) {
  const translationDistance = viewer.offsetWidth;
  viewer.style.transform = `translateX(-${translationDistance}px)`;
}

function navigateSlide(viewer, direction) {
  const transitionDistance = viewer.offsetWidth;

  // Calculate current index from translation
  const currentIndex = Math.floor(
    -getTranslateX(viewer) / transitionDistance // We negative here to get scalar value of translateX
  );

  let newIndex = currentIndex + direction;

  viewer.style.transform = `translateX(-${transitionDistance * newIndex}px)`;

  const slides = Array.from(viewer.children);
  
  // Remove any previous listeners
  viewer.removeEventListener("transitionend", viewer._onTransitionEnd); 
  
  // Define callback for after the transition ends
  viewer._onTransitionEnd = () => {
    // Remove the listener to prevent multiple calls
    viewer.removeEventListener("transitionend", viewer._onTransitionEnd);

    // Temporarily disable the animation
    viewer.classList.remove("tw:transition-all");
    viewer.classList.add("tw:transition-none");

    // Set the translation index to the correct value in between the fake elements
    if (newIndex === 0) {
      newIndex = slides.length - 2;
      viewer.style.transform = `translateX(-${
        transitionDistance * newIndex
      }px)`;
    } else if (newIndex === slides.length - 1) {
      newIndex = 1;
      viewer.style.transform = `translateX(-${transitionDistance}px)`;
    }

    // Re-enable the animation after
    setTimeout(() => {
      viewer.classList.remove("tw:transition-none");
      viewer.classList.add("tw:transition-all");
    }, 10);
  };

  // Add a new listener at the end for the next transition
  viewer.addEventListener("transitionend", viewer._onTransitionEnd);
}

containers.forEach((container) => {
  const normal_viewer = container.querySelector(".normal-viewer");
  const compact_viewer = container.querySelector(".compact-viewer");
  const prev = container.querySelector('[name="prev"]');
  const next = container.querySelector('[name="next"]');

  prepForInfScrolling(normal_viewer);
  prepForInfScrolling(compact_viewer);

  prev.addEventListener("click", () => navigateSlide(normal_viewer, -1));
  prev.addEventListener("click", () => navigateSlide(compact_viewer, -1));
  next.addEventListener("click", () => navigateSlide(normal_viewer, 1));
  next.addEventListener("click", () => navigateSlide(compact_viewer, 1));

  window.addEventListener("resize", () => {
    resetTranslation(compact_viewer);
  })
});

