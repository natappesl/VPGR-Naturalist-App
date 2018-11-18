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
  'sciname',
];

export const NewSpeciesFields = [
  'sciname',
  'alias',
  'overview',
  'size',
  'stype',
  'conservationstatus',
  'behavior',
  'habitat',
]

export const ExcludedNewSpeciesNondetailFields = [
  'url',
  'id',
  'aliases',
];

export const DefaultFieldInputPlaceholders = {
  alias: 'Test species',
  overview: 'A short, general description of tests',
  sciname: 'Genius testspecicus',
  size: 'small',
  stype: 'Animals',
  behavior: 'Common associates with bugs of the pestering type',
  habitat: 'Only found while testing',
  conservationstatus: 'LC',
};

export const FieldInputPlaceholders = {
  alias: 'A common name of the species',
  overview: 'A short, general description',
  sciname: 'Genus species',
  size: 'small medium large',
  stype: 'Animals Plants Birds Crustaceans',
  behavior: 'Common habits',
  habitat: 'Common types of places one might find this species',
  conservationstatus: 'LC NT VU EN CR EW EX DD NE',
};

export const RequiredSpeciesFields = [
  'alias',
  'sciname',
  'overview',
  'size',
  'stype',
  'conservationstatus',
  'behavior',
  'habitat',
]

// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};