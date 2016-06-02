import Modifiers from "../utils/modifiers";
import nthFilter from "../position-filters/nth-filter";

export default class Positional {
    static filter(afterFilterElements, target, extensions, data) {
        var beforePositionalElements = Modifiers.beforePositional(afterFilterElements, target.position, extensions, data);

        var positionalElements = nthFilter(beforePositionalElements, target.position);

        return Modifiers.afterPositional(positionalElements, target.position, extensions, data);
    }
}