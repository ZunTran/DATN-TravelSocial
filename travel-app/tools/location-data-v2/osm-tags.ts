export type OSMTagDefinition = {
  key: string;
  value: string;
  category: string;
  label: string;
};

export const CATEGORY_NAMES = {
  FOOD: 'Ẩm thực',
  TRAVEL: 'Du lịch',
  PLACE: 'Địa điểm',
  MOUNTAIN: 'Mountain',
} as const;


export const OSM_TAGS: OSMTagDefinition[] = [

  {
    key: 'amenity',
    value: 'restaurant',
    category: CATEGORY_NAMES.FOOD,
    label: 'Restaurant',
  },

  {
    key: 'amenity',
    value: 'cafe',
    category: CATEGORY_NAMES.FOOD,
    label: 'Cafe',
  },

  {
    key: 'amenity',
    value: 'fast_food',
    category: CATEGORY_NAMES.FOOD,
    label: 'Fast Food',
  },

  {
    key: 'amenity',
    value: 'food_court',
    category: CATEGORY_NAMES.FOOD,
    label: 'Food Court',
  },

  {
    key: 'amenity',
    value: 'bar',
    category: CATEGORY_NAMES.FOOD,
    label: 'Bar',
  },

  {
    key: 'tourism',
    value: 'hotel',
    category: CATEGORY_NAMES.TRAVEL,
    label: 'Hotel',
  },

  {
    key: 'tourism',
    value: 'hostel',
    category: CATEGORY_NAMES.TRAVEL,
    label: 'Hostel',
  },

  {
    key: 'tourism',
    value: 'guest_house',
    category: CATEGORY_NAMES.TRAVEL,
    label: 'Guest House',
  },

  {
    key: 'tourism',
    value: 'motel',
    category: CATEGORY_NAMES.TRAVEL,
    label: 'Motel',
  },

  {
    key: 'shop',
    value: 'mall',
    category: CATEGORY_NAMES.TRAVEL,
    label: 'Mall',
  },

  {
    key: 'amenity',
    value: 'marketplace',
    category: CATEGORY_NAMES.TRAVEL,
    label: 'Marketplace',
  },

  {
    key: 'shop',
    value: 'gift',
    category: CATEGORY_NAMES.TRAVEL,
    label: 'Gift / Tourist Shop',
  },

  {
    key: 'shop',
    value: 'souvenir',
    category: CATEGORY_NAMES.TRAVEL,
    label: 'Souvenir / Tourist Shop',
  },

  {
    key: 'tourism',
    value: 'attraction',
    category: CATEGORY_NAMES.PLACE,
    label: 'Attraction',
  },

  {
    key: 'tourism',
    value: 'museum',
    category: CATEGORY_NAMES.PLACE,
    label: 'Museum',
  },

  {
    key: 'tourism',
    value: 'viewpoint',
    category: CATEGORY_NAMES.PLACE,
    label: 'Viewpoint',
  },

  {
    key: 'tourism',
    value: 'gallery',
    category: CATEGORY_NAMES.PLACE,
    label: 'Gallery',
  },

  {
    key: 'tourism',
    value: 'artwork',
    category: CATEGORY_NAMES.PLACE,
    label: 'Artwork',
  },

  {
    key: 'tourism',
    value: 'theme_park',
    category: CATEGORY_NAMES.PLACE,
    label: 'Theme Park',
  },

  {
    key: 'tourism',
    value: 'zoo',
    category: CATEGORY_NAMES.PLACE,
    label: 'Zoo',
  },

  {
    key: 'tourism',
    value: 'aquarium',
    category: CATEGORY_NAMES.PLACE,
    label: 'Aquarium',
  },

  {
    key: 'historic',
    value: 'monument',
    category: CATEGORY_NAMES.PLACE,
    label: 'Monument',
  },

  {
    key: 'historic',
    value: 'memorial',
    category: CATEGORY_NAMES.PLACE,
    label: 'Memorial',
  },

  {
    key: 'historic',
    value: 'castle',
    category: CATEGORY_NAMES.PLACE,
    label: 'Castle',
  },

  {
    key: 'historic',
    value: 'fort',
    category: CATEGORY_NAMES.PLACE,
    label: 'Fort',
  },

  {
    key: 'historic',
    value: 'ruins',
    category: CATEGORY_NAMES.PLACE,
    label: 'Ruins',
  },

  {
    key: 'historic',
    value: 'archaeological_site',
    category: CATEGORY_NAMES.PLACE,
    label: 'Archaeological Site',
  },

  {
    key: 'historic',
    value: 'manor',
    category: CATEGORY_NAMES.PLACE,
    label: 'Manor',
  },

  {
    key: 'historic',
    value: 'palace',
    category: CATEGORY_NAMES.PLACE,
    label: 'Palace',
  },

  {
    key: 'historic',
    value: 'city_gate',
    category: CATEGORY_NAMES.PLACE,
    label: 'City Gate',
  },


  {
    key: 'natural',
    value: 'beach',
    category: CATEGORY_NAMES.PLACE,
    label: 'Beach',
  },

  {
    key: 'natural',
    value: 'bay',
    category: CATEGORY_NAMES.PLACE,
    label: 'Bay',
  },

  {
    key: 'natural',
    value: 'cave',
    category: CATEGORY_NAMES.PLACE,
    label: 'Cave',
  },

  {
    key: 'natural',
    value: 'island',
    category: CATEGORY_NAMES.PLACE,
    label: 'Island',
  },


  {
    key: 'leisure',
    value: 'park',
    category: CATEGORY_NAMES.PLACE,
    label: 'Park',
  },

  {
    key: 'leisure',
    value: 'garden',
    category: CATEGORY_NAMES.PLACE,
    label: 'Garden',
  },


  {
    key: 'natural',
    value: 'peak',
    category: CATEGORY_NAMES.MOUNTAIN,
    label: 'Peak',
  },

  {
    key: 'natural',
    value: 'cliff',
    category: CATEGORY_NAMES.MOUNTAIN,
    label: 'Cliff',
  },

  {
    key: 'natural',
    value: 'ridge',
    category: CATEGORY_NAMES.MOUNTAIN,
    label: 'Ridge',
  },
];

export function getTagDefinition(
  key: string,
  value: string,
): OSMTagDefinition | undefined {
  return OSM_TAGS.find(
    (tag) =>
      tag.key === key &&
      tag.value === value,
  );
}