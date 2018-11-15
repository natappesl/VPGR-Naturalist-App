export const DetailFields = [
  'overview',
  'size',
  'stype',
  'conservationstatus',
  'behavior',
  'habitat',
];

export const NondetailFields = [
  'url',
  'id',
  'aliases',
  'alias',
];
// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};