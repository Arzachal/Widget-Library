function vlWidgetHandler(widgetId, settings = { arrows: {}, dots: {} }) {
    if (widgetId) {
        var itemsViewed = settings.itemsToView || 4,
            axis = settings.axis || "X";
        var itemSize = axis == "X" ? settings.width || 300 : settings.height || 300,
            itemSize2 = axis == "X" ? settings.height || 300 : settings.width || 300,
            autoScroll = settings.autoScroll || false,
            autoScrollTimer = settings.autoScrollTimer || 5,
            enhancedEcommerce = settings.enhancedEcommerce || false;
        var arrows = settings.arrows == undefined ? true : settings.arrows;
        arrowSize = settings.arrows == undefined || settings.arrows.size == undefined ? 20 : settings.arrows.size,
            arrowBorderSize = settings.arrows == undefined || settings.arrows.borderSize == undefined ? 2 : settings.arrows.borderSize,
            arrowColor = settings.arrows == undefined || settings.arrows.color == undefined ? "#333" : settings.arrows.color,
            arrowsHover = settings.arrows == undefined || settings.arrows.showOnHover == undefined ? false : settings.arrows.showOnHover,
            mobileArrows = settings.arrows == undefined || settings.arrows.mobile == undefined ? true : settings.arrows.mobile,
            dots = settings.dots == undefined ? false : settings.dots,
            dotsHover = settings.dots == undefined || settings.dots.showOnHover == undefined ? false : settings.dots.showOnHover,
            dotsNumbers = settings.dots == undefined || settings.dots.numbers == undefined ? false : settings.dots.numbers;
    } else {
        return console.error("Widget is not found. id of widget is not defined as a function parameter");
    }
    function browserChecker() {
        var browser = null;
        var isIE = null;
        ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) ? browser = "opera" : null;
        typeof InstallTrigger !== 'undefined' ? browser = "Firefox" : null;
        (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))) ? browser = "safari" : null;
        (/*@cc_on!@*/false || !!document.documentMode) ? (browser = "IE", isIE = true) : null;
        !isIE && !!window.StyleMedia ? browser = "Edge" : null;
        !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime) ? browser = "Chrome" : null;
        return browser;
    }

    var firstItemsViewed = itemsViewed,
        widgetEl = document.getElementById(widgetId);
    if (widgetEl == null) {
        console.warn("Widget is not found. No element exist with id=" + widgetId);
        return;
    }
    var wrapperEl = widgetEl.querySelector(".vl-slider-wrapper"),
        wrapperTransform = wrapperEl.style.transform,
        arrowPrev,
        arrowNext,
        currentDimension1 = parseFloat(wrapperTransform.substring(wrapperTransform.indexOf("(") + 1, wrapperTransform.indexOf("px"))),
        dimension1 = axis == "X" ? "width" : "height",
        dimension2 = axis == "X" ? "height" : "width",
        side1 = axis == "Y" ? "top" : "left",
        side2 = axis == "Y" ? "bottom" : "right",
        sliderEl = widgetEl.querySelector(".vl-slider"),
        sliderElMargin = sliderEl.offsetLeft,
        sliderItemEls = widgetEl.querySelectorAll(".vl-slider-item"),
        itemsTotal = sliderItemEls.length,
        midItemEl = widgetEl.querySelectorAll(".vl-slider-item")[Math.round(itemsTotal / 2) + Math.floor(itemsViewed / 2)],
        midItemId = midItemEl ? midItemEl.dataset.itemId : null,
        slideThreshold = itemSize / 3,
        isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false,
        // isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform),
        isIOS = true,
        autoScrolling = 0;
    responsiveViewHandler();
    var infinite = itemsTotal >= itemsViewed * 2 ? true : false,
        containerSize = parseFloat(window.getComputedStyle(widgetEl.parentNode.parentNode)[dimension1]),
        dotLiEls,
        activeDotId;
    browserChecker() === "Firefox" ? sliderEl.scrollTo(0, 0) : null;
    if (arrowsHover == undefined) { var arrowsHover = false }
    if (dotsHover == undefined) { var dotsHover = false }
    var looping = false,
        sliding = false,
        firstDimension1,
        startDimension1,
        startDimension2,
        startT,
        draggingDimension1,
        isDragging = false,
        endDimension1,
        endDimension2,
        endT,
        draggingDeltaDimension1,
        draggingDeltaDimension1Abs,
        draggingDeltaDimension1Sign,
        deltaDimension1,
        deltaDimension1Abs,
        deltaDimension1Sign,
        deltaDimension2,
        deltaDimension2Abs,
        deltaT;
    function arrowGenerator() {
        arrowPrev = document.createElement("div");
        arrowPrev.className = "vl-arrow-btn vl-prev";
        widgetEl.insertBefore(arrowPrev, sliderEl);
        arrowNext = document.createElement("div");
        arrowNext.className = "vl-arrow-btn vl-next";
        widgetEl.appendChild(arrowNext);
        arrowPrev.addEventListener("click", () => { slideHandler("prev", itemsViewed) });
        arrowNext.addEventListener("click", () => { slideHandler("next", itemsViewed) });
        if (!isIOS) {
            arrowPrev.addEventListener("click", () => { slideHandler("prev", itemsViewed) });
            arrowNext.addEventListener("click", () => { slideHandler("next", itemsViewed) });
        } else {
            arrowPrev.onclick = function () {
                if (axis == "X") {
                    var scrollPosition = sliderEl.scrollLeft;
                    if (scrollPosition >= itemSize) {
                        sliderAnimationStart(1);
                        wrapperEl.style.transform = "translate" + axis + "(" + (itemSize) + "px)";
                        setTimeout(function () { sliderAnimationStop(); wrapperEl.style.transform = "translate" + axis + "(0)"; sliderEl.scrollTo(scrollPosition - itemSize, 0); }, 200);
                    }
                } else {
                    var scrollPosition = sliderEl.scrollTop;
                    if (scrollPosition >= itemSize) {
                        sliderAnimationStart(1);
                        wrapperEl.style.transform = "translate" + axis + "(" + (itemSize) + "px)";
                        setTimeout(function () { sliderAnimationStop(); wrapperEl.style.transform = "translate" + axis + "(0)"; sliderEl.scrollTo(0, scrollPosition - itemSize); }, 200);
                    }
                }
            };
            arrowNext.onclick = function () {
                if (axis == "X") {
                    var scrollPosition = sliderEl.scrollLeft;
                    if (scrollPosition <= itemSize * (itemsTotal - 2)) {
                        sliderAnimationStart(1);
                        wrapperEl.style.transform = "translate" + axis + "(" + (-itemSize) + "px)";
                        setTimeout(function () { sliderAnimationStop(); wrapperEl.style.transform = "translate" + axis + "(0)"; sliderEl.scrollTo(scrollPosition + itemSize, 0); }, 200);
                    }
                } else {
                    if (scrollPosition <= itemSize * (itemsTotal - 2)) {
                        var scrollPosition = sliderEl.scrollTop;
                        sliderAnimationStart(1);
                        wrapperEl.style.transform = "translate" + axis + "(" + (-itemSize) + "px)";
                        setTimeout(function () { sliderAnimationStop(); wrapperEl.style.transform = "translate" + axis + "(0)"; sliderEl.scrollTo(0, scrollPosition + itemSize); }, 200);
                    }
                }
            }
        }
    }
    function dotGenerator() {
        if (itemsViewed > 1) {
            var currentDots = widgetEl.querySelector(".vl-slider-dots");
            if (currentDots != undefined) {
                currentDots.parentNode.removeChild(currentDots);
            }
            var dotsUl = document.createElement("ul");
            dotsUl.className = "vl-slider-dots";
            sliderEl.appendChild(dotsUl);
            for (var i = 0; i < Math.ceil(itemsTotal / itemsViewed); i++) {
                var dotLi = document.createElement("li");
                dotLi.className = "vl-slider-dot";
                dotLi.innerHTML = (i + 1);
                dotLi.style.color = dotsNumbers ? "white" : "transparent";
                dotLi.addEventListener("click", () => { slideHandler("dot", itemsViewed) });
                dotsUl.appendChild(dotLi);
            }
            dotLiEls = widgetEl.querySelectorAll(".vl-slider-dot");
            dotsTotal = dotLiEls.length;
            activeDotId = 1;
            dotLiEls[activeDotId - 1].classList.add("active");
        } else {
            if (currentDots != undefined) {
                currentDots.parentNode.removeChild(currentDots);
            }
        }
    }
    function styleGenerator() {
        var styleString =
            "#" + widgetId + "{position: relative}" +
            "#" + widgetId + ">.vl-slider{scroll-behavior: smooth; position: relative; " + dimension1 + ": " + ((itemSize * itemsViewed) + (itemsViewed == 1 ? 20 : 0)) + "px; " + dimension2 + ":" + (itemSize2 + (dots ? 50 : 15)) + "px; margin: 0 auto; scroll-snap-type: x mandatory;-webkit-overflow-scrolling: touch;scroll-snap-type: mandatory;-ms-scroll-snap-type: mandatory;scroll-snap-points-x: repeat(100%);-ms-scroll-snap-points-x: repeat(100%);overflow-x: scroll; }" +
            "#" + widgetId + ">.vl-slider.mobile{max-width: 100vw;overflow-"+ (axis === "X" ? "x" : "y")+": " + (isIOS ? "scroll" : "hidden") + ";}" +
            "#" + widgetId + ">.vl-slider::-webkit-scrollbar { display: none;}" +
            "#" + widgetId + ">.vl-slider>.vl-slider-wrapper{" + dimension1 + ": " + (infinite ? itemsTotal * 2 : itemsTotal) * itemSize + "px;}" +
            "#" + widgetId + ">.vl-slider>.vl-slider-wrapper>.vl-slider-item{overflow:hidden;" + dimension1 + ":" + itemSize + "px; " + dimension2 + ":" + itemSize2 + "px; display:inline-block; float:left; scroll-snap-align: center;}";
        if (arrows) {
            var arrowStyle;
            arrowStyle = "#" + widgetId + ">.vl-arrow-btn{border-bottom: " + arrowBorderSize + "px solid " + arrowColor + "; border-right: " + arrowBorderSize + "px solid " + arrowColor + "; position: absolute; color: #0f0f0f; z-index: 1000;" + (axis == "X" ? "bottom:" + (itemSize2 / 2 + (dots ? 25 : 7.5)) + "px;height:" + arrowSize + "px; width: " + arrowSize + "px;" : "left: calc(50% - 40px);") + " cursor:pointer;}" +
                "#" + widgetId + ">.vl-prev{" + side1 + ":15px; transform: rotate(135deg)}" + "#" + widgetId + ">.vl-next{" + side2 + ":15px;transform: rotate(-45deg)}";
            if (arrowsHover) {
                arrowStyle = "#" + widgetId + ">.vl-arrow-btn {opacity: 0;border-bottom: " + arrowBorderSize + "px solid " + arrowColor + "; border-right: " + arrowBorderSize + "px solid " + arrowColor + "; position: absolute; color: #0f0f0f; z-index: 1000;" + (axis == "X" ? "bottom:" + (itemSize2 / 2 + (dots ? 25 : 7.5)) + "px;height:" + arrowSize + "px; width: " + arrowSize + "px;" : "left: calc(50% - 40px);") + " cursor:pointer;}" +
                    "#" + widgetId + ":hover > .vl-arrow-btn { opacity: 1; transition: all 0.2s ease-in-out;}" +
                    "#" + widgetId + ">.vl-prev{" + side1 + ": 15px; transform: rotate(135deg)}" + "#" + widgetId + ">.vl-next{" + side2 + ":15px; transform: rotate(-45deg)}";
            }
            styleString += arrowStyle;
        }
        if (dots) {
            var dotStyle;
            dotStyle = "#" + widgetId + ">.vl-slider>.vl-slider-dots {position: absolute; list-style: none; margin: 0; padding: 0; bottom: 15px; text-align: center; " + dimension1 + ": 100%;}" +
                "#" + widgetId + ">.vl-slider>.vl-slider-dots>.vl-slider-dot {cursor:pointer;display: inline-block; color: white; background: black; border-radius: 50%; " + dimension1 + ": 20px; " + dimension2 + ": 20px; text-align: center; line-height: 20px; font-size: 18px; margin: 0 5px;}" +
                "#" + widgetId + ">.vl-slider>.vl-slider-dots>.vl-slider-dot:hover {background: darkgray}" +
                "#" + widgetId + ">.vl-slider>.vl-slider-dots>.vl-slider-dot.active {background: lightgray; color: black;}";
            if (dotsHover) {
                dotStyle = "#" + widgetId + ":hover > .vl-slider>.vl-slider-dots {opacity: 1; transition: all 0.2s ease-in-out;}" +
                    "#" + widgetId + ">.vl-slider>.vl-slider-dots {transition: all 0.2s ease-in-out; opacity: 0; position: absolute; list-style: none; margin: 0; padding: 0; bottom: 0; text-align: center; " + dimension1 + ": 100%;}" +
                    "#" + widgetId + ">.vl-slider>.vl-slider-dots>.vl-slider-dot {cursor:pointer;display: inline-block; color: white; background: black; border-radius: 50%; " + dimension1 + ": 20px; " + dimension2 + ": 20px; text-align: center; line-height: 20px; font-size: 18px; margin: 0 5px;}" +
                    "#" + widgetId + ">.vl-slider>.vl-slider-dots>.vl-slider-dot:hover {background: lightgray; color: black;}" +
                    "#" + widgetId + ">.vl-slider>.vl-slider-dots>.vl-slider-dot.active {background: darkgrey; }";
            }
            styleString += dotStyle;
        }
        if (document.head.querySelector("#" + widgetId + "-style")) {
            document.head.querySelector("#" + widgetId + "-style").innerHTML = styleString;
        } else {
            var styleEl = document.createElement("style");
            styleEl.id = widgetId + "-style";
            styleEl.innerHTML = styleString;
            document.head.appendChild(styleEl);
        }
        if (arrows && mobileArrows && sliderElMargin > arrowPrev.clientWidth) {
            arrowPrev.style.side1 = sliderElMargin - arrowPrev.clientWidth + "px";
            arrowNext.style.side2 = sliderElMargin - arrowNext.clientWidth + "px";
        }
        if (isMobile) {
            if(!sliderEl.classList.contains("mobile")){
                sliderEl.classList.toggle("mobile");
            }
        }
        widgetEl.parentNode.style = "width: 100%; display: inline-block;";
    }
    function responsiveViewHandler() {
        containerSize = parseFloat(window.getComputedStyle(widgetEl.parentNode.parentNode)[dimension1]);
        itemsViewed = Math.floor(containerSize / itemSize) >= firstItemsViewed ? firstItemsViewed : Math.floor(containerSize / itemSize);
    }
    function EEHandler(arr) {
        for (var i = 0; i < sliderItemEls.length; i++) {
            var itemData = sliderItemEls[i].dataset;
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
        }
        dataLayer.push({
            event: "visilabs_recommendation_impression",
            ecommerce: {
                currencyCode: "TRY",
                impressions: arr
            }
        });
    }
    function EEClick(el) {
        var itemData = el.dataset;
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
    function idHandler() {
        for (var i = 0; i < itemsTotal; i++) {
            var item = sliderItemEls[i];
            item.dataset.itemId = (i + 1);
        }
    }
    function cloneHandler() {
        for (var i = 0; i < itemsTotal; i++) {
            var item = sliderItemEls[i];
            var clone = item.cloneNode(true);
            wrapperEl.appendChild(clone);
        }
        for (var i = 0; i < (itemsTotal / 2); i++) {
            var lastSliderItemEl = widgetEl.querySelectorAll(".vl-slider-item")[(itemsTotal * 2) - 1];
            wrapperEl.insertBefore(lastSliderItemEl, widgetEl.querySelectorAll(".vl-slider-item")[0]);
        }
    }
    function linkPreventer() {
        var linkEls = widgetEl.querySelectorAll(".vl-slider-item");
        for (var i = 0; i < linkEls.length; i++) {
            linkEls[i].addEventListener("click", (e) => { e.preventDefault(); });
            if (!isIOS) { linkEls[i].addEventListener("touchend", (e) => { e.preventDefault(); }); }
        }
    }
    function transformDimension1() {
        wrapperEl.style.transform = "translate" + axis + "(" + currentDimension1 + "px)";
    }
    function sliderAnimationStart(duration) {
        wrapperEl.style.transition = "all " + (duration * 0.2) + "s ease-in-out";
    }
    function sliderAnimationStop() {
        wrapperEl.style.transition = "all 0s ease-in-out";
    }
    function midItemCalculator() {
        var midNumber = Math.round(itemsTotal / 2) + Math.ceil(itemsViewed / 2);
        if (midNumber > widgetEl.querySelectorAll(".vl-slider-item").length - 1) {
            midNumber = widgetEl.querySelectorAll(".vl-slider-item").length - 1;
        }
        midItemEl = widgetEl.querySelectorAll(".vl-slider-item")[midNumber];
        midItemId = midItemEl.dataset.itemId;
        return midItemId;
    }
    function activeDotChanger() {
        if (dots && itemsViewed > 1) {
            activeDotId = Math.ceil(midItemCalculator() / itemsViewed);
            var activeDotEl = widgetEl.querySelector(".vl-slider-dot.active");
            var activeDotElId = activeDotEl.innerHTML;
            if (activeDotId != activeDotElId) {
                activeDotEl.classList.remove("active");
                dotLiEls[activeDotId - 1].classList.add("active");
            }
        } else return;
    }
    function loopHandler(s, n) {
        looping = true;
        setTimeout(() => {
            if (s < 0) {
                for (var i = 0; i < n; i++) {
                    var currentELs = widgetEl.querySelectorAll(".vl-slider-item");
                    var lastItem = currentELs[currentELs.length - 1];
                    wrapperEl.insertBefore(lastItem, currentELs[0]);
                    sliderAnimationStop();
                    sliding = false;
                    currentDimension1 -= itemSize;
                }
            }
            if (s > 0) {
                for (var i = 0; i < n; i++) {
                    var currentELs = widgetEl.querySelectorAll(".vl-slider-item");
                    var firstItem = currentELs[0];
                    wrapperEl.appendChild(firstItem);
                    sliderAnimationStop();
                    sliding = false;
                    currentDimension1 += itemSize;
                }
            }
            transformDimension1();
            looping = false;
        }, 200 * n);
    }
    function slideHandler(type, item) {
        if (!sliding) {
            sliding = true;
            sliderAnimationStart(item);
            var s;
            if (type === "prev") {
                s = -1;
            }
            if (type === "next") {
                s = 1;
            }
            if (type === "dot") {
                var dotId = event.target.innerHTML;
                var deltaDot = dotId - activeDotId;
                var deltaDotAbs = Math.abs(dotId - activeDotId);
                s = deltaDot / deltaDotAbs;
                midItemRemainder = (midItemCalculator() % itemsViewed);
                if (midItemRemainder === 0) { midItemRemainder = itemsViewed }
                if ((Math.ceil(itemsViewed / 2) - midItemRemainder) === 0) {
                    item *= deltaDotAbs;
                } else {
                    item *= deltaDotAbs;
                    item += (Math.ceil(itemsViewed / 2) - midItemRemainder) * s;
                }
                activeDotId = dotId;
            }
            currentDimension1 -= item * itemSize * s;
            if (itemsViewed > 1 && !infinite) {
                currentDimension1 = currentDimension1 >= 0 ? 0 : currentDimension1;
                currentDimension1 = currentDimension1 <= -((itemsTotal - itemsViewed + 1) * itemSize) ? -((itemsTotal - itemsViewed) * itemSize) : currentDimension1;
            }
            transformDimension1();
            if (infinite) { loopHandler(s, item) };
            setTimeout(activeDotChanger, item * 200);
            sliding = false;
        }
    }

    function isInViewport(elem) {
        var bounding = elem.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight - 25 || document.documentElement.clientHeight - 25) &&
            bounding.right <= (window.innerWidth - 25 || document.documentElement.clientWidth - 25)
        );
    };
    function autoScroller() {
        if (currentDimension1 <= 0 && autoScrolling === 0) {
            slideHandler("next", itemsViewed);
        }
    }
    function draggingStart(e) {
        if (!isDragging && !looping) {
            startT = performance.now();
            if (e.type === "touchstart") {
                document.documentElement.style.overflow = 'hidden';
                e.preventDefault();
                startDimension1 = axis == "X" ? e.touches[0].pageX : e.touches[0].pageY;
                startDimension2 = axis == "X" ? e.touches[0].pageY : e.touches[0].pageX;
            }
            if (e.type === "mousedown" && e.button === 0) {
                e.preventDefault();
                startDimension1 = axis == "X" ? e.clientX : e.clientY;
                startDimension2 = axis == "X" ? e.clientY : e.clientX;
            }
            isDragging = true;
            firstDimension1 = currentDimension1;
        }
    }
    function dragging(e) {
        if (isDragging) {
            draggingT = performance.now();
            if (e.type === "touchmove") {
                e.preventDefault();
                draggingDimension1 = axis == "X" ? e.touches[0].pageX : e.touches[0].pageY;
                draggingDimension2 = axis == "X" ? e.touches[0].pageY : e.touches[0].pageX;
            }
            if (e.type === "mousemove" && e.button === 0) {
                draggingDimension1 = axis == "X" ? e.clientX : e.clientY;
                e.preventDefault();
            }
            draggingDeltaDimension1 = draggingDimension1 - startDimension1;
            draggingDeltaDimension1Abs = Math.abs(draggingDeltaDimension1);
            draggingDeltaDimension1Sign = draggingDeltaDimension1Abs / draggingDeltaDimension1;
            sliderAnimationStop();
            wrapperEl.style.transform = "translate" + axis + "(" + (currentDimension1 + draggingDeltaDimension1) + "px)";
            if (infinite) {
                if (draggingDeltaDimension1Abs >= itemsViewed * itemSize) {
                    var d = draggingDeltaDimension1Sign === -1 ? "next" : "prev";
                    currentDimension1 += itemsViewed * itemSize * draggingDeltaDimension1Sign;
                    transformDimension1(itemsViewed);
                    loopHandler(-draggingDeltaDimension1Sign, itemsViewed);
                    setTimeout(activeDotChanger, 200);
                    isDragging = false;
                }
            }
            else if (currentDimension1 + draggingDeltaDimension1 > itemSize || currentDimension1 + draggingDeltaDimension1 <= -(itemsTotal - itemsViewed + 1) * itemSize) {
                if (currentDimension1 + draggingDeltaDimension1 > itemSize) { currentDimension1 = 0; }
                if (currentDimension1 + draggingDeltaDimension1 <= -(itemsTotal - itemsViewed + 1) * itemSize) { currentDimension1 = itemSize * -(itemsTotal - itemsViewed) }
                sliderAnimationStart(1);
                transformDimension1();
                setTimeout(activeDotChanger, 200);
                isDragging = false;
            }
        }
    }
    function draggingEnd(e) {
        
        if (isDragging) {
            endT = performance.now();
            deltaT = endT - startT;
            if (e.type === "touchend" || e.type === "touchcancel") {
                document.documentElement.style.overflow = 'auto';
                e.preventDefault();
                endDimension1 = axis == "X" ? e.changedTouches[0].pageX : e.changedTouches[0].pageY;
                endDimension2 = axis == "X" ? e.changedTouches[0].pageY : e.changedTouches[0].pageX;
            }
            if (e.type === "mouseup") {
                endDimension1 = axis == "X" ? e.clientX : e.clientY;
                endDimension2 = axis == "X" ? e.clientY : e.clientX;
            }
            deltaDimension1 = endDimension1 - startDimension1;
            deltaDimension1Abs = Math.abs(deltaDimension1);
            deltaDimension1Sign = deltaDimension1Abs / deltaDimension1;
            deltaDimension2 = endDimension2 - startDimension2;
            deltaDimension2Abs = Math.abs(deltaDimension2);
            if (deltaT < 200 && deltaDimension2Abs <= 2 && deltaDimension1Abs <= 2) {
                isDragging = false;
                var link;
                var eventPath = e.path || (e.composedPath && e.composedPath());
                for (var q = 0; q < eventPath.length; q++) {
                    if (eventPath[q].href !== undefined) {
                        link = eventPath[q].href;
                        if (enhancedEcommerce) {
                            for (var p = 0; p < eventPath.length; p++) {
                                if (eventPath[p].classList.contains("vl-slider-item")) {
                                    var selectedItem = eventPath[p];
                                    EEClick(selectedItem);
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }

                if (link != undefined) { window.location = link; }
            }
            if (deltaDimension1Abs < slideThreshold) {
                sliderAnimationStart(1);
                transformDimension1();
                isDragging = false;
            } else {
                var d = deltaDimension1Sign === -1 ? "next" : "prev";
                var n = Math.floor(deltaDimension1Abs / itemSize) + (deltaDimension1Abs % itemSize > slideThreshold ? 1 : 0);

                slideHandler(d, n);
                // transformDimension1();
                isDragging = false;
            }
        }
    }
    function initSlider() {
        if (itemsViewed >= itemsTotal) {
            arrows = false;
            dots = false;
            autoScroll = false;
        }
        if (!isIOS) { wrapperEl.style.transform = "translate" + axis + "(" + (infinite ? -(Math.round(itemsTotal / 2) * itemSize) : 0) + "px)"; }
        wrapperTransform = wrapperEl.style.transform;
        sliderAnimationStop();
        currentDimension1 = parseFloat(wrapperTransform.substring(wrapperTransform.indexOf("(") + 1, wrapperTransform.indexOf("px")));
        if (isMobile) {
            arrowsHover = false;
            dots = false;
            autoScroll = false;
            infinite = isIOS ? false : infinite;
        }
        var EEArray = [];
        if (enhancedEcommerce) { EEHandler(EEArray); }
        idHandler();
        if (infinite) {
            cloneHandler();
            sliderItemEls = widgetEl.querySelectorAll(".vl-slider-item");
        }
        if (arrows) {
            if (isMobile) {
                if (mobileArrows) {
                    arrowGenerator();
                }
            } else {
                arrowGenerator();
            }
        }
        if (axis == "Y") {
            dots = false;
        }
        if (dots) {
            dotGenerator();
            activeDotChanger();
        }
        styleGenerator();
        if (autoScroll && isInViewport(sliderEl)) {
            widgetEl.addEventListener("mouseenter", () => { autoScrolling = 1; });
            widgetEl.addEventListener("mouseleave", () => { autoScrolling = 0; });
            window.addEventListener("focus", function () {
                autoScrolling = 0;
            });
            window.addEventListener("blur", function () {
                autoScrolling = 1;
            });
            setInterval(autoScroller, autoScrollTimer * 1000);
        }
        linkPreventer();

        wrapperEl.addEventListener("mousedown", draggingStart);
        document.addEventListener("mousemove", dragging);
        document.addEventListener("mouseup", draggingEnd);
        if (!isIOS) {
            wrapperEl.addEventListener("touchstart", draggingStart, { passive: false });
            document.addEventListener("touchmove", dragging, { passive: false });
            document.addEventListener("touchend", draggingEnd, { passive: false });
        }else {
            wrapperEl.addEventListener("touchstart", IOSDraggingStart, { passive: false });
            document.addEventListener("touchmove", IOSDragging, { passive: false });
            document.addEventListener("touchend", IOSDraggingEnd, { passive: false });
        }
    }
    initSlider();
    browserChecker() === "firefox" ? sliderEl.scrollTo(0, 0) : null;
    window.addEventListener("resize", function () {
        responsiveViewHandler(); styleGenerator(); dotGenerator();
    });
}

window.onload = function () {
    vlWidgetHandler("test-widget1", {
        axis: "X",
        width: 150,
        height: 310,
        itemsToView: 4,
        // dots: {
        //     showOnHover: true,
        //     numbers: true,
        // },
        autoScroll: false,
        // autoScrollTimer: 5,
        enhancedEcommerce: true
    });
    // vlWidgetHandler("test-widget2", { dots: false, autoScroll: true, });
    var els = document.getElementsByClassName("vl-slider-item");
    for (var i = 0; i < els.length; i += 2) {
        els[i].style.backgroundColor = "lightgray";
    }
}
