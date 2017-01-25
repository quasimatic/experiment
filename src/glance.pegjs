{
	var scope = "";

	function tryParseInt(str) {
      if (!isNaN(str)) {
        return parseInt(str);
      }
      return str;
    }
}

Start = references:Reference* { return references }

ScopeChar = ">"
IntersectChar = "^"
OptionChar = "#"
SeparatorChar = ","
TransformChar = ":"

EscapeChar = "\\"
EscapableChars = EscapeChar / ScopeChar / TransformChar / OptionChar / IntersectChar
EscapedSequence = EscapeChar c:(EscapableChars) { return c; }

Reference
 = target:Target ScopeChar {
 	scope += text()
    target.type = "scope";
    return target;
 }
 / target:Target IntersectChar {
 	scope += text()
    target.type = "intersect";
    return target;
 }
 / target:Target {
 	scope += text()
    target.type = "target";
    return target;
 }

Target = label:Label { return label }

Label
  = label:LabelCharacter+ options:Options? transforms:Transforms? Whitespace? {
    return {
      label: label.join('').trim(),
      options: options || [],
      transforms: transforms || [],
      scope: scope.slice(0,-1).trim(),
      path: (scope + text()).trim()
    }
  }

LabelCharacter
 = !(EscapableChars) c:. { return c }
 / EscapedSequence

Options = OptionChar options:Option* { return options; }

Option = name:Character+ SeparatorChar? { return tryParseInt(name.join("").trim()) }

Transforms = TransformChar transforms:Transform* { return transforms; }
Transform = name:Character+ SeparatorChar? { return name.join("").trim() }

Character = !(EscapableChars / SeparatorChar) c:. { return c }

Whitespace = [ \t\r\n]+