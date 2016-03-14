export default function (label, container) {
    try {
        var results = container.querySelectorAll(label);

        return Array.prototype.slice.apply(results);
    } catch (e) {
        return [];
    }
}