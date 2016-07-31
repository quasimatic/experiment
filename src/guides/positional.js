import Modifiers from "../utils/modifiers";
import nthFilter from "../position-filters/nth-filter";

export default class Positional {
    static filter(data) {
        let {elements, target, extensions} = data;

        var beforePositionalElements = Modifiers.beforePositional(elements, target.position, extensions, data);

        var positionalElements = nthFilter(beforePositionalElements, target.position);

        return Modifiers.afterPositional(positionalElements, target.position, extensions, data);
    }
}