import Modifiers from "../utils/modifiers";
import nthFilter from "../position-filters/nth-filter";

export default class Positional {
    static filter(data) {
        let {elements, target, extensions} = data;

        var index = target.properties.length == 1 && !isNaN(target.properties[0]) ? target.properties[0] : null;

        var beforePositionalElements = Modifiers.beforePositional(elements, index, extensions, data);

        var positionalElements = nthFilter(beforePositionalElements, index);

        return Modifiers.afterPositional(positionalElements, index, extensions, data);
    }
}