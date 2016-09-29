{
	var scope = "";
	var scopeIndex = 0;

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
PropertyChar = "#"
SeparatorChar = ","
TransformChar = ":"

EscapeChar = "\\"
EscapableChars = EscapeChar / ScopeChar / TransformChar / PropertyChar / IntersectChar
EscapedSequence = EscapeChar c:(EscapableChars) { return c; }

Reference
 = target:Target ScopeChar {
	scopeIndex++;
 	scope += text()
    target.type = "scope";
    return target;
 }
 / target:Target IntersectChar {
	scopeIndex++;
 	scope += text()
    target.type = "intersect";
    return target;
 }
 / target:Target {
	scopeIndex++;
 	scope += text()
    target.type = "target";
    return target;
 }

Target = label:Label { return label }

Label
  = label:LabelCharacter+ properties:Properties? transforms:Transforms? Whitespace? {
    return {
      label: label.join('').trim(),
      properties: properties || [],
      transforms: transforms || [],
      scope: scope.slice(0,-1).trim(),
      scopeIndex: scopeIndex,
      path: (scope + text()).trim()
    }
  }

LabelCharacter
 = !(EscapableChars) c:. { return c }
 / EscapedSequence

Properties = PropertyChar properties:Property* { return properties; }

Property = name:Character+ SeparatorChar? { return tryParseInt(name.join("").trim()) }

Transforms = TransformChar transforms:Transform* { return transforms; }
Transform = name:Character+ SeparatorChar? { return name.join("").trim() }

Character = !(EscapableChars / SeparatorChar) c:. { return c }

Whitespace = [ \t\r\n]+