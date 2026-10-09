const gallery = document.querySelector(".gallery-grid");
const cards = [...gallery.querySelectorAll(".photo-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const visibleCount = document.querySelector("#visible-count");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxTitle = document.querySelector(".lightbox-title");
const lightboxLocation = document.querySelector(".lightbox-location");
const lightboxCounter = document.querySelector(".lightbox-counter");
const closeButton = document.querySelector(".lightbox-close");
const previousButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");

let visibleCards = cards;
let activeIndex = 0;
let lastFocusedCard = null;

function updateCount() {
  visibleCount.textContent = String(visibleCards.length).padStart(2, "0");
}

function setFilter(filter) {
  visibleCards = cards.filter((card) => {
    const isVisible = filter === "all" || card.dataset.category === filter;
    card.hidden = !isVisible;
    return isVisible;
  });
  updateCount();
}

function showPhoto(index) {
  activeIndex = (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[activeIndex];
  const image = card.querySelector("img");

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxTitle.textContent = card.dataset.title;
  lightboxLocation.textContent = card.dataset.location;
  lightboxCounter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(visibleCards.length).padStart(2, "0")}`;
}

function openLightbox(card) {
  lastFocusedCard = card;
  showPhoto(visibleCards.indexOf(card));
  lightbox.hidden = false;
  document.body.classList.add("is-locked");
  closeButton.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("is-locked");
  lightboxImage.src = "";
  lastFocusedCard?.focus();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    setFilter(button.dataset.filter);
  });
});

cards.forEach((card) => {
  card.addEventListener("click", () => openLightbox(card));
});

closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => showPhoto(activeIndex - 1));
nextButton.addEventListener("click", () => showPhoto(activeIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
  if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
});

updateCount();
