export default function(elements, position) {
    if (position == null)
        return elements;

    if (position <= 0) {
        throw new Error("Position starts at 1")
    }

    if (elements.length < position)
        throw new Error(`Position ${position} out of range`);

    let i = position - 1;
    return [elements[i]];
}