// Schema Property Finder function
export const propertyFinder = function (model, attribute) {
    let attributes = [];
    for (let key in model.schema.tree) {
        if (model.schema.tree.hasOwnProperty(key)) {
            let value = model.schema.tree[key];
            if (value[attribute] === true) attributes.push(key);
        }
    }
    return attributes;
};