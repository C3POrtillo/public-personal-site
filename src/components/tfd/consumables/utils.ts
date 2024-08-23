export const getSourceLabel = (string: string) => {
  switch (string) {
    case 'Resource Boxes/Munitions':
      return 'label-standard';
    case 'Battlefield Elites':
      return 'label-rare';
    case 'Outpost Elites':
      return 'label-ultimate';
    case 'Infiltration Elites':
      return 'label-transcendent';
    default:
      return 'label-standard';
  }
};

export const getSourceToMaterialLabel = (string: string) => {
  switch (string) {
    case 'Resource Boxes/Munitions':
      return 'label-standard';
    default:
      return 'label-rare';
  }
};
