function PartialBreak() {}

PartialBreak.prototype = new Error();

function LocatorBreak() {}
function FilterBreak() {}

LocatorBreak.prototype = new PartialBreak();
FilterBreak.prototype = new FilterBreak();

export default PartialBreak;
