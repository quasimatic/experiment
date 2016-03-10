export default function (target, container) {
    try {
        var results = container.querySelectorAll(target);

        return Array.prototype.slice.apply(results);
    }
    catch (e) {
        return false;
    }
}
