const containers = document.querySelectorAll(".shop-the-look");
const generalNormalViewer = containers[0].querySelector(".normal-viewer");
const generalCompactViewer = containers[0].querySelector(".compact-viewer");
let normalTransitionWidth;
let compactTransitionWidth;

function getTranslateX(el) {
  return new DOMMatrixReadOnly(getComputedStyle(el).transform).m41;
}

function computeSizes() {
  normalTransitionWidth = generalNormalViewer.offsetWidth;
  compactTransitionWidth = generalCompactViewer.offsetWidth;
}
computeSizes();

function prepForInfScrolling(viewer) {
  const slides = Array.from(viewer.children);

  const firstSlide = slides[0].cloneNode(true);
  const lastSlide = slides[slides.length - 1].cloneNode(true);

  viewer.appendChild(firstSlide);
  viewer.insertBefore(lastSlide, slides[0]);

  const animation = viewer.style.transition;
  viewer.style.transition = "none";
  viewer.style.transform = `translateX(-${normalTransitionWidth}px)`;
  viewer.style.transition = animation;
}

function navigateSlide(viewer, direction) {
  const slides = Array.from(viewer.children);

  // Calculate current index from translation
  const currentIndex = Math.floor(
    -getTranslateX(viewer) / normalTransitionWidth
  );
  console.log(currentIndex);

  const newIndex = currentIndex + direction;
  viewer.style.transform = `translateX(${
    -direction * normalTransitionWidth * newIndex
  }px)`;

//   const animation = viewer.style.transition;
//   viewer.style.transition = "none";
//   if (newIndex < 0) {
//     viewer.style.transform = `translateX(-${
//       normalTransitionWidth * slides.length
//     }px)`;
//   } else if (newIndex >= slides.length) {
//     viewer.style.transform = `translateX(-${normalTransitionWidth}px)`;
//   }
//   viewer.style.transition = animation;
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
});

window.addEventListener("resize", computeSizes);
