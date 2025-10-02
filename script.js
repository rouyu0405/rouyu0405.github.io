console.log("script.js loaded");

const imageSwap = {
        "img/Translink.png": "img/Translink-alt.jpg",
        "img/documentary.png": "img/documentary-alt.jpg",
        "img/BC.png": "img/BC-alt.png"
};

document.querySelectorAll('.project-img img').forEach(img => {
    img.addEventListener('click', () => {
        const originalSrc = img.getAttribute('src');
        const altSrc = imageSwap[originalSrc];

        if (altSrc) {
            img.setAttribute('src', altSrc);
        } else {
            const swappedSrc = Object.keys(imageSwap).find(key => imageSwap[key] === originalSrc);
            if (swappedSrc) {
                    img.setAttribute('src', swappedSrc);
            }
        }
    });
});
