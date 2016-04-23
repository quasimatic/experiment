export default function(label, container) {
    try {
        let results = container.querySelectorAll(label);

        return Array.prototype.slice.apply(results);
    }
    catch (e) {
        return [];
    }
}
