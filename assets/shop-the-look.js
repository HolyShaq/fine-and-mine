const containers = document.querySelectorAll(".shop-the-look");
const generalNormalViewer = containers[0].querySelector(".normal-viewer");
const generalCompactViewer = containers[0].querySelector(".compact-viewer");
let normalTransitionWidth;
let compactTransitionWidth;

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

function prevSlide(viewer, direction) {}

containers.forEach((container) => {
  const normal_viewer = container.querySelector(".normal-viewer");
  const compact_viewer = container.querySelector(".compact-viewer");
  const prev = container.querySelector('[name="prev"]');
  const next = container.querySelector('[name="next"]');

  prepForInfScrolling(normal_viewer);
  prepForInfScrolling(compact_viewer);
});

window.addEventListener("resize", computeSizes);
