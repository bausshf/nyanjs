nyan.extend('nyan', {
  name: 'setView',

  impl: function(viewContainer, viewName, model, internal) {
    var useWholePage = !viewContainer && !viewName,
        viewTag = !useWholePage ? document.getElementById(viewContainer) : document.body,
        view;

    if (!useWholePage) {
      if (!viewTag || !viewTag.tagName.toLowerCase() === 'view') {
        return;
      }

      view = this.views[viewName];

      if (!view) {
        return;
      }  
    }

    var viewController = this.getController(viewTag.getAttribute('n-controller')) || this.getViewController(viewName) || this.getViewController(this.app.defaultViewController);

    if (viewController) {
      viewConroller = this.clone(viewController);
      viewController.events = this.clone(nyan.Events);

      viewController.init();
    }

    viewTag.innerHTML = view;

    viewTag.style.visibility = 'hidden';

    if (viewController) {
      var dataBind = viewTag.getAttribute('n-data-bind');

      if (dataBind) {
        viewController[dataBind] = model;
      }
    }

    this.bind(viewTag, model || null, viewController, internal);

    viewTag.style.visibility = 'visible';

    viewTag.__responsive = {};

    var responsiveElements = viewTag.querySelectorAll('[n-resp-bind]');

    if (responsiveElements && responsiveElements.length) {
      for (var i = 0; i < responsiveElements.length; i++) {
        var responsiveElement = responsiveElements[i],
            responsiveSizes = responsiveElement.getAttribute('n-resp');

        if (responsiveSizes) {
          var respBinding = responsiveElement.getAttribute('n-resp-bind'),
              respData = viewTag.__responsive[respBinding] || {};

          if (responsiveElement.innerHTML && responsiveElement.innerHTML.length > 0) {
            respData.innerHTML = responsiveElement.innerHTML;
          }

          var sizes = responsiveSizes.split(',');

          for (var j = 0; j < sizes.length; j++) {
            switch (sizes[j]) {
              case 'xs': respData.xs = responsiveElement; break;
              case 'sm': respData.sm = responsiveElement; break;
              case 'md': respData.md = responsiveElement; break;
              case 'lg': respData.lg = responsiveElement; break;
            }
          }

          viewTag.__responsive[respBinding] = respData;
        }
      }
    }

    if (!viewTag.__detachEvent) {
      viewTag.__detachEvent = function() {
        for (var prop in viewTag.__responsive) {
          var respData = viewTag.__responsive[prop];

          if (!respData.xs && !respData.sm && !respData.md && !respData.lg) {
            continue;
          }

          respData.xs.innerHTML = '';
          respData.sm.innerHTML = '';
          respData.md.innerHTML = '';
          respData.lg.innerHTML = '';

          switch (nyan.getResp()) {
            case 'lg': respData.lg.innerHTML = respData.innerHTML; break;
            case 'md': respData.md.innerHTML = respData.innerHTML; break;
            case 'sm': respData.sm.innerHTML = respData.innerHTML; break;
            case 'xs': respData.xs.innerHTML = respData.innerHTML; break;
          }
        }
      };

      window.addEventListener('resize', viewTag.__detachEvent);
      viewTag.__detachEvent();
    }
  }
});
