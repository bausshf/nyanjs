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

      viewTag.innerHTML = view;
    }

    var viewController = this.getController(viewTag.getAttribute('n-controller')) || this.getViewController(viewName) || this.getViewController(this.app.defaultViewController);

    if (viewController) {
      viewConroller = this.clone(viewController);
      viewController.events = this.clone(nyan.Events);

      viewController.init();
    }

    viewTag.style.visibility = 'hidden';

    if (viewController) {
      var dataBind = viewTag.getAttribute('n-data-bind');

      if (dataBind) {
        viewController[dataBind] = model;
      }
    }

    this.bind(viewTag, model || null, viewController, internal);

    viewTag.style.visibility = 'visible';

    function rebindResponsive() {
      viewTag.__responsive = {};

      var responsiveElements = viewTag.querySelectorAll('[n-resp-bind]');

      if (responsiveElements && responsiveElements.length) {
        for (var i = 0; i < responsiveElements.length; i++) {
          var responsiveElement = responsiveElements[i],
              responsiveSizes = responsiveElement.getAttribute('n-resp');

          if (responsiveSizes) {
            var respBinding = responsiveElement.getAttribute('n-resp-bind'),
                respData = viewTag.__responsive[respBinding] || {};

            if (responsiveElement.innerHTML && responsiveElement.innerHTML.trim().length > 0) {
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
    }

    rebindResponsive();

    if (!viewTag.__detachEvent) {
      viewTag.__detachEvent = function() {
        for (var prop in viewTag.__responsive) {
          var respData = viewTag.__responsive[prop];

          if (!respData.xs && !respData.sm && !respData.md && !respData.lg) {
            continue;
          }

          var resp = nyan.getResp(),
              element = respData[resp];

          if (!element || (element.innerHTML && element.innerHTML.trim().length > 0)) {
            return;
          }

          if (resp !== 'xs') respData.xs.innerHTML = '';
          if (resp !== 'sm') respData.sm.innerHTML = '';
          if (resp !== 'md') respData.md.innerHTML = '';
          if (resp !== 'lg') respData.lg.innerHTML = '';

          element.innerHTML = respData.innerHTML;

          rebindResponsive();
        }
      };

      window.addEventListener('resize', viewTag.__detachEvent);
      viewTag.__detachEvent();
    }
  }
});
