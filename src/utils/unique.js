export default function unique(array) {
    return array.filter(function(x, i) {
        return array.indexOf(x) === i
    })
}