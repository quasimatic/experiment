Start
 = containers:Container* { return {containers:containers}; }

Container
 = section:Section ContainerChar? { return section; }

Section
 = label:Label position:Index? modifier:Modifier? { return { label: label, position: position, modifier:modifier } }

ContainerChar
 = ">"

Label
 = chars:LabelCharacter+ { return chars.join('') }

LabelCharacter
   = !(EscapeChar / ContainerChar / IndexChar / ModifierChar) c:Character { return c }
   / c:EscapedSequence { return c }

Character
 = .

EscapedSequence
 = EscapeChar c:(EscapeChar / IndexChar / ContainerChar / ModifierChar) { return c; }

EscapeChar
 = "\\"

Index
 = IndexChar position:Position { return position; }

IndexChar
 = "#"

Position
 = [0-9]+ { return parseInt(text(), 10); }

Modifier
 = ModifierChar name:Character+ { return name.join(''); }

ModifierChar
 = ":"