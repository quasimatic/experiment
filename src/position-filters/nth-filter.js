export default function (elements, position) {
    if (position == null) {
        return elements;
    }

    if (position <= 0) {
        console.log("Positions start at 1")
        return [];
    }

    if (elements.length < position) {
        console.log(`Position ${position} out of range`);
        return [];
    }

    let i = position - 1;
    return [elements[i]];
}