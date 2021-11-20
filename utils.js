const debounce = (func, delay = 800) => {
    let timeoutId;
    return (...arguments) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, arguments);
        }, delay);
    }
}