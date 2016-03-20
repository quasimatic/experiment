Start = scopes:Scope* { return scopes }

ScopeChar = ">"
ModifierChar = ":"
ModifierSeparator = ","
IndexChar = "#"
EscapeChar = "\\"

Scope
 = reference:Reference ScopeChar? { return reference; }

Reference
 = label:Label position:Index? modifiers:Modifiers? { return { label: label, position: position, modifiers:modifiers } }

Label
 = chars:LabelCharacter+ { return chars.join('') }

LabelCharacter
   = !(EscapeChar / ScopeChar / IndexChar / ModifierChar) c:Character { return c }
   / c:EscapedSequence { return c }

Character
 = .

EscapedSequence
 = EscapeChar c:(EscapeChar / IndexChar / ScopeChar / ModifierChar) { return c; }

Index
 = IndexChar position:Position { return position; }

Position
 = [0-9]+ { return parseInt(text(), 10); }

Modifiers
 = ModifierChar modifiers:ModifierName* { return modifiers; }

ModifierName
 = name:ModifierThing ModifierSeparator? { return name }

ModifierThing
 = thing:ModifierCharacter+ { return thing.join("") }

ModifierCharacter
  = !(ScopeChar / ModifierSeparator) c:Character { return c }
