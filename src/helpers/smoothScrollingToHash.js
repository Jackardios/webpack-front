function setHash( hash ) {
    if (history.pushState) {
        history.pushState(null, null, hash);
    } else {
        location.hash = hash;
    }
}

const defaultOptions = {
    offsetTop: 0,
    duration: 1000,
};

export default (options) => {
    const $root = $('html, body'),
          readyOptions = $.extend({}, defaultOptions, options);
    
    $('[href^="#"]').on("click", function(event) {
        event.preventDefault();
        let hash = $(this).attr("href"),
            $elem = $(hash);

        if ($elem && $elem.length) {
            $root.animate({
                scrollTop: $elem.offset().top - readyOptions.offsetTop
            }, readyOptions.duration, function() {
                setHash(hash);
            });
        } else {
            if (hash === "#contact-form") {
                window.popupObj.show('callback-popup');
            }
            setHash(hash);
        }
    });
}