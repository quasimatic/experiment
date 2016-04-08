# Custom labels

Custom labels let you override the default find strategies. This allows you to create reusable labels that do custom lookups for elements.

Custom labels do not get the current scope and should return all elements.

## Example

[Codepen](codepen://quasimatic/mPpqwR)


```javascript
glanceSelector.addLabel("foobar", function(glance, label) {
  return document.getElementBy
});
```

Then you can use the selector

```foobar```
