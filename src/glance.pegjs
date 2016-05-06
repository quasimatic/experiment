{
	var scope = "";
}

Start = scopes:Scope* { return scopes }

ScopeChar = ">"
ModifierChar = ":"
ModifierSeparator = ","
IndexChar = "#"
EscapeChar = "\\"

Scope
 = target:Target ScopeChar? {
 	scope += text()
 	return target;
 }

Target
 = label:Label position:Index? modifiers:Modifiers? Whitespace? { return { label: label.trim(), position: position, modifiers: modifiers || [], scope: scope.slice(0,-1), path: (scope + text()).trim() } }

Label
 = chars:LabelCharacter+ { return chars.join('') }

LabelCharacter
   = !(EscapeChar / ScopeChar / IndexChar / ModifierChar) c:Character { return c }
   / c:EscapedSequence { return c }

Character
 = .

Whitespace
 = [ \t\r\n]+

EscapedSequence
 = EscapeChar c:(EscapeChar / IndexChar / ScopeChar / ModifierChar) { return c; }

Index
 = IndexChar position:Position { return position; }

Position
 = [0-9]+ { return parseInt(text(), 10); }

Modifiers
 = ModifierChar modifiers:Modifier* { return modifiers; }

Modifier
 = name:ModifierName ModifierSeparator? { return name.trim() }

ModifierName
 = thing:ModifierCharacter+ { return thing.join("") }

ModifierCharacter
  = !(ScopeChar / ModifierSeparator) c:Character { return c }
