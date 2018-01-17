nyan.extend('nyan', {
  name: 'getResp',

  impl: function() {
    if (width > 994) {
      return 'lg';
    } else if (width > 780) {
      return 'md';
    } else if (width > 564) {
      return 'sm';
    } else {
      return 'xs';
    }
  }
});
