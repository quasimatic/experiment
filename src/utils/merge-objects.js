export default function(obj1, obj2) {
    let obj3 = {};
    for (let key in obj1) {
        obj3[key] = obj1[key];
    }
    for (let key in obj2) {
        obj3[key] = obj2[key];
    }
    return obj3;
}