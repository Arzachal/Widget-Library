var EEArray = [],
    sliderItemEls = document.querySelectorAll(".rd-slider-item");
EEHandler(EEArray);

function EEHandler(arr) {
    for (var i = 0; i < sliderItemEls.length; i++) {
        var itemData = sliderItemEls[i].dataset;
        sliderItemEls[i].setAttribute("data-item-id", i);
        var link = itemData.link || "",
            omzn = link.substring(link.indexOf("OM.zn=") + 6, link.indexOf("&OM.zpc=")),
            title = decodeURIComponent(omzn.substring(0, omzn.lastIndexOf("-w")));
        arr.push({
            id: itemData.id || null,
            name: itemData.name || null,
            price: itemData.price ? parseFloat(itemData.price).toFixed(2) : null,
            brand: itemData.brand || null,
            position: i,
            list: "Visilabs" + title || null
        });
        sliderItemEls[].addEventListener("click", EEClick);
    }
    dataLayer.push({
        event: "visilabs_recommendation_impression",
        ecommerce: {
            currencyCode: "TRY",
            impressions: arr
        }
    });
}
function EEClick(e) {
    var itemData = e.target.dataset;
    var link = itemData.link || "",
        omzn = link.substring(link.indexOf("OM.zn=") + 6, link.indexOf("&OM.zpc=")),
        title = decodeURIComponent(omzn.substring(0, omzn.lastIndexOf("-w")));
    dataLayer.push({
        event: "visilabs_recommendation_click",
        ecommerce: {
            click: {
                actionField: {
                    list: "Visilabs " + title
                },
                products: [{
                    id: itemData.id,
                    name: itemData.name,
                    brand: itemData.brand,
                    position: itemData.itemId,
                    price: itemData.price
                }]
            }
        }
    });
}