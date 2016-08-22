{
	var scope = "";
	var scopeIndex = 0;
}

Start = scopes:Scope* { return scopes }

ScopeChar = ">"
IntersectionChar = "^"
PropertyChar = ":"
PropertySeparator = ","
IndexChar = "#"
EscapeChar = "\\"

Scope
 = targets:Targets ScopeChar? {
 	scope += text()
    return targets;
 }

Targets
 = targets:Target+ {
 	return targets
 }

Target
 = label:RawLabel IntersectionChar? {
	label.path = (scope + text()).trim();
    return label;
 }

RawLabel
  = label:Label position:Index? properties:Properties? Whitespace? {
	return { label: label.trim(), position: position, properties: properties || [], scope: scope.slice(0,-1), scopeIndex: scopeIndex++, path: (scope + text()).trim() }
  }
Label
 = chars:LabelCharacter+ { return chars.join('') }

LabelCharacter
   = !(EscapeChar / ScopeChar / IndexChar / PropertyChar / IntersectionChar) c:Character { return c }
   / c:EscapedSequence { return c }

Character
 = .

Whitespace
 = [ \t\r\n]+

EscapedSequence
 = EscapeChar c:(EscapeChar / IndexChar / ScopeChar / PropertyChar / IntersectionChar) { return c; }

Index
 = IndexChar position:Position { return position; }

Position
 = [0-9]+ { return parseInt(text(), 10); }

Properties
 = PropertyChar properties:Property* { return properties; }

Property
 = name:PropertyName PropertySeparator? { return name.trim() }

PropertyName
 = thing:PropertyCharacter+ { return thing.join("") }

PropertyCharacter
  = !(ScopeChar / IntersectionChar / PropertySeparator) c:Character { return c }
