import * as basicLightbox from 'basiclightbox'
import 'basiclightbox/dist/basicLightbox.min.css';

let instance = null

const formEl = document.querySelector(".search-form")
const listEl = document.querySelector(".gallery")
const elementsEl = document.querySelector(".elements")

const URL = "https://pixabay.com/api/"
const API_KEY = "55978703-bb79675f7d797a559cd8adf58"

let search = ""
let limit = 12
let page = 1



async function getImg(search, page) {
    const res = await fetch(
        `${URL}?key=${API_KEY}&q=${search}&page=${page}&per_page=${limit}`
    );
    const data = await res.json();
    return data
}

formEl.addEventListener("submit", async (e) => {
    e.preventDefault()
    search = e.currentTarget.elements.query.value

    const res = await getImg(search, page)

    render(res.hits)
})

function render(arr) {
    const item = arr.map(({webformatURL, largeImageURL, likes, views, comments, downloads, tags}) => {
        return `
        <li class="photo-card">
  <img src="${webformatURL}" alt="${tags}" data-src="${largeImageURL}" />
  <div class="stats">
    <p class="stats-item">
      <i class="material-icons">thumb_up</i>
      ${likes}
    </p>
    <p class="stats-item">
      <i class="material-icons">visibility</i>
      ${views}
    </p>
    <p class="stats-item">
      <i class="material-icons">comment</i>
  ${comments}
    </p>
    <p class="stats-item">
      <i class="material-icons">cloud_download</i>
      ${downloads}
    </p>
  </div>
</li>`
    }).join("")
    listEl.insertAdjacentHTML("beforeend", item)
}

const observer = new IntersectionObserver((entry) => {
    entry.forEach(async (e) => {
        if (e.isIntersecting && search !== "") {
            page += 1
            const res = await getImg(search, page)
            render(res.hits)
        }
    })
     
}, {
    rootMargin: "200px"
})

observer.observe(elementsEl)

listEl.addEventListener("click", (e) => {
    if (e.target.nodeName !== "IMG") {
        return
    }   

    const largeImg = e.target.dataset.src

    instance = basicLightbox.create(`
        <div class="modal">
            <img src="${largeImg}" alt="#"/>
        </div>
    `)

    instance.show()

    if (instance) {
        window.addEventListener("keydown", closeModal)
    }

})


if (!instance) {
    window.removeEventListener("keydown", closeModal)
}

function closeModal(e) {

    if (e.key === "Escape" && instance) {
        instance.close()
        instance = null
    }

}