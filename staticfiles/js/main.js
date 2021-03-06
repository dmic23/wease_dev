'use strict';

angular
  .module('minovateApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngStorage',
    'ngTouch',
    'picardy.fontawesome',
    'ui.bootstrap',
    'ui.router',
    'ui.utils',
    'angular-loading-bar',
    'angular-momentjs',
    'FBAngular',
    'lazyModel',
    'toastr',
    'angularBootstrapNavTree',
    'oc.lazyLoad',
    'ui.select',
    'ui.tree',
    'textAngular',
    'colorpicker.module',
    'angularFileUpload',
    'ngImgCrop',
    'datatables',
    'datatables.bootstrap',
    'datatables.colreorder',
    'datatables.colvis',
    'datatables.tabletools',
    'datatables.scroller',
    'datatables.columnfilter',
    'ui.grid',
    'ui.grid.resizeColumns',
    'ui.grid.edit',
    'ui.grid.moveColumns',
    'ngTable',
    'smart-table',
    'angular-flot',
    'angular-rickshaw',
    'easypiechart',
    'uiGmapgoogle-maps',
    'ui.calendar',
    'angular.filter',
    // 'ui.utils.masks',
    'authentication',
    'layout',
    'accounts',
    'orders', 
  ])
  .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {

      event.targetScope.$watch('$viewContentLoaded', function () {

        angular.element('html, body, #content').animate({ scrollTop: 0 }, 200);

        setTimeout(function () {
          angular.element('#wrap').css('visibility','visible');

          if (!angular.element('.dropdown').hasClass('open')) {
            angular.element('.dropdown').find('>ul').slideUp();
          }
        }, 200);
      });
      $rootScope.containerClass = toState.containerClass;
    });
  }])
  .run(['$rootScope', '$state', 'Authentication',function($rootScope, $state, Authentication) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      var requireLogin = toState.data.requireLogin;
      var auth = Authentication.isAuthenticated();

      if (requireLogin && !auth) {
        event.preventDefault();
        console.log('Here in app.js');
        console.log(requireLogin);
        console.log(auth);
        console.log($state.go('core.login'));
        $state.go('core.login');
        return $rootScope;
      }
    });
  }])
  .run(['$http', function ($http){
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';

  }])
  .config(['uiSelectConfig', function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
  }])
  .config(function ($urlMatcherFactoryProvider) {
    $urlMatcherFactoryProvider.caseInsensitive(true);
    $urlMatcherFactoryProvider.strictMode(false);
  })
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    // $urlRouterProvider.otherwise('/app/dashboard');
    
    $urlRouterProvider.otherwise(function($injector) {
      var $state = $injector.get('$state');
      $state.go('app.dashboard');
    });

    $stateProvider
    //app page
    .state('app', {
      abstract: true,
      url: '/app',     
      templateUrl: static_path('views/tmpl/app.html'),
      data: {
        requireLogin: true
      },
    })
    //dashboard
    .state('app.dashboard', {
      url: '/dashboard',
      controller: 'DashboardController',
      controllerAs: 'vm',
      templateUrl: static_path('views/dashboard.html'),
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            static_path('scripts/vendor/datatables/datatables.bootstrap.min.css')
          ]);
        }]
      },
      data: {
        requireLogin: true
      },
    })
    // requests/orders/offers
    .state('app.orders', {
      abstract: true,
      url: '/orders',
      template: '<div ui-view></div>'
    })
    .state('app.orders.all', {
      url: '/all',
      controller: 'OrdersController',
      controllerAs: 'vm',
      templateUrl: static_path('views/orders/orders.html'),
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            static_path('scripts/vendor/datatables/datatables.bootstrap.min.css'),
            static_path('scripts/vendor/datatables/Pagination/input.js'),
            static_path('scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js')
          ]);
        }]
      }
    })    
    //request
    .state('app.orders.request', {
      url: '/request/:goodId',
      controller: 'RequestController',
      controllerAs: 'vm',
      templateUrl: static_path('views/orders/new-request.html'),
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            static_path('scripts/vendor/slider/bootstrap-slider.js'),
            static_path('scripts/vendor/touchspin/jquery.bootstrap-touchspin.js'),
            static_path('scripts/vendor/touchspin/jquery.bootstrap-touchspin.css'),
            static_path('scripts/vendor/filestyle/bootstrap-filestyle.min.js')
          ]);
        }]
      }
    })
    //edit request
    .state('app.orders.edit', {
      url: '/edit/:reqId',
      controller: 'EditRequestController',
      controllerAs: 'vm',
      templateUrl: static_path('views/orders/edit-request.html'),
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            static_path('scripts/vendor/slider/bootstrap-slider.js'),
            static_path('scripts/vendor/touchspin/jquery.bootstrap-touchspin.js'),
            static_path('scripts/vendor/touchspin/jquery.bootstrap-touchspin.css'),
            static_path('scripts/vendor/filestyle/bootstrap-filestyle.min.js')
          ]);
        }]
      }
    })
    //add request
    .state('app.orders.add', {
      url: '/:orderId/add/:goodId',
      controller: 'AddRequestController',
      controllerAs: 'vm',
      templateUrl: static_path('views/orders/add-request.html'),
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            static_path('scripts/vendor/slider/bootstrap-slider.js'),
            static_path('scripts/vendor/touchspin/jquery.bootstrap-touchspin.js'),
            static_path('scripts/vendor/touchspin/jquery.bootstrap-touchspin.css'),
            static_path('scripts/vendor/filestyle/bootstrap-filestyle.min.js')
          ]);
        }]
      }
    })
    //order
    .state('app.orders.order', {
      url: '/order/:orderId',
      controller: 'OrderController',
      controllerAs: 'vm',
      templateUrl: static_path('views/orders/order.html'),
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            static_path('scripts/vendor/datatables/datatables.bootstrap.min.css'),
            static_path('scripts/vendor/datatables/Pagination/input.js'),
            static_path('scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js')
          ]);
        }]
      }
    }) 
    //offer
    .state('app.orders.offer', {
      url: '/offer/:orderId',
      controller: 'OfferController',
      controllerAs: 'vm',
      templateUrl: static_path('views/orders/offer.html'),
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            static_path('scripts/vendor/datatables/datatables.bootstrap.min.css'),
            static_path('scripts/vendor/datatables/Pagination/input.js'),
            static_path('scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js')
          ]);
        }]
      }
    })
    //example pages
    .state('app.pages', {
      url: '/pages',
      template: '<div ui-view></div>'
    })
    //profile page
    .state('app.pages.profile', {
      url: '/profile/:username',
      controller: 'AccountController',
      controllerAs: 'vm',
      templateUrl: static_path('views/authentication-views/profile.html'),
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            static_path('scripts/vendor/filestyle/bootstrap-filestyle.min.js')
          ]);
        }]
      }
    })
    .state('app.pages.company-profile', {
      url: '/company/:companyId',
      controller: 'CompanySettingsController',
      controllerAs: 'vm',
      templateUrl: static_path('views/authentication-views/company-profile.html'),
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            static_path('scripts/vendor/filestyle/bootstrap-filestyle.min.js')
          ]);
        }]
      }
    })
    //mail
    .state('app.mail', {
      abstract: true,
      url: '/mail',
      controller: 'MailCtrl',
      templateUrl: static_path('views/tmpl/mail/mail.html')
    })
    //mail/inbox
    .state('app.mail.inbox', {
      url: '/inbox',
      controller: 'MailInboxCtrl',
      templateUrl: static_path('views/tmpl/mail/inbox.html')
    })
    //mail/compose
    .state('app.mail.compose', {
      url: '/compose',
      controller: 'MailComposeCtrl',
      templateUrl: static_path('views/tmpl/mail/compose.html')
    })
    //mail/single
    .state('app.mail.single', {
      url: '/single',
      controller: 'MailSingleCtrl',
      templateUrl: static_path('views/tmpl/mail/single.html')
    })
    //app core pages (errors, login,signup)
    .state('core', {
      abstract: true,
      url: '/core',
      template: '<div ui-view></div>',
      data: {
        requireLogin: false
      }
    })
    //login
    .state('core.login', {
      url: '/login',
      controller: 'LoginController',
      controllerAs: 'vm',
      templateUrl: static_path('views/authentication-views/login.html'),
      // data: {
      //   requireLogin: false
      // },
    })
  }]);
  //   //ui
  //   .state('app.ui', {
  //     url: '/ui',
  //     template: '<div ui-view></div>'
  //   })
  //   //ui/typography
  //   .state('app.ui.typography', {
  //     url: '/typography',
  //     controller: 'TypographyCtrl',
  //     templateUrl: 'static/views/tmpl/ui/typography.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/google-code-prettify/prettify.css',
  //           'static/scripts/vendor/google-code-prettify/sons-of-obsidian.css',
  //           'static/scripts/vendor/google-code-prettify/prettify.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //ui/lists
  //   .state('app.ui.lists', {
  //     url: '/lists',
  //     controller: 'ListsCtrl',
  //     templateUrl: 'static/views/tmpl/ui/lists.html'
  //   })
  //   //ui/buttons&icons
  //   .state('app.ui.buttons-icons', {
  //     url: '/buttons-icons',
  //     controller: 'ButtonsIconsCtrl',
  //     templateUrl: 'static/views/tmpl/ui/buttons-icons.html'
  //   })
  //   //ui/navs&accordions
  //   .state('app.ui.navs', {
  //     url: '/navs',
  //     controller: 'NavsCtrl',
  //     templateUrl: 'static/views/tmpl/ui/navs.html'
  //   })
  //   //ui/modals
  //   .state('app.ui.modals', {
  //     url: '/modals',
  //     controller: 'ModalsCtrl',
  //     templateUrl: 'static/views/tmpl/ui/modals.html'
  //   })
  //   //ui/tiles
  //   .state('app.ui.tiles', {
  //     url: '/tiles',
  //     controller: 'TilesCtrl',
  //     templateUrl: 'static/views/tmpl/ui/tiles.html'
  //   })
  //   //ui/portlets
  //   .state('app.ui.portlets', {
  //     url: '/portlets',
  //     controller: 'PortletsCtrl',
  //     templateUrl: 'static/views/tmpl/ui/portlets.html'
  //   })
  //   //ui/grid
  //   .state('app.ui.grid', {
  //     url: '/grid',
  //     controller: 'GridCtrl',
  //     templateUrl: 'static/views/tmpl/ui/grid.html'
  //   })
  //   //ui/widgets
  //   .state('app.ui.widgets', {
  //     url: '/widgets',
  //     controller: 'WidgetsCtrl',
  //     templateUrl: 'static/views/tmpl/ui/widgets.html'
  //   })
  //   //ui/alerts & notifications
  //   .state('app.ui.alerts', {
  //     url: '/alerts',
  //     controller: 'AlertsCtrl',
  //     templateUrl: 'static/views/tmpl/ui/alerts.html'
  //   })
  //   //ui/general
  //   .state('app.ui.general', {
  //     url: '/general',
  //     controller: 'GeneralCtrl',
  //     templateUrl: 'static/views/tmpl/ui/general.html'
  //   })
  //   //ui/tree
  //   .state('app.ui.tree', {
  //     url: '/tree',
  //     controller: 'TreeCtrl',
  //     templateUrl: 'static/views/tmpl/ui/tree.html'
  //   })
  //   //shop
  //   .state('app.shop', {
  //     url: '/shop',
  //     template: '<div ui-view></div>'
  //   })
  //   //shop/orders
  //   .state('app.shop.orders', {
  //     url: '/orders',
  //     controller: 'OrdersCtrl',
  //     templateUrl: 'static/views/tmpl/shop/orders.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/datatables/datatables.bootstrap.min.css',
  //           'static/scripts/vendor/datatables/Pagination/input.js',
  //           'static/scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //shop/products
  //   .state('app.shop.products', {
  //     url: '/products',
  //     controller: 'ProductsCtrl',
  //     templateUrl: 'static/views/tmpl/shop/products.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/datatables/datatables.bootstrap.min.css',
  //           'static/scripts/vendor/datatables/Pagination/input.js',
  //           'static/scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //shop/invoices
  //   .state('app.shop.invoices', {
  //     url: '/invoices',
  //     controller: 'InvoicesCtrl',
  //     templateUrl: 'static/views/tmpl/shop/invoices.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/datatables/datatables.bootstrap.min.css',
  //           'static/scripts/vendor/datatables/Pagination/input.js',
  //           'static/scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //shop/single-order
  //   .state('app.shop.single-order', {
  //     url: '/single-order',
  //     controller: 'SingleOrderCtrl',
  //     templateUrl: 'static/views/tmpl/shop/single-order.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/datatables/datatables.bootstrap.min.css',
  //           'static/scripts/vendor/datatables/Pagination/input.js',
  //           'static/scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //shop/single-product
  //   .state('app.shop.single-product', {
  //     url: '/single-product',
  //     controller: 'SingleProductCtrl',
  //     templateUrl: 'static/views/tmpl/shop/single-product.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/datatables/datatables.bootstrap.min.css',
  //           'static/scripts/vendor/datatables/Pagination/input.js',
  //           'static/scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js',
  //           'static/scripts/vendor/touchspin/jquery.bootstrap-touchspin.js',
  //           'static/scripts/vendor/touchspin/jquery.bootstrap-touchspin.css',
  //           'static/scripts/vendor/magnific/magnific-popup.css',
  //           'static/scripts/vendor/magnific/jquery.magnific-popup.min.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //shop/single-invoice
  //   .state('app.shop.single-invoice', {
  //     url: '/single-invoice',
  //     controller: 'SingleInvoiceCtrl',
  //     templateUrl: 'static/views/tmpl/shop/single-invoice.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/datatables/datatables.bootstrap.min.css',
  //           'static/scripts/vendor/datatables/Pagination/input.js',
  //           'static/scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //forms
  //   .state('app.forms', {
  //     url: '/forms',
  //     template: '<div ui-view></div>'
  //   })
  //   //forms/common
  //   .state('app.forms.common', {
  //     url: '/common',
  //     controller: 'FormsCommonCtrl',
  //     templateUrl: 'static/views/tmpl/forms/common.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/slider/bootstrap-slider.js',
  //           'static/scripts/vendor/touchspin/jquery.bootstrap-touchspin.js',
  //           'static/scripts/vendor/touchspin/jquery.bootstrap-touchspin.css',
  //           'static/scripts/vendor/filestyle/bootstrap-filestyle.min.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //forms/validate
  //   .state('app.forms.validate', {
  //     url: '/validate',
  //     controller: 'FormsValidateCtrl',
  //     templateUrl: 'static/views/tmpl/forms/validate.html'
  //   })
  //   //forms/wizard
  //   .state('app.forms.wizard', {
  //     url: '/wizard',
  //     controller: 'FormWizardCtrl',
  //     templateUrl: 'static/views/tmpl/forms/wizard.html'
  //   })
  //   //forms/upload
  //   .state('app.forms.upload', {
  //     url: '/upload',
  //     controller: 'FormUploadCtrl',
  //     templateUrl: 'static/views/tmpl/forms/upload.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/filestyle/bootstrap-filestyle.min.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //forms/imgcrop
  //   .state('app.forms.imgcrop', {
  //     url: '/imagecrop',
  //     controller: 'FormImgCropCtrl',
  //     templateUrl: 'static/views/tmpl/forms/imgcrop.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/filestyle/bootstrap-filestyle.min.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //tables
  //   .state('app.tables', {
  //     url: '/tables',
  //     template: '<div ui-view></div>'
  //   })
  //   //tables/bootstrap
  //   .state('app.tables.bootstrap', {
  //     url: '/bootstrap',
  //     controller: 'TablesBootstrapCtrl',
  //     templateUrl: 'static/views/tmpl/tables/bootstrap.html'
  //   })
  //   //tables/datatables
  //   .state('app.tables.datatables', {
  //     url: '/datatables',
  //     controller: 'TablesDatatablesCtrl',
  //     templateUrl: 'static/views/tmpl/tables/datatables.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/datatables/ColReorder/css/dataTables.colReorder.min.css',
  //           'static/scripts/vendor/datatables/ColReorder/js/dataTables.colReorder.min.js',
  //           'static/scripts/vendor/datatables/Responsive/dataTables.responsive.css',
  //           'static/scripts/vendor/datatables/Responsive/dataTables.responsive.js',
  //           'static/scripts/vendor/datatables/ColVis/css/dataTables.colVis.min.css',
  //           'static/scripts/vendor/datatables/ColVis/js/dataTables.colVis.min.js',
  //           'static/scripts/vendor/datatables/TableTools/css/dataTables.tableTools.css',
  //           'static/scripts/vendor/datatables/TableTools/js/dataTables.tableTools.js',
  //           'static/scripts/vendor/datatables/datatables.bootstrap.min.css'
  //         ]);
  //       }]
  //     }
  //   })
  //   //tables/uiGrid
  //   .state('app.tables.ui-grid', {
  //     url: '/ui-grid',
  //     controller: 'TablesUiGridCtrl',
  //     templateUrl: 'static/views/tmpl/tables/ui-grid.html'
  //   })
  //   //tables/ngTable
  //   .state('app.tables.ng-table', {
  //     url: '/ng-table',
  //     controller: 'TablesNgTableCtrl',
  //     templateUrl: 'static/views/tmpl/tables/ng-table.html'
  //   })
  //   //tables/smartTable
  //   .state('app.tables.smart-table', {
  //     url: '/smart-table',
  //     controller: 'TablesSmartTableCtrl',
  //     templateUrl: 'static/views/tmpl/tables/smart-table.html'
  //   })
  //   //tables/fooTable
  //   .state('app.tables.footable', {
  //     url: '/footable',
  //     controller: 'TablesFootableCtrl',
  //     templateUrl: 'static/views/tmpl/tables/footable.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/footable/dist/footable.all.min.js',
  //           'static/scripts/vendor/footable/css/footable.core.min.css'
  //         ]);
  //       }]
  //     }
  //   })
  //   //charts
  //   .state('app.charts', {
  //     url: '/charts',
  //     controller: 'ChartsCtrl',
  //     templateUrl: 'static/views/tmpl/charts.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/flot/jquery.flot.resize.js',
  //           'static/scripts/vendor/flot/jquery.flot.orderBars.js',
  //           'static/scripts/vendor/flot/jquery.flot.stack.js',
  //           'static/scripts/vendor/flot/jquery.flot.pie.js',
  //           'static/scripts/vendor/gaugejs/gauge.min.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //layouts
  //   .state('app.layouts', {
  //     url: '/layouts',
  //     template: '<div ui-view></div>'
  //   })
  //   //layouts/boxed
  //   .state('app.layouts.boxed', {
  //     url: '/boxed',
  //     controller: 'BoxedlayoutCtrl',
  //     templateUrl: 'static/views/tmpl/layouts/boxed.html',
  //     containerClass: 'boxed-layout'
  //   })
  //   //layouts/fullwidth
  //   .state('app.layouts.fullwidth', {
  //     url: '/fullwidth',
  //     controller: 'FullwidthlayoutCtrl',
  //     templateUrl: 'static/views/tmpl/layouts/fullwidth.html'
  //   })
  //   //layouts/sidebar-sm
  //   .state('app.layouts.sidebar-sm', {
  //     url: '/sidebar-sm',
  //     controller: 'SidebarsmlayoutCtrl',
  //     templateUrl: 'static/views/tmpl/layouts/sidebar-sm.html',
  //     containerClass: 'sidebar-sm-forced sidebar-sm'
  //   })
  //   //layouts/sidebar-xs
  //   .state('app.layouts.sidebar-xs', {
  //     url: '/sidebar-xs',
  //     controller: 'SidebarxslayoutCtrl',
  //     templateUrl: 'static/views/tmpl/layouts/sidebar-xs.html',
  //     containerClass: 'sidebar-xs-forced sidebar-xs'
  //   })
  //   //layouts/offcanvas
  //   .state('app.layouts.offcanvas', {
  //     url: '/offcanvas',
  //     controller: 'OffcanvaslayoutCtrl',
  //     templateUrl: 'static/views/tmpl/layouts/offcanvas.html',
  //     containerClass: 'sidebar-offcanvas'
  //   })
  //   //layouts/hz-menu
  //   .state('app.layouts.hz-menu', {
  //     url: '/hz-menu',
  //     controller: 'HzmenuCtrl',
  //     templateUrl: 'static/views/tmpl/layouts/hz-menu.html',
  //     containerClass: 'hz-menu'
  //   })
  //   //layouts/rtl-layout
  //   .state('app.layouts.rtl', {
  //     url: '/rtl',
  //     controller: 'RtlCtrl',
  //     templateUrl: 'static/views/tmpl/layouts/rtl.html',
  //     containerClass: 'rtl'
  //   })
  //   //maps
  //   .state('app.maps', {
  //     url: '/maps',
  //     template: '<div ui-view></div>'
  //   })
  //   //maps/vector
  //   .state('app.maps.vector', {
  //     url: '/vector',
  //     controller: 'VectorMapCtrl',
  //     templateUrl: 'static/views/tmpl/maps/vector.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/jqvmap/jqvmap/jquery.vmap.min.js',
  //           'static/scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.world.js',
  //           'static/scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.usa.js',
  //           'static/scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.europe.js',
  //           'static/scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.germany.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //maps/google
  //   .state('app.maps.google', {
  //     url: '/google',
  //     controller: 'GoogleMapCtrl',
  //     templateUrl: 'static/views/tmpl/maps/google.html'
  //   })
  //   //calendar
  //   .state('app.calendar', {
  //     url: '/calendar',
  //     controller: 'CalendarCtrl',
  //     templateUrl: 'static/views/tmpl/calendar.html'
  //   })
  //   //app core pages (errors, login,signup)
  //     .state('core', {
  //     abstract: true,
  //     url: '/core',
  //     template: '<div ui-view></div>'
  //   })
  //   //login
  //   .state('core.login', {
  //     url: '/login',
  //     controller: 'LoginController',
  //     controllerAs: 'vm',
  //     templateUrl: 'static/views/authentication-views/login.html'
  //   })
  //   //signup
  //   .state('core.signup', {
  //     url: '/signup',
  //     controller: 'SignupCtrl',
  //     templateUrl: 'static/views/tmpl/pages/signup.html'
  //   })
  //   //forgot password
  //   .state('core.forgotpass', {
  //     url: '/forgotpass',
  //     controller: 'ForgotPasswordCtrl',
  //     templateUrl: 'static/views/authentication-views/forgotpass.html'
  //   })
  //   //page 404
  //   .state('core.page404', {
  //     url: '/page404',
  //     templateUrl: 'static/views/authentication-views/page404.html'
  //   })
  //   //page 500
  //   .state('core.page500', {
  //     url: '/page500',
  //     templateUrl: 'static/views/authentication-views/page500.html'
  //   })
  //   //page offline
  //   .state('core.page-offline', {
  //     url: '/page-offline',
  //     templateUrl: 'static/views/authentication-views/page-offline.html'
  //   })
  //   //locked screen
  //   .state('core.locked', {
  //     url: '/locked',
  //     templateUrl: 'static/views/authentication-views/locked.html'
  //   })
  //   //example pages
  //   .state('app.pages', {
  //     url: '/pages',
  //     template: '<div ui-view></div>'
  //   })
  //   //gallery page
  //   .state('app.pages.gallery', {
  //     url: '/gallery',
  //     controller: 'GalleryCtrl',
  //     templateUrl: 'static/views/tmpl/pages/gallery.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/mixitup/jquery.mixitup.js',
  //           'static/scripts/vendor/magnific/magnific-popup.css',
  //           'static/scripts/vendor/magnific/jquery.magnific-popup.min.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //timeline page
  //   .state('app.pages.timeline', {
  //     url: '/timeline',
  //     controller: 'TimelineCtrl',
  //     templateUrl: 'static/views/tmpl/pages/timeline.html'
  //   })
  //   //chat page
  //   .state('app.pages.chat', {
  //     url: '/chat',
  //     controller: 'ChatCtrl',
  //     templateUrl: 'static/views/tmpl/pages/chat.html'
  //   })
  //   //search results
  //   .state('app.pages.search-results', {
  //     url: '/search-results',
  //     controller: 'SearchResultsCtrl',
  //     templateUrl: 'static/views/tmpl/pages/search-results.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/slider/bootstrap-slider.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   //profile page
  //   .state('app.pages.profile', {
  //     url: '/profile/:username',
  //     controller: 'AccountSettingsController',
  //     controllerAs: 'vm',
  //     templateUrl: 'static/views/authentication-views/profile.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/filestyle/bootstrap-filestyle.min.js'
  //         ]);
  //       }]
  //     }
  //   })
  //   .state('app.pages.company-profile', {
  //     url: '/company/:companyId',
  //     controller: 'CompanySettingsController',
  //     controllerAs: 'vm',
  //     templateUrl: 'static/views/authentication-views/company-profile.html',
  //     resolve: {
  //       plugins: ['$ocLazyLoad', function($ocLazyLoad) {
  //         return $ocLazyLoad.load([
  //           'static/scripts/vendor/filestyle/bootstrap-filestyle.min.js'
  //         ]);
  //       }]
  //     }
  //   })    
  //   //documentation
  //   .state('app.help', {
  //     url: '/help',
  //     controller: 'HelpCtrl',
  //     templateUrl: 'static/views/tmpl/help.html'
  //   });
  // }]);


(function () {
  'use strict';

  angular
    .module('accounts', [
      'accounts.controllers',
      'accounts.services',
      'accounts.directives'
    ]);

  angular
    .module('accounts.controllers', []);

  angular
    .module('accounts.services', []);

  angular
    .module('accounts.directives', []);
})();

(function () {
  'use strict';

  angular
    .module('authentication', [
      'authentication.controllers',
      'authentication.services'
    ]);

  angular
    .module('authentication.controllers', []);

  angular
    .module('authentication.services', ['ngCookies']);
})();
(function () {
  'use strict';

  angular
    .module('layout', [
      'layout.controllers', 
      'layout.services',
      'layout.directives',
    ]);

  angular
    .module('layout.controllers', []);

  angular
    .module('layout.services', []);  

  angular
    .module('layout.directives', []);
})();
(function () {
  'use strict';

  angular
    .module('orders', [
      'orders.controllers',
      'orders.services',
      'orders.directives'
    ]);

  angular
    .module('orders.controllers', []);

  angular
    .module('orders.services', []);

  angular
    .module('orders.directives', []);
})();
/**
* LoginController
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use static';

  angular
    .module('authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace LoginController
  */
  function LoginController($location, $scope, Authentication) {
    var vm = this;

    vm.login = login;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thinkster.authentication.controllers.LoginController
    */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      }
    }

    /**
    * @name login
    * @desc Log the user in
    * @memberOf thinkster.authentication.controllers.LoginController
    */
    function login() {
      Authentication.login(vm.email, vm.password);
    }
  }
})();

/**
 * Register controller
 * @namespace thinkster.authentication.controllers
 */
(function () {
  'use strict';

  angular
    .module('authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', '$scope', 'Authentication'];

  /**
   * @namespace RegisterController
   */
  function RegisterController($location, $scope, Authentication) {
    var vm = this;

    vm.register = register;

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf thinkster.authentication.controllers.RegisterController
     */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        console.log("AUTH");
        // $location.url('/');
      }
    }

    /**
     * @name register
     * @desc Register a new user
     * @memberOf thinkster.authentication.controllers.RegisterController
     */
    function register() {
      Authentication.register(vm.username, vm.email, vm.first_name, vm.last_name, vm.password, vm.confirm_password);
    }
  }
})();

/**
 * Authentication
 * @namespace thinkster.authentication.services
 */
(function () {
  'use strict';

  angular
    .module('authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http', 'toastr'];

  /**
   * @namespace Authentication
   * @returns {Factory}
   */
  function Authentication($cookies, $http, toastr) {
    /**
     * @name Authentication
     * @desc The Factory to be returned
     */
    var Authentication = {
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      login: login,
      logout: logout,
      register: register,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate
    };

    return Authentication;

    ///////////////////

    /**
     * @name getAuthenticatedAccount
     * @desc Return the currently authenticated account
     * @returns {object|undefined} Account if authenticated, else `undefined`
     * @memberOf thinkster.authentication.services.Authentication
     */
    function getAuthenticatedAccount() {
      if (!$cookies.authenticatedAccount) {
        return;
      }

      return JSON.parse($cookies.authenticatedAccount);
    }


    /**
     * @name isAuthenticated
     * @desc Check if the current user is authenticated
     * @returns {boolean} True is user is authenticated, else false.
     * @memberOf thinkster.authentication.services.Authentication
     */
    function isAuthenticated() {
      console.log(!!$cookies.authenticatedAccount);
      return !!$cookies.authenticatedAccount;
    }


    /**
     * @name login
     * @desc Try to log in with email `email` and password `password`
     * @param {string} email The email entered by the user
     * @param {string} password The password entered by the user
     * @returns {Promise}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function login(email, password) {
      return $http.post('/api/v1/auth/login/', {
        email: email, password: password
      }).then(loginSuccessFn, loginErrorFn);

      /**
       * @name loginSuccessFn
       * @desc Set the authenticated account and redirect to index
       */
      function loginSuccessFn(data, status, headers, config) {
        Authentication.setAuthenticatedAccount(data.data);
        window.location = '#/dashboard';
      }

      /**
       * @name loginErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function loginErrorFn(data, status, headers, config) {
        console.error('Epic failure!');
      }
    }


    /**
     * @name logout
     * @desc Try to log the user out
     * @returns {Promise}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function logout() {
      return $http.post('/api/v1/auth/logout/')
        .then(logoutSuccessFn, logoutErrorFn);

      /**
       * @name logoutSuccessFn
       * @desc Unauthenticate and redirect to index with page reload
       */
      function logoutSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();

        window.location = '#/core/login';
      }

      /**
       * @name logoutErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function logoutErrorFn(data, status, headers, config) {
        console.error('Epic failure!');
      }
    }


    /**
    * @name register
    * @desc Try to register a new user
    * @param {string} email The email entered by the user
    * @param {string} password The password entered by the user
    * @param {string} username The username entered by the user
    * @returns {Promise}
    * @memberOf thinkster.authentication.services.Authentication
    */
    function register(username, email, first_name, last_name, password, confirm_password) {
      return $http.post('/api/v1/accounts/', {
        username: username,
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: password,
        confirm_password: confirm_password
      }).then(registerSuccessFn, registerErrorFn);

      /**
      * @name registerSuccessFn
      * @desc Log the new user in
      */
      function registerSuccessFn(data, status, headers, config) {
        toastr.success('New user has been created');
      }

      /**
      * @name registerErrorFn
      * @desc Log "Epic failure!" to the console
      */
      function registerErrorFn(data, status, headers, config) {
        toastr.error('There was an issue creating this user');
        console.error('Epic failure!');
      }
    }


    /**
     * @name setAuthenticatedUser
     * @desc Stringify the account object and store it in a cookie
     * @param {Object} account The acount object to be stored
     * @returns {undefined}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function setAuthenticatedAccount(account) {
      $cookies.authenticatedAccount = JSON.stringify(account);
      console.log($cookies.authenticatedAccount);
    }


    /**
     * @name unauthenticate
     * @desc Delete the cookie where the account object is stored
     * @returns {undefined}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function unauthenticate() {
      delete $cookies.authenticatedAccount;
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('accounts.controllers')
    .controller('AccountController', AccountController);

  AccountController.$inject = [
    '$scope', '$state', '$stateParams', 'Authentication', 'Account', 'Company','toastr',
  ];

  function AccountController($scope, $state, $stateParams, Authentication, Account, Company, toastr) {
    var vm = this;

    vm.destroy = destroy;
    vm.update = update;

    vm.username = $stateParams.username;

    activate();

    $scope.page = {
      title: 'Profile Page',
    };

    // activate function to initialize on page/controller load
    function activate() {

      // GET Account with success/error callbacks
      Account.get(vm.username)
        .then(accountSuccessFn)
        .catch(accountErrorFn);

      function accountSuccessFn(data, status, headers, config) {
        vm.account = data.data;  
        console.log(vm.account); 
        // GET company details of user with success/error callbacks
        Company.get(vm.account.user_company)
          .then(companySuccessFn)
          .catch(companyErrorFn);   
      }

      function accountErrorFn(data, status, headers, config) {
        $state.go('app.dashboard');
        toastr.error('That user does not exist.');
      }

      // GET company details success/error callbacks
      function companySuccessFn(data, status, headers, config) {
        console.log(data.data);
        vm.company = data.data;
      }

      function companyErrorFn(data, status, headers, config) {
        console.log(data.data);
        $state.go('app.dashboard');
        toastr.error('That company does not exist.');
      }
    }

    // Destroy Account with success/error callbacks
    function destroy() {
      Account.destroy(vm.account.username)
        .then(destroySuccessFn)
        .catch(destroyErrorFn);

      function destroySuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();
        $state.go('app.dashboard');
        toastr.warning('Your account has been deleted.');
      }

      function destroyErrorFn(data, status, headers, config) {
        toastr.error(data.error);
      }
    }

    // Update Account with success/error callbacks
    function update() {
      
      Account.update(vm.username, vm.account)
        .then(updateSuccessFn)
        .catch(updateErrorFn);

      function updateSuccessFn(data, status, headers, config) {
        toastr.success('Your account has been updated.');
      }

      function updateErrorFn(data, status, headers, config) {
        toastr.error(data.error);
      }
    }
  };
})();

(function () {
  'use strict';

  angular
    .module('accounts.controllers')
    .controller('AddressController', AddressController);

  AddressController.$inject = [
    '$scope', '$location', '$stateParams', '$log', 'Authentication', 'Account', 'Company', 'Requests', 'toastr',
  ];

  function AddressController($scope, $location, $stateParams, $log, Authentication, Account, Company, Requests, toastr) {
    var vm = this;

    // activate();

    function activate() {
        // var authenticatedAccount = Authentication.getAuthenticatedAccount();
        // var goodId = $stateParams.goodId;
        // console.log(authenticatedAccount);
        // if (!authenticatedAccount) {
        //     $location.url('/login');
        //     toastr.error('You are not authorized to view this page.');
        // } 
      // else {
      //   // Redirect if logged in, but not the owner of this account.
      //   if (authenticatedAccount) {
      //       // debugger;
      //       $location.url('/');
      //     // toastr.error('You are not authorized to view this page.');
      //     // console.log("2");
      //   }
      // }

        // Requests.getDetails(goodId).then(detailsSuccess, detailsError);

        // function detailsSuccess(data, status, headers, config) {
        //     vm.details = data;
        //     console.log("Details");
        //     console.log(vm.details);      
        // }

        // function detailsError(errorMsg) {
        //     $location.url('/dashboard');
        //     toastr.error('Your request can not be processed '+errorMsg+'');
        // }

        // Company.get(authenticatedAccount.user_company).then(companySuccess).catch(companyError);
        
        // function companySuccess(data, status, headers, config) {
        //     vm.company = data;
        //     console.log("company");
        //     console.log(vm.company);      
        // }

        // function companyError(errorMsg) {
        //     $location.url('/dashboard');
        //     toastr.error('Your request can not be processed '+errorMsg+'');
        // }
    }

    // function getRequest(orderId, reqId){

      // Requests.get(orderId, reqId).then(getReqSuccess).catch(getReqError);
    // }

    // vm.addReq = function (){
    //     console.log("Req Data");
    //     console.log(vm.newReq);
    //     console.log("good Deet");
    //     console.log(vm.details);
    //     for(var item in vm.details){
    //         console.log(vm.details[item].good);
    //     }
    //     console.log(vm.details[item].good);
    //     var par = vm.details[item].good.replace(/domain: | family: | subfamily: |' '/g,'');
    //     console.log(par);
    //     var news = par.split(',');
    //     console.log(news);
    //     vm.newReq['good'] = news;
    //     console.log("Req Data 2");
    //     console.log(vm.newReq);
    //     Requests.createReq(vm.newReq)
    //         .then(addReqSuccess)
    //         .catch(addReqError);
    // };

    // function addReqSuccess (data){
    //     $log.info(data);
    //     $location.path('#/app/orders/order/'+data+'');
    // }

    // function addReqError (errorMsg){
    //     $log.error(errorMsg);

    // }

    // function destroy() {
    //   Request.destroy(vm.account.username).then(accountSuccessFn, accountErrorFn);

    //   function accountSuccessFn(data, status, headers, config) {
    //     Authentication.unauthenticate();
    //     window.location = '/';
    //     toastr.warning('Your account has been deleted.');
    //     console.log("5");
    //   }

    //   function accountErrorFn(data, status, headers, config) {
    //     toastr.error(data.error);
    //     console.log("6");
    //   }
    // }

    // function update() {
    //   var username = $stateParams.username;

    //   Account.update(username, vm.account).then(accountSuccessFn, accountErrorFn);

    //   function accountSuccessFn(data, status, headers, config) {
    //     toastr.success('Your account has been updated.');
    //   }

    //   function accountErrorFn(data, status, headers, config) {
    //     toastr.error(data.error);
    //   }
  }
})();

(function () {
  'use strict';

  angular
    .module('accounts.controllers')
    .controller('CompanySettingsController', CompanySettingsController);

  CompanySettingsController.$inject = [
    '$scope', '$location', '$stateParams', 'Authentication', 'Company', 'toastr',
  ];

  /**
   * @namespace AccountSettingsController
   */
  function CompanySettingsController($scope, $location, $stateParams, Authentication, Company, toastr) {
    var vm = this;

    vm.destroy = destroy;
    vm.update = update;

    activate();

    $scope.page = {
      title: 'Profile Page',
    };

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated.
     * @memberOf thinkster.accounts.controllers.AccountSettingsController
     */
    function activate() {
      var authenticatedAccount = Authentication.getAuthenticatedAccount();
      // var username = $stateParams.username;
      console.log("AuthAcct Comp");
      console.log(authenticatedAccount);

      var companyId = $stateParams.companyId;
      console.log("companyId");
      console.log(companyId);
      // Redirect if not logged in
      if (!authenticatedAccount) {
        $location.url('/login');
        toastr.error('You are not authorized to view this page.');

      } 
      // else {
      //   // Redirect if logged in, but not the owner of this account.
      //   if (authenticatedAccount) {
      //       // debugger;
      //       $location.url('/');
      //     // toastr.error('You are not authorized to view this page.');
      //     // console.log("2");
      //   }
      // }

      Company.get(companyId).then(companySuccessFn, companyErrorFn);

      /**
       * @name accountSuccessFn
       * @desc Update `account` for view
       */
      function companySuccessFn(data, status, headers, config) {
        console.log("COMP Success");
        vm.company = data.data;     
        console.log(vm.company); 
      }

      /**
       * @name accountErrorFn
       * @desc Redirect to index
       */
      function companyErrorFn(data, status, headers, config) {
        $location.url('/dashboard');
        toastr.error('That user does not exist.');
        console.log("COMP ERROR");
      }
    }


    /**
     * @name destroy
     * @desc Destroy this account
     * @memberOf thinkster.accounts.controllers.AccountSettingsController
     */
    function destroy() {
      Company.destroy(vm.company.id).then(companySuccessFn, companyErrorFn);

      /**
       * @name accountSuccessFn
       * @desc Redirect to index and display success snackbar
       */
      function companySuccessFn(data, status, headers, config) {
        // Authentication.unauthenticate();
        window.location = ('/dashboard');
        toastr.warning('Your company has been deleted.');
        console.log("COMP DESTROY NEED TO DESTROY>>>");
      }


      /**
       * @name accountErrorFn
       * @desc Display error snackbar
       */
      function companyErrorFn(data, status, headers, config) {
        toastr.error(data.error);
        console.log("6");
      }
    }


    /**
     * @name update
     * @desc Update this account
     * @memberOf thinkster.accounts.controllers.AccountSettingsController
     */
    function update() {
      var companyId = $stateParams.companyId;

      Company.update(companyId, vm.company).then(companySuccessFn, companyErrorFn);
      console.log("COMP UPDATE");
      /**
       * @name accountSuccessFn
       * @desc Show success snackbar
       */
      function companySuccessFn(data, status, headers, config) {
        toastr.success('Your account has been updated.');
        console.log("COMP UPDATE SUCCESS");
        $location.url('/app/pages/company-profile/'+companyId+'/'); 
      }


      /**
       * @name accountErrorFn
       * @desc Show error snackbar
       */
      function companyErrorFn(data, status, headers, config) {
        toastr.error(data.error);
      }
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('accounts.directives')
    .directive('address', address);

  function address() {

	var directive = {
		// replace: true,
		// transclude:true,
    controller: 'RequestController',
    controllerAs: 'vm',
		restrict: 'E',
		scope: {
			req: '=',
      comp: '=',
      newreq: '=',
		},
        templateUrl: '/static/views/directives/address-directive.html',
	}

    return directive;
  }

})();

(function () {
  'use strict';

  angular
    .module('accounts.services')
    .factory('Account', Account);

  Account.$inject = ['$http'];

  /**
   * @namespace Account
   */
  function Account($http) {
    /**
     * @name Account
     * @desc The factory to be returned
     * @memberOf thinkster.accounts.services.Account
     */
    var Account = {
      destroy: destroy,
      get: get,
      update: update
    };

    return Account;

    /////////////////////

    /**
     * @name destroy
     * @desc Destroys the account with username `username`
     * @param {string} username The username of the account to be destroyed
     * @returns {Promise}
     * @memberOf thinkster.accounts.services.Account
     */
    function destroy(username) {
      return $http.delete('/api/v1/accounts/' + username + '/');
    }


    /**
     * @name get
     * @desc Gets the account with username `username`
     * @param {string} username The username of the account to get
     * @returns {Promise}
     * @memberOf thinkster.accounts.services.Account
     */
    function get(username) {
      return $http.get('/api/v1/accounts/' + username + '/');
    }


    /**
     * @name update
     * @desc Update the account with username `username`
     * @param {string} username The username of the account to be updated
     * @param {Object} account The updated account model
     * @returns {Promise}
     * @memberOf thinkster.accounts.services.Account
     */
    function update(username, account) {
      return $http.put('/api/v1/accounts/' + username + '/', account);
    }    

  }
})();


(function () {
  'use strict';

  angular
    .module('accounts.services')
    .factory('Company', Company);

  Company.$inject = ['$http'];

  /**
   * @namespace Account
   */
  function Company($http) {
    /**
     * @name Account
     * @desc The factory to be returned
     * @memberOf thinkster.accounts.services.Account
     */
    var Company = {
      destroy: destroy,
      get: get,
      update: update
    };

    return Company;

    /////////////////////

    /**
     * @name destroy
     * @desc Destroys the account with username `username`
     * @param {string} username The username of the account to be destroyed
     * @returns {Promise}
     * @memberOf thinkster.accounts.services.Account
     */
    function destroy(companyId) {
      return $http.delete('/api/v1/companies/' + companyId + '/');
    }


    /**
     * @name get
     * @desc Gets the account with username `username`
     * @param {string} username The username of the account to get
     * @returns {Promise}
     * @memberOf thinkster.accounts.services.Account
     */
    function get(companyId) {
      return $http.get('/api/v1/companies/' + companyId + '/');
    }


    /**
     * @name update
     * @desc Update the account with username `username`
     * @param {string} username The username of the account to be updated
     * @param {Object} account The updated account model
     * @returns {Promise}
     * @memberOf thinkster.accounts.services.Account
     */
    function update(companyId, company) {
      return $http.put('/api/v1/companies/' + companyId + '/', company);
    }      

  }
})();
(function () {
  'use strict';

  angular
    .module('orders.directives')
    .directive('addReq', addReq);

  function addReq() {

	var directive = {
		// replace: true,
		// transclude:true,
    controller: 'AddRequestController',
    controllerAs: 'vm',
		restrict: 'E',
		scope: {
			req: '=',
      comp: '=',
		},
        templateUrl: '/static/views/directives/addreq-directive.html',
	}

    return directive;
  }

})();

'use strict';

angular.module('minovateApp')
    .directive('format', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
  
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue);
            });

            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+]/g, '');
                elem.val($filter('number')(plainNumber/100,2));
                return plainNumber;
            });
        }
    };
}]);
'use strict';

angular.module('minovateApp')
	.directive('datepickerPopup', function (){
	  return {
	    restrict: 'EAC',
	    require: 'ngModel',
	    link: function(scope, element, attr, controller) {
	      //remove the default formatter from the input directive to prevent conflict
	      controller.$formatters.shift();
	    }
	  }
	});
(function () {
  'use strict';

  angular
    .module('orders.directives')
    .directive('editReq', editReq);

  function editReq() {

	var directive = {
		// replace: true,
		// transclude:true,
    controller: 'EditRequestController',
    controllerAs: 'vm',
		restrict: 'E',
		scope: {
			req: '=',
      comp: '=',
		},
        templateUrl: '/static/views/directives/editreq-directive.html',
	}

    return directive;
  }

})();
(function () {
  'use strict';

  angular
    .module('orders.directives')
    .directive('newReq', newReq);

  function newReq() {

	var directive = {
		// replace: true,
		// transclude:true,
    controller: 'RequestController',
    controllerAs: 'vm',
		restrict: 'E',
		scope: {
			req: '=',
      comp: '=',
		},
        templateUrl: '/static/views/directives/newreq-directive.html',
	}

    return directive;
  }

})();
(function () {
  'use strict';

  angular
    .module('orders.controllers')
    .controller('OfferController', OfferController);

  OfferController.$inject = [
    '$scope', '$filter', '$state', '$stateParams', '$log', '$cookies', 'Authentication', 'Account', 'Company', 'Order', 'toastr',
  ];

  function OfferController($scope, $filter, $state, $stateParams, $log, $cookies, Authentication, Account, Company, Order, toastr) {

    var vm = this;
 
    vm.orderId = $stateParams.orderId;

    vm.offer = {};
    vm.offer.offer_item = [];
    vm.offer.blank_item = [];

    activate();

    $scope.page = {
      title: 'Offer',
    };

    $scope.stati = {

      'WRQ':'text-cyan',
      'PEN':'text-warning',
      'OFR':'text-drank',
      'VAL':'text-greensea',
      'REF':'text-lightred',
      'APV':'text-success',
      'COM':'text-amethyst',
      'CAN':'text-red',
      'ARC':'text-darkgray',

      
      // WAITING_REQUEST = 'WRQ'
      // PENDING = 'PEN'
      // OFFER = 'OFR'
      // VALIDATED = 'VAL'
      // REFUSED = 'REF'
      // APPROVED = 'APV'
      // COMPLETED = 'COM'
      // INVOICED = 'INV'
      // CANCELED = 'CAN' 
      // ARCHIVED = 'ARC'   
      // REQUEST_SUBMITTED = 'RSB'
      // APPROVE_REQUEST = 'APR'
      // APPROVE_OFFER = 'APO'
      // APPROVAL_NEEDED = 'APN'
      // OFFER_SUBMITTED = 'OSB'
      // NOT_APPROVED = 'NAP'
      // RETURNED = 'RET'
      // IN_PROGRESS = 'INP'
      // BACKORDER = 'BOR'
    }


    function activate() {
        var authenticatedAccount = Authentication.getAuthenticatedAccount();
        
        console.log(authenticatedAccount);
        if (!authenticatedAccount) {
            $state.go('core.login');
            toastr.error('You are not authorized to view this page.');
        } 
      // else {
      //   // Redirect if logged in, but not the owner of this account.
      //   if (authenticatedAccount) {
      //       // debugger;
      //       $location.url('/');
      //     // toastr.error('You are not authorized to view this page.');
      //     // console.log("2");
      //   }
      // }
        
        console.log(vm.orderId);

        Order.getOrder(vm.orderId).then(getOrderSuccess).catch(getOrderError);

        function getOrderSuccess(data, status, headers, config) {
          vm.order = data;
          console.log(vm.order);
        }

        function getOrderError(errorMsg) {
            $state.go('app.dashboard');
            toastr.error('Your request can not be processed '+errorMsg+'');          
        }
    }
    console.log(vm.offer);

     vm.addItem = function (req_item){
        console.log(req_item);
        req_item.item_sub_total = req_item.quantity*req_item.price;
        // console.log(vm.req_item);
        // console.log(vm.offer.offer_item);
        // if(vm.offer.offer_item.length == 0){
        //     var leng = vm.offer.offer_item.length+=vm.order.req_order.length;
        // } else {
        // var leng = vm.offer.offer_item.length;
        // }
        // console.log(leng);
        // vm.offer.offer_item.push(req_item)
        // vm.offer.offer_item.push({
        //     item_name:req_item.item_name,
        //     item_details:req_item.item_details,
        //     quantity:blank_item.quantity,
        //     rate:blank_item.rate            
        // })
        // angular.forEach(vm.req_item, function(k, v, obj){
        //     console.log(k);
        //     console.log(v);
        //     console.log(obj);
        //     console.log(obj.item_name);
        //     console.log(obj.item_details);
        //     vm.offer.offer_item.item_name = obj.item_name;
        //     vm.offer.offer_item.item_details = obj.item_details;
        // })
        // vm.offer.offer_item.item_name = req_item.item_name,
        // vm.offer.offer_item.item_details = req_item.item_details,
        console.log(req_item);
        console.log(vm.offer);
        getTotal(req_item.item_sub_total);
        // vm.req_item = {};
    };

    vm.addBlankItem = function (blank_item){
        console.log(vm.offer.blank_item);
        console.log(blank_item);
        // if(blank_item.quantity&&blank_item.rate){
        blank_item.item_sub_total = blank_item.quantity*blank_item.price;
        // };
        console.log(blank_item);
        // console.log(vm.order.req_order.length);
        // if(vm.offer.offer_item.length === 0){
        //     vm.offer.offer_item.length+=vm.order.req_order.length;
        // } else {
        //     vm.offer.offer_item.length;
        // }
        // console.log(leng);
        // console.log(vm.offer.offer_item);
        // vm.offer.offer_item.splice(leng, blank_item);
        vm.offer.blank_item.push(blank_item);
        // vm.offer.offer_item.push({
        //     item_name:blank_item.item_name,
        //     item_details:blank_item.item_details,
        //     quantity:blank_item.quantity,
        //     rate:blank_item.rate
        // })
        vm.blank_item = {};
        console.log(vm.offer);
        getTotal(blank_item.item_sub_total);
    }

    function getTotal(item){
        console.log(vm.offer.blank_item);
        console.log(vm.offer.offer_item);
        console.log(item);
        if(vm.offer.offer_total){
            vm.offer['offer_total'] = vm.offer.offer_total += item;
        }else{
            vm.offer['offer_total'] = item;
        }
        console.log(vm.offer.offer_total);
        console.log(vm.offer);
    };

    vm.addOffer = function (){
        console.log(vm.offer);
        vm.offer['order'] = vm.orderId
        angular.forEach(vm.offer.blank_item, function (value, prop, obj) {
            console.log(value); 
            console.log(prop); 
            console.log(obj);
            vm.offer.offer_item.push(value);
        });
        console.log(vm.offer);
        Order.createOffer(vm.orderId, vm.offer)
            .then(addOfferSuccess)
            .catch(addOfferError);
    };

    function addOfferSuccess (data){
        $log.info(data);
        $state.go('app.orders.order', {orderId:vm.orderId})  
    }

    function addOfferError (errorMsg){
        $log.error(errorMsg);
    }
  }

})();

'use strict';

angular.module('minovateApp')
  .controller('AddReqModalCtrl', function ($scope, $modal, $log, $localStorage) {
    var vm = this;

    $scope.items = $localStorage.goods;

    $scope.open = function(size) {

      var modalInstance = $modal.open({
        templateUrl: 'static/views/modals/addreq-modal.html',
        controller: 'ModalInstanceCtrl',
        scope: $scope,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  })

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.

  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })

  .controller('ReqItemModalCtrl', function ($scope, $modal, $log, $localStorage) {
    var vm = this;

    $scope.items = $localStorage.goods;

    $scope.open = function(size) {

      var modalInstance = $modal.open({
        templateUrl: 'static/views/modals/reqitem-modal.html',
        controller: 'ModalInstanceCtrl',
        scope: $scope,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  })

  .controller('OfferReqItemModalCtrl', function ($scope, $modal, $log, $localStorage) {
    var vm = this;
  
    $scope.isCollapsed = true;
    $scope.items = $localStorage.goods;

    $scope.open = function(size) {

      var modalInstance = $modal.open({
        templateUrl: 'static/views/modals/offeritem-modal.html',
        controller: 'ModalInstanceCtrl',
        scope: $scope,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

  })

  .controller('OfferBlankItemModalCtrl', function ($scope, $modal, $log, $localStorage) {
    var vm = this;
  
    $scope.items = $localStorage.goods;

    $scope.open = function(size) {

      var modalInstance = $modal.open({
        templateUrl: 'static/views/modals/offeritem-blank-modal.html',
        controller: 'ModalInstanceCtrl',
        scope: $scope,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

  })  

  .controller('OfferApvlModalCtrl', function ($scope, $modal, $log) {
    var vm = this;
  
    $scope.items = [];

    $scope.open = function(size, type) {
      console.log(type);
      $scope.type = type;

      var modalInstance = $modal.open({
        templateUrl: 'static/views/modals/offerapvl-modal.html',
        controller: 'ModalInstanceCtrl',
        scope: $scope,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

  });  
(function () {
  'use strict';

  angular
    .module('orders.controllers')
    .controller('OrderController', OrderController);

  OrderController.$inject = [
    '$scope', '$location', '$stateParams', '$state', '$log', 'Authentication', 'Account', 'Company', 'Order', 'toastr',
  ];

  function OrderController($scope, $location, $stateParams, $state, $log, Authentication, Account, Company, Order, toastr) {
    var vm = this;

    activate();

    $scope.page = {
      title: 'Order',
    };

    $scope.stati = {

      'WRQ':'text-cyan',
      'PEN':'text-warning',
      'OFR':'text-drank',
      'VAL':'text-greensea',
      'REF':'text-lightred',
      'APV':'text-success',
      'COM':'text-amethyst',
      'CAN':'text-red',
      'ARC':'text-darkgray',

      // WAITING_REQUEST = 'WRQ'
      // PENDING = 'PEN'
      // OFFER = 'OFR'
      // VALIDATED = 'VAL'
      // REFUSED = 'REF'
      // APPROVED = 'APV'
      // COMPLETED = 'COM'
      // INVOICED = 'INV'
      // CANCELED = 'CAN' 
      // ARCHIVED = 'ARC'   
      // REQUEST_SUBMITTED = 'RSB'
      // APPROVE_REQUEST = 'APR'
      // APPROVE_OFFER = 'APO'
      // APPROVAL_NEEDED = 'APN'
      // OFFER_SUBMITTED = 'OSB'
      // NOT_APPROVED = 'NAP'
      // RETURNED = 'RET'
      // IN_PROGRESS = 'INP'
      // BACKORDER = 'BOR'
    }

    function activate() {
      var authenticatedAccount = Authentication.getAuthenticatedAccount();
      var orderId = $stateParams.orderId;

      // if (!authenticatedAccount) {
      //   $state.go('core.login');
      //   toastr.error('You are not authorized to view this page.');
      // } 
      // else {
      //   // Redirect if logged in, but not the owner of this account.
      //   if (authenticatedAccount) {
      //       // debugger;
      //       $location.url('/');
      //     // toastr.error('You are not authorized to view this page.');
      //     // console.log("2");
      //   }
      // }

      Order.getOrder(orderId).then(getOrderSuccess, getOrderError);

      function getOrderSuccess(data, status, headers, config) {
        vm.order = data;
        console.log(vm.order);      
      }

      function getOrderError(errorMsg) {
        $state.go('app.dashboard');
        toastr.error('Your request can not be processed '+errorMsg+'');
      }
    }

    vm.offerApvl = function(status){
      console.log(status);
      var stat={};
      stat.offer = vm.order.offer_order[0].id;
      stat.order_status = status;
      stat.company_approval_status = status;
      console.log(stat);
      console.log(vm.order.id);
      Order.updateOrderStatus(vm.order.id, stat)
        .then(updateOrderStatusSuccess)
        .catch(updateOrderStatusError);
    }

    function updateOrderStatusSuccess(data, status, headers, config) {
      console.log(data);
      toastr.info('Your response has been sent to Optiz.');   
    }

    function updateOrderStatusError(errorMsg) {
      // $state.go('app.dashboard');
      toastr.error('Your request can not be processed '+errorMsg+'');
    }

  }
})();

// 'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ShopOrdersCtrl
 * @description
 * # ShopOrdersCtrl
 * Controller of the minovateApp
 */
// angular.module('minovateApp')
//   .controller('OrdersCtrl', function ($scope) {
//     $scope.page = {
//       title: 'Orders',
//       subtitle: 'Place subtitle here...'
//     };
//   })

//   .controller('OrdersTableCtrl', function ($scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource) {

//     var vm = this;
//     vm.orders = [];
//     vm.dtOptions = DTOptionsBuilder.newOptions()
//       .withBootstrap()
//       .withOption('order', [[1, 'asc']])
//       .withDOM('<"row"<"col-md-8 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"pull-right"f>>>t<"row"<"col-md-4 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"inline-controls text-center"i>><"col-md-4 col-sm-12"p>>')
//       .withLanguage({
//         "sLengthMenu": 'View _MENU_ records',
//         "sInfo":  'Found _TOTAL_ records',
//         "oPaginate": {
//           "sPage":    "Page",
//           "sPageOf":  "of"
//         }
//       })
//       .withPaginationType('input')
      //.withScroller()
      //.withOption("sScrollY", false)
      //.withOption("sScrollX")
  //     .withColumnFilter();


  //   vm.dtColumnDefs = [
  //     DTColumnDefBuilder.newColumnDef(0).notSortable(),
  //     DTColumnDefBuilder.newColumnDef(8).notSortable()
  //   ];

  //   vm.selectedAll = false;

  //   vm.selectAll = function () {

  //     if ($scope.selectedAll) {
  //       $scope.selectedAll = false;
  //     } else {
  //       $scope.selectedAll = true;
  //     }

  //     angular.forEach(vm.orders, function(order) {
  //       order.selected = $scope.selectedAll;
  //     });
  //   };

  //   $resource('http://www.filltext.com/?rows=300&id={index}&date={date|01-01-2012,01-01-2015}&placedby={firstName}~{lastName}&status=["pending","closed","sent","cancelled"]&quantity={number|20}&total={numberLength|3}}&shipto={streetAddress}~{city}&selected=false&pretty=true').query().$promise.then(function(orders) {
  //     vm.orders = orders;
  //   });

  // });




(function () {
  'use strict';

  angular
    .module('orders.controllers')
    .controller('OrdersController', OrdersController);

  OrdersController.$inject = [
    '$scope', '$stateParams', '$log', 'Authentication', 'Account', 'Company', 'Order', 'toastr'
  ];

  function OrdersController($scope, $stateParams, $log, Authentication, Account, Company, Order, toastr) {
    var vm = this;

    activate();

    $scope.page = {
      title: 'Orders',
    };

    // $scope.stati = {

    //   'WQR':'text-slategray',
    //   'PEN':'text-orange',
    //   'OFR':'text-drank',
    //   'VAL':'text-greensea',
    //   'REF':'text-lightred',
    //   'APV':'text-success',
    //   'COM':'text-primary',
    //   'CAN':'text-red',
    //   'ARC':'text-darkgray',

      
      // WAITING_REQUEST = 'WRQ'
      // PENDING = 'PEN'
      // OFFER = 'OFR'
      // VALIDATED = 'VAL'
      // REFUSED = 'REF'
      // APPROVED = 'APV'
      // COMPLETED = 'COM'
      // INVOICED = 'INV'
      // CANCELED = 'CAN' 
      // ARCHIVED = 'ARC'   
      // REQUEST_SUBMITTED = 'RSB'
      // APPROVE_REQUEST = 'APR'
      // APPROVE_OFFER = 'APO'
      // APPROVAL_NEEDED = 'APN'
      // OFFER_SUBMITTED = 'OSB'
      // NOT_APPROVED = 'NAP'
      // RETURNED = 'RET'
      // IN_PROGRESS = 'INP'
      // BACKORDER = 'BOR'
    // }

    function activate() {
      var authenticatedAccount = Authentication.getAuthenticatedAccount();
      console.log(authenticatedAccount)
      vm.user = authenticatedAccount;
      if (!authenticatedAccount) {
        $state.go('core.login');
        toastr.error('You are not authorized to view this page.');
      } 
      // else {
      //   // Redirect if logged in, but not the owner of this account.
      //   if (authenticatedAccount) {
      //       // debugger;
      //       $location.url('/');
      //     // toastr.error('You are not authorized to view this page.');
      //     // console.log("2");
      //   }
      // }

      // Order.getAll().then(getAllSuccess, getAllError);

      // function getAllSuccess(data, status, headers, config) {
      //   vm.allOrders = data;
      //   console.log("Orderz Info");
      //   console.log(vm.allOrders);      
      // }

      // function getAllError(errorMsg) {
      //   $state.go('app.dashboard');
      //   toastr.error('Your request can not be processed '+errorMsg+'');
      // }
    }

    // vm.orders = [];
    // vm.dtOptions = DTOptionsBuilder.newOptions()
    //   .withBootstrap()
    //   .withOption('order', [[1, 'asc']])
    //   .withDOM('<"row"<"col-md-8 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"pull-right"f>>>t<"row"<"col-md-4 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"inline-controls text-center"i>><"col-md-4 col-sm-12"p>>')
    //   .withLanguage({
    //     "sLengthMenu": 'View _MENU_ records',
    //     "sInfo":  'Found _TOTAL_ records',
    //     "oPaginate": {
    //       "sPage":    "Page",
    //       "sPageOf":  "of"
    //     }
    //   })
    //   .withPaginationType('input')
    //   //.withScroller()
    //   //.withOption("sScrollY", false)
    //   //.withOption("sScrollX")
    //   .withColumnFilter();


    // vm.dtColumnDefs = [
    //   DTColumnDefBuilder.newColumnDef(0).notSortable(),
    //   DTColumnDefBuilder.newColumnDef(8).notSortable()
    // ];

    // vm.selectedAll = false;

    // vm.selectAll = function () {

    //   if ($scope.selectedAll) {
    //     $scope.selectedAll = false;
    //   } else {
    //     $scope.selectedAll = true;
    //   }

    //   angular.forEach(vm.orders, function(order) {
    //     order.selected = $scope.selectedAll;
    //   });
    // };

  }
})();

(function () {
  'use strict';

  angular
    .module('orders.controllers')
    .controller('OrdersTableController', OrdersTableController);

  OrdersTableController.$inject = [
    '$scope', '$stateParams', '$log', 'Authentication', 'Account', 'Company', 'Order', 'toastr', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder'
  ];

  function OrdersTableController($scope, $stateParams, $log, Authentication, Account, Company, Order, toastr, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
    var vm = this;

    vm.orders = [];

    $scope.stati = {

      'WRQ':'text-cyan',
      'PEN':'text-warning',
      'OFR':'text-drank',
      'VAL':'text-greensea',
      'REF':'text-lightred',
      'APV':'text-success',
      'COM':'text-amethyst',
      'CAN':'text-red',
      'ARC':'text-darkgray',


      // 'WQR':'bg-slategray',
      // 'PEN':'bg-orange',
      // 'OFR':'bg-drank',
      // 'VAL':'bg-greensea',
      // 'REF':'bg-lightred',
      // 'APV':'bg-success',
      // 'COM':'bg-primary',
      // 'CAN':'bg-red',
      // 'ARC':'bg-darkgray',

      // WAITING_REQUEST = 'WRQ'
      // PENDING = 'PEN'
      // OFFER = 'OFR'
      // VALIDATED = 'VAL'
      // REFUSED = 'REF'
      // APPROVED = 'APV'
      // COMPLETED = 'COM'
      // INVOICED = 'INV'
      // CANCELED = 'CAN' 
      // ARCHIVED = 'ARC'   
      // REQUEST_SUBMITTED = 'RSB'
      // APPROVE_REQUEST = 'APR'
      // APPROVE_OFFER = 'APO'
      // APPROVAL_NEEDED = 'APN'
      // OFFER_SUBMITTED = 'OSB'
      // NOT_APPROVED = 'NAP'
      // RETURNED = 'RET'
      // IN_PROGRESS = 'INP'
      // BACKORDER = 'BOR'
    }

    Order.getAll().then(getAllSuccess, getAllError);

    function getAllSuccess(data, status, headers, config) {
      vm.orders = data;
      console.log("Orderz Info");
      console.log(vm.orders);      
    }

    function getAllError(errorMsg) {
      $state.go('app.dashboard');
      toastr.error('Your request can not be processed '+errorMsg+'');
    }

    // vm.orders = [];
    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withBootstrap()
      .withOption('order', [[1, 'asc']])
      .withDOM('<"row"<"col-md-8 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"pull-right"f>>>t<"row"<"col-md-4 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"inline-controls text-center"i>><"col-md-4 col-sm-12"p>>')
      .withLanguage({
        "sLengthMenu": 'View _MENU_ records',
        "sInfo":  'Found _TOTAL_ records',
        "oPaginate": {
          "sPage":    "Page",
          "sPageOf":  "of"
        }
      })
      .withPaginationType('input')
      // .withScroller()
      // .withOption("sScrollY", false)
      // .withOption("sScrollX")
      .withColumnFilter();


    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0).notSortable(),
      DTColumnDefBuilder.newColumnDef(8).notSortable()
    ];

    vm.selectedAll = false;

    vm.selectAll = function () {

      if ($scope.selectedAll) {
        $scope.selectedAll = false;
      } else {
        $scope.selectedAll = true;
      }

      angular.forEach(vm.orders, function(order) {
        order.selected = $scope.selectedAll;
      });
    };
  }
})();

(function () {
  'use strict';

  angular
    .module('orders.controllers')
    .controller('AddRequestController', AddRequestController);

  AddRequestController.$inject = [
    '$scope', '$state', '$stateParams', '$log', '$cookies', 'Authentication', 'Account', 'Company', 'Requests', 'Order','FileUploader', 'toastr',
  ];

  function AddRequestController($scope, $state, $stateParams, $log, $cookies, Authentication, Account, Company, Requests, Order, FileUploader, toastr) {

    var vm = this;
 
    vm.orderId = $stateParams.orderId;
    vm.goodId = $stateParams.goodId;

    vm.addReq = {};
    console.log(vm.addReq);

    // $scope.oneAtATime = true;

    $scope.isCollapsed = true;

    $scope.status = {
      // isFirstOpen: true,
      // isFirstDisabled: false
    };

    activate();

    $scope.page = {
      title: 'Add Request Item',
    };

    function activate() {
        var authenticatedAccount = Authentication.getAuthenticatedAccount();
        
        console.log(authenticatedAccount);
        if (!authenticatedAccount) {
            $state.go('core.login');
            toastr.error('You are not authorized to view this page.');
        } 
      // else {
      //   // Redirect if logged in, but not the owner of this account.
      //   if (authenticatedAccount) {
      //       // debugger;
      //       $location.url('/');
      //     // toastr.error('You are not authorized to view this page.');
      //     // console.log("2");
      //   }
      // }
        
        console.log(vm.goodId);
        Requests.getDetails(vm.goodId).then(detailsSuccess).catch(detailsError);

        function detailsSuccess(data, status, headers, config) {
            vm.details = data;
            console.log("Details");
            console.log(vm.details);      
        }

        function detailsError(errorMsg) {
            $state.go('app.dashboard');
            toastr.error('Your request can not be processed '+errorMsg+'');
        }

        Order.getOrder(vm.orderId).then(getOrderSuccess).catch(getOrderError);

        function getOrderSuccess(data, status, headers, config) {
          vm.order = data;
          console.log(vm.order);
          vm.addReq.order_id = vm.order.id;
          vm.addReq.order_reference = vm.order.reference_number;
          vm.addReq.order_description = vm.order.description;
          vm.addReq.order_draft = vm.order.order_draft;
          vm.addReq.delivery_address = vm.order.delivery_address.id;
          console.log(vm.order);
          console.log(vm.addReq);
        }

        function getOrderError(errorMsg) {
            $state.go('app.dashboard');
            toastr.error('Your request can not be processed '+errorMsg+'');          
        }

        Company.get(authenticatedAccount.user_company).then(companySuccess).catch(companyError);
        
        function companySuccess(data, status, headers, config) {
            vm.company = data.data;
            console.log("company");
            console.log(vm.company);      
        }

        function companyError(errorMsg) {
            $state.go('app.dashboard');
            toastr.error('Your request can not be processed '+errorMsg+'');
        }
    }

    vm.isDraft = function (){
        console.log("here");
        if(vm.addReq.order_draft){
            vm.addReq();
        }
    };

    vm.subReq = function (){
        console.log("Req Data");
        console.log(vm.addReq);
        console.log("good Deet");
        console.log(vm.details);
        for(var item in vm.details){
            console.log(vm.details[item].good);
        }
        console.log(vm.details[item].good);
        var par = vm.details[item].good.replace(/domain: | family: | subfamily: |' '/g,'');
        console.log(par);
        var news = par.split(',');
        console.log(news);
        vm.addReq['good'] = news;
        vm.addReq.good_id = parseInt(vm.details[item].id)
        console.log(vm.addReq.good_id);
        vm.addReq.add = true;
        console.log("Req Data 2");
        console.log(vm.addReq);
        Requests.createReq(vm.addReq)
            .then(addReqSuccess)
            .catch(addReqError);
    };

    function addReqSuccess (data){
        $log.info(data);
        $log.info(data.order);
        $log.info(data.id);
        vm.orderId = data.order;
        $log.info(vm.orderId);
        $scope.reqId = data.id;
        $log.info($scope.reqId);
        console.log(uploader)
        if (uploader.queue.length>0){
            uploader.uploadAll()
        }else{
           $state.go('app.orders.order', {orderId:vm.orderId}) 
        }
    }

        function addReqError (errorMsg){
            $log.error(errorMsg);

        }

        var csrf_token = $cookies.csrftoken;
        var uploader = $scope.uploader = new FileUploader({
          method: 'POST',
          url: '/api/v1/req-items/'+$scope.reqId+'/req-files/',
          headers : {
            'X-CSRFToken': csrf_token 
          },
         
        });

        // FILTERS
        uploader.filters.push({
          name: 'customFilter',
          fn: function() {
            return this.queue.length < 10;
          }
        });

        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
          console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
          console.info('onBeforeUploadItem', item);
          console.info(item.url);
          console.info('/api/v1/req-items/'+$scope.reqId+'/req-files/');
          item.url = '/api/v1/req-items/'+$scope.reqId+'/req-files/';
          console.info(item);
          return item         
        };
        uploader.onProgressItem = function(fileItem, progress) {
          console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
          console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
          console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
          console.info('onErrorItem', fileItem, response, status, headers);
          $state.go('app.orders.order', {orderId:vm.orderId})
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
          console.info('onCancelItem', fileItem, response, status, headers);
          $state.go('app.orders.order', {orderId:vm.orderId})
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
          console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
          console.info('onCompleteAll');
          $state.go('app.orders.order', {orderId:vm.orderId})
        };

        console.info('uploader', uploader);
    }

})();

(function () {
  'use strict';

  angular
    .module('orders.controllers')
    .controller('EditRequestController', EditRequestController);

  EditRequestController.$inject = [
    '$scope', '$location', '$state', '$stateParams', '$log', '$cookies', 'Authentication', 'Account', 'Company', 'Requests', 'FileUploader', 'toastr',
  ];

  function EditRequestController($scope, $location, $state, $stateParams, $log, $cookies, Authentication, Account, Company, Requests, FileUploader, toastr) {

    var vm = this;

    vm.reqId = $stateParams.reqId;

    activate();

    $scope.page = {
      title: 'Edit Request Item',
    };

    function activate() {
        var authenticatedAccount = Authentication.getAuthenticatedAccount();

        console.log(authenticatedAccount);
        if (!authenticatedAccount) {
            $state.go('core.login');
            toastr.error('You are not authorized to view this page.');
        } 
      // else {
      //   // Redirect if logged in, but not the owner of this account.
      //   if (authenticatedAccount) {
      //       // debugger;
      //       $location.url('/');
      //     // toastr.error('You are not authorized to view this page.');
      //     // console.log("2");
      //   }
      // }

        Requests.getReq(vm.reqId).then(getReqSuccess).catch(getReqError);

        function getReqSuccess(data, status, headers, config) {
            vm.req = data;
            console.log("Req");
            console.log(vm.req);      
        }

        function getReqError(errorMsg) {
            $state.go('app.dashboard');
            // toastr.error('Your request can not be processed '+errorMsg+'');
        }

        Company.get(authenticatedAccount.user_company).then(companySuccess).catch(companyError);
        
        function companySuccess(data, status, headers, config) {
            vm.company = data.data;
            console.log("company");
            console.log(vm.company);      
        }

        function companyError(errorMsg) {
            $state.go('app.dashboard');
            toastr.error('Your request can not be processed '+errorMsg+'');
        }
    }

    vm.isDraft = function (){
        console.log("here");
        if(vm.req.order_draft){
            vm.updateReq();
        }
    };

    vm.updateReq = function (){
        console.log("Req Data");
        console.log(vm.req);
        console.log("good Deet");

        Requests.updateReq(vm.req)
            .then(updateReqSuccess)
            .catch(updateReqError);
    };

    function updateReqSuccess (data){
        $log.info(data);
        $log.info(data.order);
        $log.info(data.id);
        vm.orderId = data.order;
        $log.info(vm.orderId);
        $scope.reqId = data.id;
        $log.info($scope.reqId);
        console.log(uploader)
        if (uploader.queue.length>0){
            uploader.uploadAll()
        }else{
           $state.go('app.orders.order', {orderId:vm.orderId}) 
        }
    }

    function updateReqError (errorMsg){
        $log.error(errorMsg);

    }



    var csrf_token = $cookies.csrftoken;
    var uploader = $scope.uploader = new FileUploader({
      method: 'POST',
      url: '/api/v1/req-items/'+vm.reqId+'/req-files/',
      headers : {
        'X-CSRFToken': csrf_token 
      },

    });

    // FILTERS
    uploader.filters.push({
      name: 'customFilter',
      fn: function() {
        return this.queue.length < 10;
      }
    });

    // CALLBACKS
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
      console.info('onBeforeUploadItem', item);
      console.info(item.url);
      console.info('/api/v1/req-items/'+vm.reqId+'/req-files/');
      item.url = '/api/v1/req-items/'+vm.reqId+'/req-files/';
      console.info(item);
      return item         
    };
    uploader.onProgressItem = function(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
      console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
      $state.go('app.orders.order', {orderId:vm.orderId})
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
      $state.go('app.orders.order', {orderId:vm.orderId})
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
      $state.go('app.orders.order', {orderId:vm.orderId})
    };

    console.info('uploader', uploader);
  }

})();

(function () {
  'use strict';

  angular
    .module('orders.controllers')
    .controller('RequestController', RequestController);

  RequestController.$inject = [
    '$scope', '$location', '$state', '$stateParams', '$log', '$cookies', 'Authentication', 'Account', 'Company', 'Requests', 'FileUploader', 'toastr',
  ];

  function RequestController($scope, $location, $state, $stateParams, $log, $cookies, Authentication, Account, Company, Requests, FileUploader, toastr) {

    var vm = this;
 
    var orderId = $stateParams.orderId;
    var reqId = $stateParams.reqId;
    var goodId = $stateParams.goodId;

    vm.newReq = {};
    vm.newReq.order_draft = false;
    // vm.updateReq = {};
    // $scope.oneAtATime = true;

    $scope.isCollapsed = true;

    $scope.status = {
      // isFirstOpen: true,
      // isFirstDisabled: false
    };
    // console.log(vm.newReq);
    // vm.destroy = destroy;
    // vm.update = update;

    // console.log($localStorage.aFile);
    // console.log($localStorage);

    // $scope.$watch(function () { return $localStorage.files; },function(newVal,oldVal){
    //     if(oldVal!==newVal && newVal === undefined){
    //         console.log($localStorage.files);
    //         console.log(oldVal);
    //         console.log(newVal); 
    //     }
    // });

    // $scope.$watch("vm.newReq", function(newValue, oldValue) {
    //     if($localStorage.aFile){
    //         if ($localStorage.aFile.length > 0) {
    //           // $scope.greeting = "Greetings " + $scope.name;
    //             console.log($localStorage.aFile);
    //             vm.store = []
    //             vm.store = {'req_file':$localStorage.aFile};
    //             console.log(vm.store);
    //             vm.newReq = vm.store;
    //         }
    //     }
    // });
    
    activate();

    $scope.page = {
      title: 'New Request Item',
    };

    function activate() {
        var authenticatedAccount = Authentication.getAuthenticatedAccount();
        
        console.log(authenticatedAccount);
        if (!authenticatedAccount) {
            $state.go('core.login');
            toastr.error('You are not authorized to view this page.');
        } 
      // else {
      //   // Redirect if logged in, but not the owner of this account.
      //   if (authenticatedAccount) {
      //       // debugger;
      //       $location.url('/');
      //     // toastr.error('You are not authorized to view this page.');
      //     // console.log("2");
      //   }
      // }

        Requests.getDetails(goodId).then(detailsSuccess).catch(detailsError);

        function detailsSuccess(data, status, headers, config) {
            vm.details = data;
            console.log("Details");
            console.log(vm.details);
            // vm.newReq.good_id = goodId;      
        }

        function detailsError(errorMsg) {
            $state.go('app.dashboard');
            // toastr.error('Your request can not be processed '+errorMsg+'');
        }

        Company.get(authenticatedAccount.user_company).then(companySuccess).catch(companyError);
        
        function companySuccess(data, status, headers, config) {
            vm.company = data.data;
            console.log("company");
            console.log(vm.company);      
        }

        function companyError(errorMsg) {
            $state.go('app.dashboard');
            toastr.error('Your request can not be processed '+errorMsg+'');
        }
    }

    vm.isDraft = function (){
        console.log("here");
        if(vm.newReq.order_draft){
            vm.addReq();
        }
    };

    vm.addReq = function (){
        console.log("Req Data");
        console.log(vm.newReq);
        console.log("good Deet");
        console.log(vm.details);
        for(var item in vm.details){
            console.log(vm.details[item].good);
        }
        console.log(vm.details[item].good);
        var par = vm.details[item].good.replace(/domain: | family: | subfamily: |' '/g,'');
        console.log(par);
        var news = par.split(',');
        console.log(news);
        vm.newReq['good'] = news;
        vm.newReq.good_id = parseInt(vm.details[item].id)
        console.log(vm.newReq.good_id);
        vm.newReq.add = false;
        console.log("Req Data 2");
        console.log(vm.newReq);

        Requests.createReq(vm.newReq)
            .then(addReqSuccess)
            .catch(addReqError);
    };

    function addReqSuccess (data){
        $log.info(data);
        $log.info(data.order);
        $log.info(data.id);
        vm.orderId = data.order;
        $log.info(vm.orderId);
        $scope.reqId = data.id;
        $log.info($scope.reqId);
        console.log(uploader)
        if (uploader.queue.length>0){
            uploader.uploadAll()
        }else{
           $state.go('app.orders.order', {orderId:vm.orderId}) 
        }
        // $location.path('#/app/orders/order/'+data+'');
        // $state.go('app.orders.order', {orderId:data})
    }

        function addReqError (errorMsg){
            $log.error(errorMsg);

        }

        var csrf_token = $cookies.csrftoken;
        var uploader = $scope.uploader = new FileUploader({
          method: 'POST',
          url: '/api/v1/req-items/'+$scope.reqId+'/req-files/',
          headers : {
            'X-CSRFToken': csrf_token 
          },
         
        });

        // FILTERS
        uploader.filters.push({
          name: 'customFilter',
          fn: function() {
            return this.queue.length < 10;
          }
        });

        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
          console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
          console.info('onBeforeUploadItem', item);
          console.info(item.url);
          console.info('/api/v1/req-items/'+$scope.reqId+'/req-files/');
          item.url = '/api/v1/req-items/'+$scope.reqId+'/req-files/';
          console.info(item);
          return item         
        };
        uploader.onProgressItem = function(fileItem, progress) {
          console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
          console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
          console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
          console.info('onErrorItem', fileItem, response, status, headers);
          $state.go('app.orders.order', {orderId:vm.orderId})
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
          console.info('onCancelItem', fileItem, response, status, headers);
          $state.go('app.orders.order', {orderId:vm.orderId})
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
          console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
          console.info('onCompleteAll');
          $state.go('app.orders.order', {orderId:vm.orderId})
        };

        console.info('uploader', uploader);
    }

})();

(function () {
  'use strict';

  angular
    .module('orders.services')
    .factory('Offer', Offer);

  Offer.$inject = ['$http', '$q'];

  function Offer($http, $q) {

  	var Offer = {
      getDetails: getDetails,
      getReq: getReq,
  		createReq: createReq,
  		updateReq: updateReq,

    };
    return Offer;

    // Get Offer details
    function getOffer(goodId) {
      return $http.get('api/v1/goods/'+goodId+'/details/')
      .then(detailsResponse)
      .catch(detailsError);
    }

    function detailsResponse(response){
      console.log("Offer")
      console.log(response);
      console.log(response.data);
      return response.data;
    }

    function detailsError(response){
      return $q.reject('Error retrieving request details '+response.status+'');
    }
    
    function createOffer(orderId, data) {
      console.log(orderId);
      console.log(data);
      return $http.post('/api/v1/orders/'+orderId+'/offers/', data)
        .then(createOfferSuccess)
        .catch(createOfferError);
    }

    function createOfferSuccess(response){
      console.log(response.data);
      return response.data;
    }

    function createOfferError(response){
      return $q.reject('Error creating request '+response.status+'');
      
    }

    // Update request item
    function updateReq(reqInfo) {
      console.log(reqInfo);
      return $http.put('/api/v1/req-items/'+reqInfo.id+'/', {
        data: reqInfo
      }).then(updateReqSuccess)
        .catch(updateReqError);
    }

    function updateReqSuccess(response){
      console.log(response.data);
      return response.data;
    }

    function updateReqError(response){
      return $q.reject('Error updating the request '+response.status+''); 
    }


  }
})();
(function () {
  'use strict';

  angular
    .module('orders.services')
    .factory('Order', Order);

  Order.$inject = ['$http', '$q'];

  function Order($http, $q) {
	var Order = {
        getAll: getAll,
        getOrder: getOrder,
        createOffer: createOffer,
        updateOrderStatus: updateOrderStatus,
    };

    return Order;

    // Get all orders
    function getAll() {
      return $http.get('api/v1/orders/')
      .then(getAllResponse)
      .catch(getAllError);
    }

    function getAllResponse(response){
      console.log("order")
      console.log(response.data)
      return response.data;
    }

    function getAllError(response){
      return $q.reject('Error retrieving order details '+response.status+'');
    }

    // Get single order details
    function getOrder(orderId) {
      return $http.get('api/v1/orders/'+orderId+'/')
      .then(getOrderResponse)
      .catch(getOrderError);
    }

    function getOrderResponse(response){
      console.log("order")
      console.log(response.data)
      return response.data;
    }

    function getOrderError(response){
      return $q.reject('Error retrieving order details '+response.status+'');
    }

    // Create order offer
    function createOffer(orderId, data) {
      console.log(orderId);
      console.log(data);
      return $http.post('/api/v1/orders/'+orderId+'/offers/', data)
        .then(createOfferSuccess)
        .catch(createOfferError);
    }

    function createOfferSuccess(response){
      console.log(response.data);
      return response.data;
    }

    function createOfferError(response){
      return $q.reject('Error creating request '+response.status+'');
    }

    // Update order status
    function updateOrderStatus(orderId, data) {
      console.log(orderId);
      console.log(data);
      return $http.put('/api/v1/orders/'+orderId+'/', data)
        .then(updateOrderStatusSuccess)
        .catch(updateOrderStatusError);
    }

    function updateOrderStatusSuccess(response){
      console.log(response.data);
      return response.data;
    }

    function updateOrderStatusError(response){
      return $q.reject('Error updating order status '+response.status+''); 
    }

  }
})();
(function () {
  'use strict';

  angular
    .module('orders.services')
    .factory('Requests', Requests);

  Requests.$inject = ['$http', '$q'];

  function Requests($http, $q) {

  	var Requests = {
      getDetails: getDetails,
      getReq: getReq,
  		createReq: createReq,
  		updateReq: updateReq,

    };
    return Requests;

    // Get request Item details
    function getDetails(goodId) {
      return $http.get('api/v1/goods/'+goodId+'/details/')
      .then(detailsResponse)
      .catch(detailsError);
    }

    function detailsResponse(response){
      console.log("good")
      console.log(response.data)
      return response.data;
    }

    function detailsError(response){
      return $q.reject('Error retrieving request details '+response.status+'');
    }

    // Get actual request item
    function getReq(reqId) {
      return $http.get('/api/v1/req-items/'+reqId+'/', {
      }).then(getReqSuccess)
        .catch(getReqError);
    }

    function getReqSuccess(response){
      return response.data;
    }

    function getReqError(response){
      return $q.reject('Error getting the request '+response.status+'');
      
    }
    
    // Create a new request item
    function createReq(data) {
      console.log(data);
      return $http.post('/api/v1/req-items/', data)
        .then(createReqSuccess)
        .catch(createReqError);
    }

    function createReqSuccess(response){
      console.log(response.data);
      return response.data;
    }

    function createReqError(response){
      return $q.reject('Error creating request '+response.status+'');
      
    }

    // Update request item
    function updateReq(reqInfo) {
      console.log(reqInfo);
      return $http.put('/api/v1/req-items/'+reqInfo.id+'/', {
        data: reqInfo
      }).then(updateReqSuccess)
        .catch(updateReqError);
    }

    function updateReqSuccess(response){
      console.log(response.data);
      return response.data;
    }

    function updateReqError(response){
      return $q.reject('Error updating the request '+response.status+''); 
    }


  }
})();

(function () {
  'use strict';

  angular
    .module('layout.controllers')
    .controller('AppController', AppController);

  AppController.$inject = ['$scope'];

  function AppController($scope) {
    // var vm = this;

    // $scope.headerPath = static_path('views/header.html');
    // console.log($scope.headerPath);
  }
})();

(function () {
  'use strict';

  angular
    .module('layout.controllers')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$state', 'Authentication'];

  function DashboardController($scope, $state, Authentication) {
    var vm = this;
    // console.log($state.go('core.login'));
    vm.isAuthenticated = Authentication.isAuthenticated();
    console.log(vm.isAuthenticated);
    // if (vm.isAuthenticated === false) {
    //   console.log(vm.isAuthenticated);
    //   console.log('here');
    //   $state.go('core.login');
    // } 
    activate();


    $scope.page = {
      title: 'Dashboard',
    }

    function activate() {
      // if (!vm.isAuthenticated) {    
      //   $state.go('core.login');
      // } 
    }
  }
})();

/**
 * NHeaderController
 * @namespace thinkster.layout.controllers
 */
(function () {
  'use strict';

  angular
    .module('layout.controllers')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', 'Authentication'];

  function HeaderController($scope, Authentication) { 
    
    var vm = this;

    vm.logout = logout;

    function logout() {
      Authentication.logout();
    }

  }
})();


(function () {
  'use strict';

  angular
    .module('layout.controllers')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', '$sce', '$state', 'Authentication'];

  /**
   * @namespace IndexController
   */
  function IndexController($scope, $sce, $state, Authentication) {
    var vm = this;

    vm.isAuthenticated = Authentication.isAuthenticated();

    $scope.au = Authentication.getAuthenticatedAccount();
    console.log($scope.au);

    $scope.main = {
      title: 'WeASe',
      settings: {
        navbarHeaderColor: 'scheme-default',
        sidebarColor: 'scheme-default',
        brandingColor: 'scheme-default',
        activeColor: 'default-scheme-color',
        headerFixed: true,
        asideFixed: true,
        rightbarShow: false
      }
    };

    var mediaPath = media_path('');
    console.log(mediaPath);
    var staticPath = static_path('');
    console.log(staticPath);
    var headerPath = static_path('views/header.html');
    var navPath = static_path('views/nav.html');
    var rbPath = static_path('views/rightbar.html');

    $scope.path = { 
      static_files: $sce.trustAsResourceUrl(staticPath),
      media: $sce.trustAsResourceUrl(mediaPath),
      nav: $sce.trustAsResourceUrl(navPath),
      header: $sce.trustAsResourceUrl(headerPath),
      rb: $sce.trustAsResourceUrl(rbPath)
    };
  }
})();


(function () {
  'use strict';

  angular
    .module('layout.controllers')
    .controller('NavController', NavController);

  NavController.$inject = ['$scope', '$localStorage', 'Authentication', 'Goods'];

  function NavController($scope, $localStorage, Authentication, Goods) {  
    var vm = this;
    vm.icon = ['file-o','building','table','desktop','th-large','plus-square-o']
    vm.user = Authentication.getAuthenticatedAccount();
    console.log(vm.user);
    Goods.get().then(getGoodsSuccess).catch(getGoodsError);
    
    function getGoodsSuccess (goods){
      console.log(goods);
    	vm.allGoods = goods;
      $localStorage.goods = goods;
    	console.log(vm.allGoods);
    };

    function getGoodsError (msg){
    	console.log('Goods Error '+ msg);
    };

    $scope.oneAtATime = false;

    $scope.status = {
      isFirstOpen: true,
      isSecondOpen: false,
      isThirdOpen: false
    };

  }
})();

(function () {
  'use strict';

  angular
    .module('layout.services')
    .factory('Goods', Goods);

  Goods.$inject = ['$http'];

  function Goods($http) {

    var Goods = {

      get: get,

    };

    return Goods;

    function get() {
      return $http.get('/api/v1/goods/')
        .then(getGoodSuccess)
        .catch(getGoodError);
    }

    function getGoodSuccess(response) {
      console.log(response);
      console.log(response.data);
      return response.data;
    }

    function getGoodError(response) {
      console.log(response);
      console.log(response.data);
      return response.status
    }

  }
})();
(function () {
  'use strict';

  angular
    .module('layout.directives')
    .directive('navItems', navItems);

  function navItems() {

	var directive = {
  		replace: true,
  		transclude:true,
  		restrict: 'E',
      scope: true,
  		// scope: {
  		// 	navItem: '=',
    //         dom: '@',
    // navCollapsed: '=',
  		// },
      template:
        '<li>'+
           '<a href="javascript:;"><fa name="{{vm.icon[$index]}}"></fa> <span>{{domain}}</span></a>'+
           '<ul>'+
               '<li ui-sref-active="active" class="dropdown submenu" ng-repeat="(fam, v) in value | groupBy: \'family\' | orderBy:\'id\'" >'+
               '<a href="javascript:;"><fa name="caret-right"></fa><span>{{fam}}</span><i class="fa fa-plus"></i></a>'+
                   '<ul>'+
                       '<li ui-sref-active="active" class="dropdown submenu" ng-repeat="sf in v"><a ui-sref="app.orders.request({goodId:sf.id})">{{sf.subfamily}}</a></li>'+
                   '</ul>'+
               '</li>'+
           '</ul>'+
         '</li>',
      link: function($scope, $el, attrs) {
        console.log(attrs);
        console.log($scope);
        console.log($el); 
          var $dropdowns = $el.find('ul').parent('li'),
              $a = $dropdowns.children('a'),
              $notDropdowns = $el.children('li').not($dropdowns),
              $notDropdownsLinks = $notDropdowns.children('a'),
              app = angular.element('#minovate'),
              sidebar = angular.element('#sidebar'),
              controls = angular.element('#controls');

          $dropdowns.addClass('dropdown');

          var $submenus = $dropdowns.find('ul >.dropdown');
          $submenus.addClass('submenu');

          $a.append('<i class="fa fa-plus"></i>');

          $a.on('click', function(event) {
            if (app.hasClass('sidebar-sm') || app.hasClass('sidebar-xs') || app.hasClass('hz-menu')) {
              return false;
            }

            var $this = angular.element(this),
                $parent = $this.parent('li'),
                $openSubmenu = angular.element('.submenu.open');

            if (!$parent.hasClass('submenu')) {
              $dropdowns.not($parent).removeClass('open').find('ul').slideUp();
            }

            $openSubmenu.not($this.parents('.submenu')).removeClass('open').find('ul').slideUp();
            $parent.toggleClass('open').find('>ul').stop().slideToggle();
            event.preventDefault();
          });

          $dropdowns.on('mouseenter', function() {
            sidebar.addClass('dropdown-open');
            controls.addClass('dropdown-open');
          });

          $dropdowns.on('mouseleave', function() {
            sidebar.removeClass('dropdown-open');
            controls.removeClass('dropdown-open');
          });

          $notDropdownsLinks.on('click', function() {
            $dropdowns.removeClass('open').find('ul').slideUp();
          });

          var $activeDropdown = angular.element('.dropdown>ul>.active').parent();

          $activeDropdown.css('display', 'block');
          console.log($el);
        },
	}

    return directive;
  }

})();
'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:BoxedlayoutCtrl
 * @description
 * # BoxedlayoutCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('BoxedlayoutCtrl', function ($scope) {
    $scope.page = {
      title: 'Boxed Layout',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:CalendarCtrl
 * @description
 * # CalendarCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('CalendarCtrl', function ($scope,$compile,uiCalendarConfig) {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* event source that pulls from google.com */
    $scope.eventSource = {
      url: 'http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic',
      className: 'gcal-event',           // an option!
      currentTimezone: 'America/Chicago' // an option!
    };

    /* event source that contains custom events on the scope */
    $scope.events = [
      {title: 'All Day Event',start: new Date(y, m, 1), className: ['b-l b-2x b-greensea']},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2), className: ['bg-dutch']},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false, className: ['b-l b-2x b-primary']},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false, className: ['b-l b-2x b-primary']},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false, className: ['b-l b-2x b-default']},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/', className: ['b-l b-2x b-hotpink']},
      {title: 'Make cupcakes', start: new Date(y, m, 2), className: ['b-l b-2x b-info'], location:'Bratislava', info:'The best in whole world.'},
      {title: 'Call wife', start: new Date(y, m, 6),end: new Date(y, m, 7), className: ['b-l b-2x b-red'], location:'Piestany', info:'And say her hello.'}
    ];

    /* alert on dayClick */
    $scope.precision = 400;
    $scope.lastClickTime = 0;
    $scope.doubleClick = function( date, jsEvent, view ){
      var time = new Date().getTime();
      if(time - $scope.lastClickTime <= $scope.precision){
        $scope.events.push({
          title: 'New Event',
          start: date,
          className: ['b-l b-2x b-info']
        });
      }
      $scope.lastClickTime = time;
    };

    /* alert on Drop */
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
      $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };

    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view){
      $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    $scope.overlay = angular.element('.fc-overlay');

    $scope.alertOnMouseOver = function( event, jsEvent, view ){
      $scope.event = event;
      $scope.overlay.removeClass('left right');
      var wrap = angular.element(jsEvent.target).closest('.fc-event');
      var cal = wrap.closest('.calendar');
      var left = wrap.offset().left - cal.offset().left;
      var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
      if( right > $scope.overlay.width() ) {
        $scope.overlay.addClass('left');
      } else if ( left > $scope.overlay.width() ) {
        $scope.overlay.addClass('right');
      }
      if (wrap.find('.fc-overlay').length === 0) {
        wrap.append( $scope.overlay );
      }
    };

    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'prev',
          center: 'title',
          right: 'next'
        },
        dayClick: $scope.doubleClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventMouseover: $scope.alertOnMouseOver
      }
    };

    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'New Event',
        start: new Date(y, m, d),
        className: ['b-l b-2x b-info']
      });
    };

    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };

    /* Change View */
    $scope.changeView = function(view, calendar) {
      angular.element('.calendar').fullCalendar('changeView', view);
    };

    $scope.today = function(calendar) {
      angular.element('.calendar').fullCalendar('today');
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events];


  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ChartsCtrl
 * @description
 * # ChartsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('ChartsCtrl', function ($scope) {

    $scope.page = {
      title: 'Charts & Graphs',
      subtitle: 'Place subtitle here...'
    };

    $scope.basicData = [
      { year: '2009', a: 15,  b: 5 },
      { year: '2010', a: 20,  b: 10 },
      { year: '2011', a: 35,  b: 25 },
      { year: '2012', a: 40, b: 30 }
    ];

    $scope.donutData = [
      {label: 'Download Sales', value: 12},
      {label: 'In-Store Sales', value: 30},
      {label: 'Mail-Order Sales', value: 20}
    ];

    $scope.areaData = [
      { year: '2009', a: 10,  b: 3 },
      { year: '2010', a: 14,  b: 5 },
      { year: '2011', a: 8,  b: 2 },
      { year: '2012', a: 20, b: 15 }
    ];

  })

  .controller('LineChartCtrl', function ($scope) {

    $scope.dataset = [{
      data: [[1,5.3],[2,5.9],[3,7.2],[4,8],[5,7],[6,6.5],[7,6.2],[8,6.7],[9,7.2],[10,7],[11,6.8],[12,7]],
      label: 'Sales',
      points: {
        show: true,
        radius: 6
      },
      splines: {
        show: true,
        tension: 0.45,
        lineWidth: 5,
        fill: 0
      }
    }, {
      data: [[1,6.6],[2,7.4],[3,8.6],[4,9.4],[5,8.3],[6,7.9],[7,7.2],[8,7.7],[9,8.9],[10,8.4],[11,8],[12,8.3]],
      label: 'Orders',
      points: {
        show: true,
        radius: 6
      },
      splines: {
        show: true,
        tension: 0.45,
        lineWidth: 5,
        fill: 0
      }
    }];

    $scope.options = {
      colors: ['#a2d200', '#cd97eb'],
      series: {
        shadowSize: 0
      },
      xaxis:{
        font: {
          color: '#ccc'
        },
        position: 'bottom',
        ticks: [
          [ 1, 'Jan' ], [ 2, 'Feb' ], [ 3, 'Mar' ], [ 4, 'Apr' ], [ 5, 'May' ], [ 6, 'Jun' ], [ 7, 'Jul' ], [ 8, 'Aug' ], [ 9, 'Sep' ], [ 10, 'Oct' ], [ 11, 'Nov' ], [ 12, 'Dec' ]
        ]
      },
      yaxis: {
        font: {
          color: '#ccc'
        }
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true,
      tooltipOpts: {
        content: '%s: %y.4',
        defaultTheme: false,
        shifts: {
          x: 0,
          y: 20
        }
      }
    };
  })

  .controller('BarChartCtrl', function ($scope) {

    $scope.data2 = [];

    for (var i = 0; i < 20; ++i) {
      $scope.data2.push([i, Math.sin(i+0.1)]);
    }

    $scope.dataset = [{
      data: $scope.data2,
      label: 'Satisfaction',
      color: '#e05d6f'
    }];

    $scope.options = {
      series: {
        shadowSize: 0
      },
      bars: {
        show: true,
        barWidth: 0.6,
        lineWidth: 0,
        fillColor: {
          colors: [{ opacity:0.8 }, { opacity:0.8}]
        }
      },
      xaxis: {
        font: {
          color: '#ccc'
        }
      },
      yaxis: {
        font: {
          color: '#ccc'
        },
        min: -2,
        max: 2
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true
    };
  })

  .controller('OrderedChartCtrl', function ($scope) {

    $scope.dataset = [{
      data: [[10, 50], [20, 80], [30, 60], [40, 40]],
      label: 'A'
    }, {
      data: [[10, 30], [20, 50], [30, 70], [40, 50]],
      label: 'B'
    }, {
      data: [[10, 40], [20, 60], [30, 90], [40, 60]],
      label: 'C'
    }];

    $scope.options = {
      series: {
        shadowSize: 0
      },
      bars: {
        show: true,
        fill: true,
        lineWidth: 0,
        fillColor: {
          colors: [{ opacity:0.6 }, { opacity:0.8}]
        },
        order: 1, // order bars
        colors: ['#428bca','#d9534f','#A40778']
      },
      xaxis: {
        font: {
          color: '#ccc'
        }
      },
      yaxis: {
        font: {
          color: '#ccc'
        }
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true
    };
  })

  .controller('StackedChartCtrl', function ($scope) {

    $scope.dataset = [{
      data: [[10, 50], [20, 80], [30, 60], [40, 40]],
      label: 'A'
    }, {
      data: [[10, 30], [20, 50], [30, 70], [40, 50]],
      label: 'B'
    }, {
      data: [[10, 40], [20, 60], [30, 90], [40, 60]],
      label: 'C'
    }];

    $scope.options = {
      series: {
        shadowSize: 0,
        stack: true // stack bars
      },
      bars: {
        show: true,
        fill: true,
        lineWidth: 0,
        fillColor: {
          colors: [{ opacity:0.6 }, { opacity:0.8}]
        },
        colors: ['#428bca','#d9534f','#A40778']
      },
      xaxis: {
        font: {
          color: '#ccc'
        }
      },
      yaxis: {
        font: {
          color: '#ccc'
        }
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true
    };
  })

  .controller('CombinedChartCtrl', function ($scope) {

    $scope.dataset = [{
      data: [[0, 8], [1, 15], [2, 16], [3, 14], [4,16], [5,18], [6,17], [7,15], [8,12], [9,13]],
      label: 'Unique Visits',
      points: {
        show: true,
        radius: 3
      },
      splines: {
        show: true,
        tension: 0.45,
        lineWidth: 4,
        fill: 0
      }
    }, {
      data: [[0, 5], [1, 9], [2, 10], [3, 8], [4,9], [5, 12], [6, 14], [7, 13], [8, 10], [9, 12]],
      label: 'Page Views',
      bars: {
        show: true,
        barWidth: 0.4,
        lineWidth: 0,
        fillColor: { colors: [{ opacity: 0.6 }, { opacity: 0.8}] }
      }
    }];

    $scope.options = {
      colors: ['#16a085','#FF0066'],
      series: {
        shadowSize: 0
      },
      xaxis: {
        font: {
          color: '#ccc'
        }
      },
      yaxis: {
        font: {
          color: '#ccc'
        }
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true,
      tooltipOpts: { content: '%s of %x.1 is %y.4',  defaultTheme: false, shifts: { x: 0, y: 20 } }
    };
  })

  .controller('PieChartCtrl', function ($scope) {

    $scope.dataset = [
      { label: 'Chrome', data: 30 },
      { label: 'Firefox', data: 15 },
      { label: 'Safari', data: 15 },
      { label: 'IE', data: 10 },
      { label: 'Opera', data: 5 },
      { label: 'Other', data: 10}
    ];

    $scope.options = {
      series: {
        pie: {
          show: true,
          innerRadius: 0,
          stroke: {
            width: 0
          },
          label: {
            show: true,
            threshold: 0.05
          }
        }
      },
      colors: ['#428bca','#5cb85c','#f0ad4e','#d9534f','#5bc0de','#616f77'],
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true,
      tooltipOpts: { content: '%s: %p.0%' }
    };
  })

  .controller('DonutChartCtrl', function ($scope) {

    $scope.dataset = [
      { label: 'Chrome', data: 30 },
      { label: 'Firefox', data: 15 },
      { label: 'Safari', data: 15 },
      { label: 'IE', data: 10 },
      { label: 'Opera', data: 5 },
      { label: 'Other', data: 10}
    ];

    $scope.options = {
      series: {
        pie: {
          show: true,
          innerRadius: 0.5,
          stroke: {
            width: 0
          },
          label: {
            show: true,
            threshold: 0.05
          }
        }
      },
      colors: ['#428bca','#5cb85c','#f0ad4e','#d9534f','#5bc0de','#616f77'],
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true,
      tooltipOpts: { content: '%s: %p.0%' }
    };
  })

  .controller('RealtimeChartCtrl', function ($scope, $interval) {

    var data = [],
        totalPoints = 300;

    function getRandomData() {

      if (data.length > 0) {
        data = data.slice(1);
      }

      // Do a random walk

      while (data.length < totalPoints) {

        var prev = data.length > 0 ? data[data.length - 1] : 50,
            y = prev + Math.random() * 10 - 5;

        if (y < 0) {
          y = 0;
        } else if (y > 100) {
          y = 100;
        }

        data.push(y);
      }

      // Zip the generated y values with the x values

      var res = [];
      for (var i = 0; i < data.length; ++i) {
        res.push([i, data[i]]);
      }

      return res;
    }

    var updateInterval = 300;

    $interval(function() {
      $scope.dataset = [{
        data: getRandomData()
      }];
      getRandomData();
    }, updateInterval);

    $scope.dataset = [{
      data: getRandomData()
    }];

    $scope.options = {
      colors: ['#a2d200'],
      series: {
        shadowSize: 0,
        lines: {
          show: true,
          fill: 0.1
        }
      },
      xaxis:{
        font: {
          color: '#ccc'
        },
        tickFormatter: function() {
          return '';
        }
      },
      yaxis: {
        font: {
          color: '#ccc'
        },
        min: 0,
        max: 110
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true,
      tooltipOpts: {
        content: '%y%',
        defaultTheme: false,
        shifts: {
          x: 0,
          y: 20
        }
      }
    };

  })

  .controller('RickshawChartCtrl', function($scope){

    $scope.renderers = [{
      id: 'area',
      name: 'Area'
    }, {
      id: 'line',
      name: 'Line'
    }, {
      id: 'bar',
      name: 'Bar'
    }, {
      id: 'scatterplot',
      name: 'Scatterplot'
    }];

    $scope.palettes = [
      'spectrum14',
      'spectrum2000',
      'spectrum2001',
      'colorwheel',
      'cool',
      'classic9',
      'munin'
    ];

    $scope.rendererChanged = function(id) {
      $scope['options' + id] = {
        renderer: $scope['renderer' + id].id
      };
    };

    $scope.paletteChanged = function(id) {
      $scope['features' + id] = {
        palette: $scope['palette' + id]
      };
    };

    $scope.changeSeriesData = function(id) {
      var seriesList = [];
      for (var i = 0; i < 3; i++) {
        var series = {
          name: 'Series ' + (i + 1),
          data: []
        };
        for (var j = 0; j < 10; j++) {
          series.data.push({x: j, y: Math.random() * 20});
        }
        seriesList.push(series);
        $scope['series' + id][i] = series;
      }
      //$scope['series' + id] = seriesList;
    };

    $scope.options1 = {
      renderer: 'area'
    };
    $scope.series1 = [{
      name: 'Series 1',
      color: 'steelblue',
      data: [{x: 0, y: 23}, {x: 1, y: 15}, {x: 2, y: 79}, {x: 3, y: 31}, {x: 4, y: 60}]
    }, {
      name: 'Series 2',
      color: 'lightblue',
      data: [{x: 0, y: 30}, {x: 1, y: 20}, {x: 2, y: 64}, {x: 3, y: 50}, {x: 4, y: 15}]
    }];

    $scope.options2 = {
      renderer: 'line'
    };
    $scope.features2 = {
      hover: {
        xFormatter: function(x) {
          return 't=' + x;
        },
        yFormatter: function(y) {
          return '$' + y;
        }
      }
    };
    $scope.series2 = [{
      name: 'Series 1',
      color: 'steelblue',
      data: [{x: 0, y: 23}, {x: 1, y: 15}, {x: 2, y: 79}, {x: 3, y: 31}, {x: 4, y: 60}]
    }, {
      name: 'Series 2',
      color: 'lightblue',
      data: [{x: 0, y: 30}, {x: 1, y: 20}, {x: 2, y: 64}, {x: 3, y: 50}, {x: 4, y: 15}]
    }];

    $scope.options3 = {
      renderer: 'bar'
    };
    $scope.features3 = {
      palette: 'colorwheel'
    };
    $scope.series3 = [{
      name: 'Series 1',
      data: [{x: 0, y: 23}, {x: 1, y: 15}, {x: 2, y: 79}, {x: 3, y: 31}, {x: 4, y: 60}]
    }, {
      name: 'Series 2',
      data: [{x: 0, y: 30}, {x: 1, y: 20}, {x: 2, y: 64}, {x: 3, y: 50}, {x: 4, y: 15}]
    }];

    $scope.options4 = {
      renderer: 'bar'
    };
    $scope.features4 = {
      palette: 'colorwheel',
      xAxis: {
      }
    };
    $scope.series4 = [{
      name: 'Series 1',
      data: [{x: 0, y: 230}, {x: 1, y: 1500}, {x: 2, y: 790}, {x: 3, y: 310}, {x: 4, y: 600}]
    }, {
      name: 'Series 2',
      data: [{x: 0, y: 300}, {x: 1, y: 2000}, {x: 2, y: 640}, {x: 3, y: 500}, {x: 4, y: 150}]
    }];

    $scope.options5 = {
      renderer: 'bar'
    };
    $scope.features5 = {
      palette: 'colorwheel',
      yAxis: {
        tickFormat: 'formatKMBT'
      }
    };
    $scope.series5 = [{
      name: 'Series 1',
      data: [{x: 0, y: 230}, {x: 1, y: 1500}, {x: 2, y: 790}, {x: 3, y: 310}, {x: 4, y: 600}]
    }, {
      name: 'Series 2',
      data: [{x: 0, y: 300}, {x: 1, y: 2000}, {x: 2, y: 640}, {x: 3, y: 500}, {x: 4, y: 150}]
    }];

    $scope.options6 = {
      renderer: 'line'
    };
    $scope.features6 = {
      palette: 'colorwheel',
      legend: {
        toggle: true,
        highlight: true
      }
    };
    $scope.series6 = [{
      name: 'Series 1',
      data: [{x: 0, y: 230}, {x: 1, y: 1500}, {x: 2, y: 790}, {x: 3, y: 310}, {x: 4, y: 600}]
    }, {
      name: 'Series 2',
      data: [{x: 0, y: 300}, {x: 1, y: 2000}, {x: 2, y: 640}, {x: 3, y: 500}, {x: 4, y: 150}]
    }];

    $scope.series0 = [];

    $scope.renderer0 = $scope.renderers[0];
    $scope.palette0 = $scope.palettes[0];

    $scope.rendererChanged(0);
    $scope.paletteChanged(0);
    $scope.changeSeriesData(0);
  })

  .controller('RickshawRealtimeChartCtrl', function($scope, $interval){

    $scope.options1 = {
      renderer: 'area'
    };

    var seriesData = [ [], []];
    var random = new Rickshaw.Fixtures.RandomData(50);

    for (var i = 0; i < 50; i++) {
      random.addData(seriesData);
    }

    var updateInterval = 800;

    $interval(function() {
      random.removeData(seriesData);
      random.addData(seriesData);
    }, updateInterval);

    $scope.series1 = [{
      name: 'Series 1',
      color: 'steelblue',
      data: seriesData[0]
    }, {
      name: 'Series 2',
      color: 'lightblue',
      data: seriesData[1]
    }];

    $scope.features1 = {
      hover: {
        xFormatter: function(x) {
          return new Date(x * 1000).toUTCString();
        },
        yFormatter: function(y) {
          return Math.floor(y) + '%';
        }
      }
    };
  })

  .controller('SparklineChartCtrl', function($scope){
    $scope.lineChart = {
      data: [15,16,18,17,16,18,25,26,23],
      options: {
        type: 'line',
        width: '100%',
        height:'250px',
        fillColor: 'rgba(34, 190, 239, .3)',
        lineColor: 'rgba(34, 190, 239, .5)',
        lineWidth: 2,
        spotRadius: 5,
        valueSpots:[5,6,8,7,6,8,5,4,7],
        minSpotColor: '#eaf9fe',
        maxSpotColor: '#00a3d8',
        highlightSpotColor: '#00a3d8',
        highlightLineColor: '#bec6ca',
        normalRangeMin: 0
      }
    };
    $scope.barChart = {
      data: [5,6,7,2,1,-4,-2,4,6,8],
      options: {
        width:'100%',
        type: 'bar',
        height: '250px',
        barWidth: '30px',
        barSpacing: 10,
        barColor: '#16a085',
        negBarColor: '#FF0066'
      }
    };
    $scope.pieChart = {
      data: [5,10,20,15],
      options: {
        type: 'pie',
        width: 'auto',
        height: '250px',
        sliceColors: ['#22beef','#a2d200','#ffc100','#ff4a43']
      }
    };
  })

  .controller('EasypiechartCtrl',function($scope){
    $scope.easypiechart = {
      percent: 65,
      options: {
        animate: {
          duration: 3000,
          enabled: true
        },
        barColor: '#1693A5',
        lineCap: 'round',
        size: 180,
        lineWidth: 5
      }
    };
    $scope.easypiechart2 = {
      percent: 30,
      options: {
        animate: {
          duration: 3000,
          enabled: true
        },
        barColor: '#A40778',
        scaleColor: false,
        lineCap: 'round',
        size: 180,
        lineWidth: 5
      }
    };
    $scope.easypiechart3 = {
      percent: 78,
      options: {
        animate: {
          duration: 3000,
          enabled: true
        },
        barColor: '#e05d6f',
        lineCap: 'butt',
        size: 220,
        lineWidth: 10
      }
    };
    $scope.easypiechart4 = {
      percent: 60,
      options: {
        animate: {
          duration: 3000,
          enabled: true
        },
        barColor: '#5cb85c',
        lineCap: 'round',
        scaleColor: false,
        size: 220,
        lineWidth: 10
      }
    };
  })

  .controller('GaugeChartCtrl', function($scope){

    $scope.gaugeChart1 = {
      data: {
        maxValue: 3000,
        animationSpeed: 40,
        val: 658
      },
      options: {
        lines: 12,
        // The number of lines to draw
        angle: 0.15,
        // The length of each line
        lineWidth: 0.44,
        // The line thickness
        pointer: {
          length: 1,
          // The radius of the inner circle
          strokeWidth: 0.035,
          // The rotation offset
          color: '#000000' // Fill color
        },
        limitMax: 'false',
        // If true, the pointer will not go past the end of the gauge
        colorStart: '#6FADCF',
        // Colors
        colorStop: '#8FC0DA',
        // just experiment with them
        strokeColor: '#f2f2f2',
        // to see which ones work best for you
        generateGradient: true,
        percentColors: [
          [0.0, '#1693A5'],
          [1.0, '#1693A5']
        ]
      }
    };

    $scope.gaugeChart2 = {
      data: {
        maxValue: 3000,
        animationSpeed: 40,
        val: 1258
      },
      options: {
        lines: 12,
        // The number of lines to draw
        angle: 0.10,
        // The length of each line
        lineWidth: 0.40,
        // The line thickness
        pointer: {
          length: 0.9,
          // The radius of the inner circle
          strokeWidth: 0.035,
          // The rotation offset
          color: '#000000' // Fill color
        },
        limitMax: 'false',
        // If true, the pointer will not go past the end of the gauge
        colorStart: '#6FADCF',
        // Colors
        colorStop: '#8FC0DA',
        // just experiment with them
        strokeColor: '#f2f2f2',
        // to see which ones work best for you
        generateGradient: true,
        percentColors: [
          [0.0, '#FF0066'],
          [1.0, '#FF0066']
        ]
      }
    };

    $scope.gaugeChart3 = {
      data: {
        maxValue: 3000,
        animationSpeed: 40,
        val: 1485
      },
      options: {
        lines: 12,
        // The number of lines to draw
        angle: 0.05,
        // The length of each line
        lineWidth: 0.34,
        // The line thickness
        pointer: {
          length: 0.8,
          // The radius of the inner circle
          strokeWidth: 0.035,
          // The rotation offset
          color: '#000000' // Fill color
        },
        limitMax: 'false',
        // If true, the pointer will not go past the end of the gauge
        colorStart: '#6FADCF',
        // Colors
        colorStop: '#8FC0DA',
        // just experiment with them
        strokeColor: '#f2f2f2',
        // to see which ones work best for you
        generateGradient: true,
        percentColors: [
          [0.0, '#428bca'],
          [1.0, '#428bca']
        ]
      }
    };

    $scope.gaugeChart4 = {
      data: {
        maxValue: 3000,
        animationSpeed: 40,
        val: 2514
      },
      options: {
        lines: 12,
        // The number of lines to draw
        angle: 0,
        // The length of each line
        lineWidth: 0.3,
        // The line thickness
        pointer: {
          length: 0.7,
          // The radius of the inner circle
          strokeWidth: 0.035,
          // The rotation offset
          color: '#000000' // Fill color
        },
        limitMax: 'false',
        // If true, the pointer will not go past the end of the gauge
        colorStart: '#6FADCF',
        // Colors
        colorStop: '#8FC0DA',
        // just experiment with them
        strokeColor: '#f2f2f2',
        // to see which ones work best for you
        generateGradient: true,
        percentColors: [
          [0.0, '#f0ad4e'],
          [1.0, '#f0ad4e']
        ]
      }
    };

  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('DashboardCtrl', function ($scope, $http){
    $scope.page = {
      title: 'Dashboard',
    };

  });


'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DaterangepickerCtrl
 * @description
 * # DaterangepickerCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('DaterangepickerCtrl', function ($scope, $moment) {
    $scope.startDate = $moment().subtract(1, 'days').format('MMMM D, YYYY');
    $scope.endDate = $moment().add(31, 'days').format('MMMM D, YYYY');
    $scope.rangeOptions = {
      ranges: {
        Today: [$moment(), $moment()],
        Yesterday: [$moment().subtract(1, 'days'), $moment().subtract(1, 'days')],
        'Last 7 Days': [$moment().subtract(6, 'days'), $moment()],
        'Last 30 Days': [$moment().subtract(29, 'days'), $moment()],
        'This Month': [$moment().startOf('month'), $moment().endOf('month')],
        'Last Month': [$moment().subtract(1, 'month').startOf('month'), $moment().subtract(1, 'month').endOf('month')]
      },
      opens: 'left',
      startDate: $moment().subtract(29, 'days'),
      endDate: $moment(),
      parentEl: '#content'
    };
  });
'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:FormImgCropCtrl
 * @description
 * # FormImgCropCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('FormImgCropCtrl', function ($scope) {
    $scope.myImage='';
    $scope.myCroppedImage='';
    $scope.cropType='circle';

    var handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:FormUploadCtrl
 * @description
 * # FormUploadCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('FormUploadCtrl', ['$scope', '$cookies', 'FileUploader', 'Requests', function($scope, $cookies, FileUploader, Requests) {
    
    var vm = this;

    var csrf_token = $cookies.csrftoken;
    
    var uploader = $scope.uploader = new FileUploader({
      // method: 'POST',
      // url: '/api/v1/req-items/'+reqItem+'/req-files/',
      url: 'static/scripts/modules/fileupload/upload.php'
      // headers : {
      //   'X-CSRFToken': csrf_token 
      // },
     
    });

    console.log(Requests);
    // console.log($scope.reqId);
    console.log(vm.reqId);
    // FILTERS

    uploader.filters.push({
      name: 'customFilter',
      fn: function() {
        return this.queue.length < 10;
      }
    });
    console.log(uploader);
    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
      console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
      console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
      console.log(fileItem.file);
      // var files = [];
      // console.log(files);
      // if(localStorage.files){
      //   console.log(localStorage.files);
        
      //   console.log(localStorage.length);
      // }

      // var m=fileItem.file;
      //   localStorage.setItem('files',JSON.stringify(m));

      // console.log(localStorage.files.length);
      // var files =JSON.parse(localStorage.getItem('files'));
      // console.log(files);
    

      // for ( var i = 0, len = localStorage.length; i < len; ++i ) {
      //   console.log( localStorage.getItem( localStorage.key( i ) ) );
      // }

      // localStorage.removeItem('us');
      //   delete window.localStorage["us"];
      //   var ct = $localStorage.files.length+=1;
      //   console.log(ct);
      // } else {
      //   var ct = 0;
      // }
      // console.log(ct);
      // var rq = 'req_file'+ct+'';
      // console.log(rq);
      
      // files = {rq2:fileItem.file};
      // console.log(files);
      // $localStorage.files = files;

      
      // for (var key in files) {
      //   if (files.hasOwnProperty(key)) {
      //     var i = Object.keys(files).indexOf(key);
      //     console.log(i);
      //     console.log(key);
      //     console.log(files[key]);

      //   }
      // }
      // console.log(files);
      // console.log($localStorage.files);
    };
    uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
  }]);

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:FormsCommonCtrl
 * @description
 * # FormsCommonCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('FormsCommonCtrl', function ($scope) {
    $scope.page = {
      title: 'Common Elements',
      subtitle: 'Place subtitle here...'
    };

    $scope.val = 36;

    var updateModel = function(val){
      $scope.$apply(function(){
        $scope.val = val;
      });
    };

    angular.element('#slider').on('slideStop', function(data){
      updateModel(data.value);
    });

    $scope.clear = function($event) {
      $scope.number.selected = undefined;
      $event.preventDefault();
      $event.stopPropagation();
    };

    $scope.number= {};
    $scope.numbers = ['One', 'Two', 'Three', 'Four'];

    $scope.country = {};
    $scope.countries = [ // Taken from https://gist.github.com/unceus/6501985
      {name: 'Afghanistan', code: 'AF'},
      {name: 'Åland Islands', code: 'AX'},
      {name: 'Albania', code: 'AL'},
      {name: 'Algeria', code: 'DZ'},
      {name: 'American Samoa', code: 'AS'},
      {name: 'Andorra', code: 'AD'},
      {name: 'Angola', code: 'AO'},
      {name: 'Anguilla', code: 'AI'},
      {name: 'Antarctica', code: 'AQ'},
      {name: 'Antigua and Barbuda', code: 'AG'},
      {name: 'Argentina', code: 'AR'},
      {name: 'Armenia', code: 'AM'},
      {name: 'Aruba', code: 'AW'},
      {name: 'Australia', code: 'AU'},
      {name: 'Austria', code: 'AT'},
      {name: 'Azerbaijan', code: 'AZ'},
      {name: 'Bahamas', code: 'BS'},
      {name: 'Bahrain', code: 'BH'},
      {name: 'Bangladesh', code: 'BD'},
      {name: 'Barbados', code: 'BB'},
      {name: 'Belarus', code: 'BY'},
      {name: 'Belgium', code: 'BE'},
      {name: 'Belize', code: 'BZ'},
      {name: 'Benin', code: 'BJ'},
      {name: 'Bermuda', code: 'BM'},
      {name: 'Bhutan', code: 'BT'},
      {name: 'Bolivia', code: 'BO'},
      {name: 'Bosnia and Herzegovina', code: 'BA'},
      {name: 'Botswana', code: 'BW'},
      {name: 'Bouvet Island', code: 'BV'},
      {name: 'Brazil', code: 'BR'},
      {name: 'British Indian Ocean Territory', code: 'IO'},
      {name: 'Brunei Darussalam', code: 'BN'},
      {name: 'Bulgaria', code: 'BG'},
      {name: 'Burkina Faso', code: 'BF'},
      {name: 'Burundi', code: 'BI'},
      {name: 'Cambodia', code: 'KH'},
      {name: 'Cameroon', code: 'CM'},
      {name: 'Canada', code: 'CA'},
      {name: 'Cape Verde', code: 'CV'},
      {name: 'Cayman Islands', code: 'KY'},
      {name: 'Central African Republic', code: 'CF'},
      {name: 'Chad', code: 'TD'},
      {name: 'Chile', code: 'CL'},
      {name: 'China', code: 'CN'},
      {name: 'Christmas Island', code: 'CX'},
      {name: 'Cocos (Keeling) Islands', code: 'CC'},
      {name: 'Colombia', code: 'CO'},
      {name: 'Comoros', code: 'KM'},
      {name: 'Congo', code: 'CG'},
      {name: 'Congo, The Democratic Republic of the', code: 'CD'},
      {name: 'Cook Islands', code: 'CK'},
      {name: 'Costa Rica', code: 'CR'},
      {name: 'Cote D\'Ivoire', code: 'CI'},
      {name: 'Croatia', code: 'HR'},
      {name: 'Cuba', code: 'CU'},
      {name: 'Cyprus', code: 'CY'},
      {name: 'Czech Republic', code: 'CZ'},
      {name: 'Denmark', code: 'DK'},
      {name: 'Djibouti', code: 'DJ'},
      {name: 'Dominica', code: 'DM'},
      {name: 'Dominican Republic', code: 'DO'},
      {name: 'Ecuador', code: 'EC'},
      {name: 'Egypt', code: 'EG'},
      {name: 'El Salvador', code: 'SV'},
      {name: 'Equatorial Guinea', code: 'GQ'},
      {name: 'Eritrea', code: 'ER'},
      {name: 'Estonia', code: 'EE'},
      {name: 'Ethiopia', code: 'ET'},
      {name: 'Falkland Islands (Malvinas)', code: 'FK'},
      {name: 'Faroe Islands', code: 'FO'},
      {name: 'Fiji', code: 'FJ'},
      {name: 'Finland', code: 'FI'},
      {name: 'France', code: 'FR'},
      {name: 'French Guiana', code: 'GF'},
      {name: 'French Polynesia', code: 'PF'},
      {name: 'French Southern Territories', code: 'TF'},
      {name: 'Gabon', code: 'GA'},
      {name: 'Gambia', code: 'GM'},
      {name: 'Georgia', code: 'GE'},
      {name: 'Germany', code: 'DE'},
      {name: 'Ghana', code: 'GH'},
      {name: 'Gibraltar', code: 'GI'},
      {name: 'Greece', code: 'GR'},
      {name: 'Greenland', code: 'GL'},
      {name: 'Grenada', code: 'GD'},
      {name: 'Guadeloupe', code: 'GP'},
      {name: 'Guam', code: 'GU'},
      {name: 'Guatemala', code: 'GT'},
      {name: 'Guernsey', code: 'GG'},
      {name: 'Guinea', code: 'GN'},
      {name: 'Guinea-Bissau', code: 'GW'},
      {name: 'Guyana', code: 'GY'},
      {name: 'Haiti', code: 'HT'},
      {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
      {name: 'Holy See (Vatican City State)', code: 'VA'},
      {name: 'Honduras', code: 'HN'},
      {name: 'Hong Kong', code: 'HK'},
      {name: 'Hungary', code: 'HU'},
      {name: 'Iceland', code: 'IS'},
      {name: 'India', code: 'IN'},
      {name: 'Indonesia', code: 'ID'},
      {name: 'Iran, Islamic Republic Of', code: 'IR'},
      {name: 'Iraq', code: 'IQ'},
      {name: 'Ireland', code: 'IE'},
      {name: 'Isle of Man', code: 'IM'},
      {name: 'Israel', code: 'IL'},
      {name: 'Italy', code: 'IT'},
      {name: 'Jamaica', code: 'JM'},
      {name: 'Japan', code: 'JP'},
      {name: 'Jersey', code: 'JE'},
      {name: 'Jordan', code: 'JO'},
      {name: 'Kazakhstan', code: 'KZ'},
      {name: 'Kenya', code: 'KE'},
      {name: 'Kiribati', code: 'KI'},
      {name: 'Korea, Democratic People\'s Republic of', code: 'KP'},
      {name: 'Korea, Republic of', code: 'KR'},
      {name: 'Kuwait', code: 'KW'},
      {name: 'Kyrgyzstan', code: 'KG'},
      {name: 'Lao People\'s Democratic Republic', code: 'LA'},
      {name: 'Latvia', code: 'LV'},
      {name: 'Lebanon', code: 'LB'},
      {name: 'Lesotho', code: 'LS'},
      {name: 'Liberia', code: 'LR'},
      {name: 'Libyan Arab Jamahiriya', code: 'LY'},
      {name: 'Liechtenstein', code: 'LI'},
      {name: 'Lithuania', code: 'LT'},
      {name: 'Luxembourg', code: 'LU'},
      {name: 'Macao', code: 'MO'},
      {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
      {name: 'Madagascar', code: 'MG'},
      {name: 'Malawi', code: 'MW'},
      {name: 'Malaysia', code: 'MY'},
      {name: 'Maldives', code: 'MV'},
      {name: 'Mali', code: 'ML'},
      {name: 'Malta', code: 'MT'},
      {name: 'Marshall Islands', code: 'MH'},
      {name: 'Martinique', code: 'MQ'},
      {name: 'Mauritania', code: 'MR'},
      {name: 'Mauritius', code: 'MU'},
      {name: 'Mayotte', code: 'YT'},
      {name: 'Mexico', code: 'MX'},
      {name: 'Micronesia, Federated States of', code: 'FM'},
      {name: 'Moldova, Republic of', code: 'MD'},
      {name: 'Monaco', code: 'MC'},
      {name: 'Mongolia', code: 'MN'},
      {name: 'Montserrat', code: 'MS'},
      {name: 'Morocco', code: 'MA'},
      {name: 'Mozambique', code: 'MZ'},
      {name: 'Myanmar', code: 'MM'},
      {name: 'Namibia', code: 'NA'},
      {name: 'Nauru', code: 'NR'},
      {name: 'Nepal', code: 'NP'},
      {name: 'Netherlands', code: 'NL'},
      {name: 'Netherlands Antilles', code: 'AN'},
      {name: 'New Caledonia', code: 'NC'},
      {name: 'New Zealand', code: 'NZ'},
      {name: 'Nicaragua', code: 'NI'},
      {name: 'Niger', code: 'NE'},
      {name: 'Nigeria', code: 'NG'},
      {name: 'Niue', code: 'NU'},
      {name: 'Norfolk Island', code: 'NF'},
      {name: 'Northern Mariana Islands', code: 'MP'},
      {name: 'Norway', code: 'NO'},
      {name: 'Oman', code: 'OM'},
      {name: 'Pakistan', code: 'PK'},
      {name: 'Palau', code: 'PW'},
      {name: 'Palestinian Territory, Occupied', code: 'PS'},
      {name: 'Panama', code: 'PA'},
      {name: 'Papua New Guinea', code: 'PG'},
      {name: 'Paraguay', code: 'PY'},
      {name: 'Peru', code: 'PE'},
      {name: 'Philippines', code: 'PH'},
      {name: 'Pitcairn', code: 'PN'},
      {name: 'Poland', code: 'PL'},
      {name: 'Portugal', code: 'PT'},
      {name: 'Puerto Rico', code: 'PR'},
      {name: 'Qatar', code: 'QA'},
      {name: 'Reunion', code: 'RE'},
      {name: 'Romania', code: 'RO'},
      {name: 'Russian Federation', code: 'RU'},
      {name: 'Rwanda', code: 'RW'},
      {name: 'Saint Helena', code: 'SH'},
      {name: 'Saint Kitts and Nevis', code: 'KN'},
      {name: 'Saint Lucia', code: 'LC'},
      {name: 'Saint Pierre and Miquelon', code: 'PM'},
      {name: 'Saint Vincent and the Grenadines', code: 'VC'},
      {name: 'Samoa', code: 'WS'},
      {name: 'San Marino', code: 'SM'},
      {name: 'Sao Tome and Principe', code: 'ST'},
      {name: 'Saudi Arabia', code: 'SA'},
      {name: 'Senegal', code: 'SN'},
      {name: 'Serbia and Montenegro', code: 'CS'},
      {name: 'Seychelles', code: 'SC'},
      {name: 'Sierra Leone', code: 'SL'},
      {name: 'Singapore', code: 'SG'},
      {name: 'Slovakia', code: 'SK'},
      {name: 'Slovenia', code: 'SI'},
      {name: 'Solomon Islands', code: 'SB'},
      {name: 'Somalia', code: 'SO'},
      {name: 'South Africa', code: 'ZA'},
      {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
      {name: 'Spain', code: 'ES'},
      {name: 'Sri Lanka', code: 'LK'},
      {name: 'Sudan', code: 'SD'},
      {name: 'Suriname', code: 'SR'},
      {name: 'Svalbard and Jan Mayen', code: 'SJ'},
      {name: 'Swaziland', code: 'SZ'},
      {name: 'Sweden', code: 'SE'},
      {name: 'Switzerland', code: 'CH'},
      {name: 'Syrian Arab Republic', code: 'SY'},
      {name: 'Taiwan, Province of China', code: 'TW'},
      {name: 'Tajikistan', code: 'TJ'},
      {name: 'Tanzania, United Republic of', code: 'TZ'},
      {name: 'Thailand', code: 'TH'},
      {name: 'Timor-Leste', code: 'TL'},
      {name: 'Togo', code: 'TG'},
      {name: 'Tokelau', code: 'TK'},
      {name: 'Tonga', code: 'TO'},
      {name: 'Trinidad and Tobago', code: 'TT'},
      {name: 'Tunisia', code: 'TN'},
      {name: 'Turkey', code: 'TR'},
      {name: 'Turkmenistan', code: 'TM'},
      {name: 'Turks and Caicos Islands', code: 'TC'},
      {name: 'Tuvalu', code: 'TV'},
      {name: 'Uganda', code: 'UG'},
      {name: 'Ukraine', code: 'UA'},
      {name: 'United Arab Emirates', code: 'AE'},
      {name: 'United Kingdom', code: 'GB'},
      {name: 'United States', code: 'US'},
      {name: 'United States Minor Outlying Islands', code: 'UM'},
      {name: 'Uruguay', code: 'UY'},
      {name: 'Uzbekistan', code: 'UZ'},
      {name: 'Vanuatu', code: 'VU'},
      {name: 'Venezuela', code: 'VE'},
      {name: 'Vietnam', code: 'VN'},
      {name: 'Virgin Islands, British', code: 'VG'},
      {name: 'Virgin Islands, U.S.', code: 'VI'},
      {name: 'Wallis and Futuna', code: 'WF'},
      {name: 'Western Sahara', code: 'EH'},
      {name: 'Yemen', code: 'YE'},
      {name: 'Zambia', code: 'ZM'},
      {name: 'Zimbabwe', code: 'ZW'}
    ];

    $scope.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];
    $scope.multipleDemo = {};
    $scope.multipleDemo.colors = ['Blue','Red'];

    $scope.htmlVariable = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li class="text-red">Super Easy <b>Theming</b> Options</li><li>Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li>Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';

  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:FormsValidateCtrl
 * @description
 * # FormsValidateCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('FormsValidateCtrl', function ($scope) {
    $scope.page = {
      title: 'Validation Elements',
      subtitle: 'Place subtitle here...'
    };

    // function to submit the form after all validation has occurred
		$scope.submitForm = function(isValid) {

			// check to make sure the form is completely valid
			if (isValid) {
				console.log('our form is amazing');
			}

		};

    $scope.notBlackListed = function(value) {
      var blacklist = ['bad@domain.com','verybad@domain.com'];
      return blacklist.indexOf(value) === -1;
    };

  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:FormsWizardCtrl
 * @description
 * # FormsWizardCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('FormWizardCtrl', function ($scope) {
    $scope.page = {
      title: 'Form Wizard',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:FullwidthlayoutCtrl
 * @description
 * # FullwidthlayoutCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('FullwidthlayoutCtrl', function ($scope) {
    $scope.page = {
      title: 'Full-width Layout',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('HelpCtrl', function ($scope) {
     $scope.page = {
      title: 'Documentation',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:HzmenuCtrl
 * @description
 * # HzmenuCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('HzmenuCtrl', function ($scope) {
     $scope.page = {
      title: 'Horizontal menu Layout',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('MailComposeCtrl', function ($scope) {
    $scope.availableRecipients = ['RLake@nec.gov','RBastian@lacus.io','VMonroe@orci.ly','YMckenzie@mattis.gov','VMcmyne@molestie.org','BKliban@aliquam.gov','HHellems@tincidunt.org','KAngell@sollicitudin.ly'];
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailInboxCtrl
 * @description
 * # MailInboxCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('MailInboxCtrl', function ($scope, $resource) {
    $scope.mails = $resource('static/scripts/jsons/mails.json').query();

    $scope.selectedAll = false;

    $scope.selectAll = function () {

      if ($scope.selectedAll) {
        $scope.selectedAll = false;
      } else {
        $scope.selectedAll = true;
      }

      angular.forEach($scope.mails, function(mail) {
        mail.selected = $scope.selectedAll;
      });
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailSingleCtrl
 * @description
 * # MailSingleCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('MailSingleCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailCtrl
 * @description
 * # MailCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('MailCtrl', function ($scope) {

  });

'use strict';

angular.module('minovateApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.main = {
      title: 'WeASepp',
      settings: {
        navbarHeaderColor: 'scheme-default',
        sidebarColor: 'scheme-default',
        brandingColor: 'scheme-default',
        activeColor: 'default-scheme-color',
        headerFixed: true,
        asideFixed: true,
        rightbarShow: false
      }
    };

    // $scope.ajaxFaker = function(){
    //   $scope.data=[];
    //   var url = 'http://www.filltext.com/?rows=10&fname={firstName}&lname={lastName}&delay=5&callback=JSON_CALLBACK';

    //   $http.jsonp(url).success(function(data){
    //     $scope.data=data;
    //     console.log('cecky');
    //     angular.element('.tile.refreshing').removeClass('refreshing');
    //   });
    // };
  });
'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MapsGoogleMapCtrl
 * @description
 * # MapsGoogleMapCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('GoogleMapCtrl', function ($scope) {
    $scope.page = {
      title: 'Google Maps',
      subtitle: 'Place subtitle here...'
    };

  })

  .controller('Map1Ctrl', function ($scope) {
    $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
    $scope.options = {scrollwheel: false};
  })

  .controller('Map2Ctrl', function($scope) {
    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, bounds: {}};
    $scope.options = {scrollwheel: false};
    $scope.drawingManagerOptions = {
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      },
      circleOptions: {
        fillColor: '#ffff00',
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1
      }
    };
    $scope.markersAndCircleFlag = true;
    $scope.drawingManagerControl = {};
    $scope.$watch('markersAndCircleFlag', function() {
      if (!$scope.drawingManagerControl.getDrawingManager) {
        return;
      }
      var controlOptions = angular.copy($scope.drawingManagerOptions);
      if (!$scope.markersAndCircleFlag) {
        controlOptions.drawingControlOptions.drawingModes.shift();
        controlOptions.drawingControlOptions.drawingModes.shift();
      }
      $scope.drawingManagerControl.getDrawingManager().setOptions(controlOptions);
    });
  })

  .controller('Map3Ctrl', function($scope) {
    $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 4 };
    $scope.options = {scrollwheel: false};
    $scope.showWeather = true;
  })

  .controller('Map4Ctrl', function($scope, $log) {
    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680}, zoom: 4};
    $scope.options = {scrollwheel: false};
    $scope.marker = {
      coords: {
        latitude: 40.1451,
        longitude: -99.6680
      },
      show: false,
      id: 0
    };

    $scope.windowOptions = {
      visible: false
    };

    $scope.onClick = function () {
      $scope.windowOptions.visible = !$scope.windowOptions.visible;
    };

    $scope.closeClick = function () {
      $scope.windowOptions.visible = false;
    };

    $scope.title = 'Window Title!';
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MapsVectorMapCtrl
 * @description
 * # MapsVectorMapCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('VectorMapCtrl', function ($scope) {

    $scope.page = {
      title: 'Vector Maps',
      subtitle: 'Place subtitle here...'
    };

    var sampleData = {'af':'16.63','al':'11.58','dz':'158.97','ao':'85.81','ag':'1.1','ar':'351.02','am':'8.83','au':'1219.72','at':'366.26','az':'52.17','bs':'7.54','bh':'21.73','bd':'105.4','bb':'3.96','by':'52.89','be':'461.33','bz':'1.43','bj':'6.49','bt':'1.4','bo':'19.18','ba':'16.2','bw':'12.5','br':'2023.53','bn':'11.96','bg':'44.84','bf':'8.67','bi':'1.47','kh':'11.36','cm':'21.88','ca':'1563.66','cv':'1.57','cf':'2.11','td':'7.59','cl':'199.18','cn':'5745.13','co':'283.11','km':'0.56','cd':'12.6','cg':'11.88','cr':'35.02','ci':'22.38','hr':'59.92','cy':'22.75','cz':'195.23','dk':'304.56','dj':'1.14','dm':'0.38','do':'50.87','ec':'61.49','eg':'216.83','sv':'21.8','gq':'14.55','er':'2.25','ee':'19.22','et':'30.94','fj':'3.15','fi':'231.98','fr':'2555.44','ga':'12.56','gm':'1.04','ge':'11.23','de':'3305.9','gh':'18.06','gr':'305.01','gd':'0.65','gt':'40.77','gn':'4.34','gw':'0.83','gy':'2.2','ht':'6.5','hn':'15.34','hk':'226.49','hu':'132.28','is':'12.77','in':'1430.02','id':'695.06','ir':'337.9','iq':'84.14','ie':'204.14','il':'201.25','it':'2036.69','jm':'13.74','jp':'5390.9','jo':'27.13','kz':'129.76','ke':'32.42','ki':'0.15','kr':'986.26','undefined':'5.73','kw':'117.32','kg':'4.44','la':'6.34','lv':'23.39','lb':'39.15','ls':'1.8','lr':'0.98','ly':'77.91','lt':'35.73','lu':'52.43','mk':'9.58','mg':'8.33','mw':'5.04','my':'218.95','mv':'1.43','ml':'9.08','mt':'7.8','mr':'3.49','mu':'9.43','mx':'1004.04','md':'5.36','mn':'5.81','me':'3.88','ma':'91.7','mz':'10.21','mm':'35.65','na':'11.45','np':'15.11','nl':'770.31','nz':'138','ni':'6.38','ne':'5.6','ng':'206.66','no':'413.51','om':'53.78','pk':'174.79','pa':'27.2','pg':'8.81','py':'17.17','pe':'153.55','ph':'189.06','pl':'438.88','pt':'223.7','qa':'126.52','ro':'158.39','ru':'1476.91','rw':'5.69','ws':'0.55','st':'0.19','sa':'434.44','sn':'12.66','rs':'38.92','sc':'0.92','sl':'1.9','sg':'217.38','sk':'86.26','si':'46.44','sb':'0.67','za':'354.41','es':'1374.78','lk':'48.24','kn':'0.56','lc':'1','vc':'0.58','sd':'65.93','sr':'3.3','sz':'3.17','se':'444.59','ch':'522.44','sy':'59.63','tw':'426.98','tj':'5.58','tz':'22.43','th':'312.61','tl':'0.62','tg':'3.07','to':'0.3','tt':'21.2','tn':'43.86','tr':'729.05','tm':0,'ug':'17.12','ua':'136.56','ae':'239.65','gb':'2258.57','us':'14624.18','uy':'40.71','uz':'37.72','vu':'0.72','ve':'285.21','vn':'101.99','ye':'30.02','zm':'15.69','zw':'5.57'};

    $scope.worldMap = {
      map: 'world_en',
      backgroundColor: null,
      borderColor: '#fff',
      borderOpacity: 0.25,
      borderWidth: 0.5,
      color: '#e7eaeb',
      enableZoom: true,
      hoverColor: '#16a085',
      normalizeFunction: 'polynomial',
      scaleColors: ['#C8EEFF', '#006491'],
      selectedColor: '#666',
      values: sampleData
    };

    $scope.UsaMap = {
      map: 'usa_en',
      backgroundColor: null,
      borderColor: '#222',
      borderOpacity: 0.25,
      borderWidth: 1,
      color: '#e7eaeb',
      hoverColor: '#16a085',
      selectedColor: '#666666',
      enableZoom: true,
      showTooltip: true,
      selectedRegion: 'MO'
    };

    $scope.EuropeMap = {
      map: 'europe_en',
      backgroundColor: null,
      borderColor: '#222',
      borderOpacity: 0.25,
      borderWidth: 1,
      color: '#e7eaeb',
      hoverColor: '#16a085',
      selectedColor: '#666666',
      enableZoom: true,
      showTooltip: true
    };

    $scope.GermanyMap = {
      map: 'germany_en',
      backgroundColor: null,
      borderColor: '#222',
      borderOpacity: 0.25,
      borderWidth: 1,
      color: '#e7eaeb',
      hoverColor: '#16a085',
      selectedColor: '#666666',
      enableZoom: true,
      showTooltip: true
    };

  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('NavCtrl', function ($scope) {
    $scope.oneAtATime = false;

    $scope.status = {
      isFirstOpen: true,
      isSecondOpen: true,
      isThirdOpen: true
    };
  });
// 'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the minovateApp
 */
// angular.module('minovateApp')
//   .controller('NavCtrl', function ($scope) {
//     $scope.oneAtATime = false;

//     $scope.status = {
//       isFirstOpen: true,
//       isSecondOpen: true,
//       isThirdOpen: true
//     };
//   });
'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:SparklineCtrl
 * @description
 * # sparklineCtrl navbar
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('SparklineCtrl', function ($scope) {
    $scope.navChart1 = {
      data: [5, 8, 3, 4, 6, 2, 1, 9, 7],
      options: {
        type: 'bar',
        barColor: '#92424e',
        barWidth: '6px',
        height: '36px'
      }
    };
    $scope.navChart2 = {
      data: [2, 4, 5, 3, 8, 9, 7, 3, 5],
      options: {
        type: 'bar',
        barColor: '#397193',
        barWidth: '6px',
        height: '36px'
      }
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:OffcanvaslayoutCtrl
 * @description
 * # OffcanvaslayoutCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('OffcanvaslayoutCtrl', function ($scope) {
    $scope.page = {
      title: 'Off-canvas sidebar',
      subtitle: 'On small devices'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesChatCtrl
 * @description
 * # PagesChatCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('ChatCtrl', function ($scope, $resource) {
    $scope.inbox = $resource('scripts/jsons/chats.json').query();

    $scope.archive = function(index) {
      $scope.inbox.splice(index, 1);
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesForgotPasswordCtrl
 * @description
 * # PagesForgotPasswordCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('ForgotPasswordCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesGalleryCtrl
 * @description
 * # PagesGalleryCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('GalleryCtrl', function ($scope) {

    $scope.page = {
      title: 'Gallery',
      subtitle: 'Place subtitle here...'
    };

    $scope.images = [
      {
        src: 'http://lorempixel.com/800/600/cats/1',
        title: 'Sed ut perspiciatis unde',
        category: 'cats',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/cats/2',
        title: 'Quis autem vel eum iure',
        category: 'cats',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/cats/3',
        title: 'Temporibus autem quibusdam',
        category: 'cats',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/cats/4',
        title: 'Neque porro quisquam est',
        category: 'cats',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/cats/5',
        title: 'Et harum quidem rerum',
        category: 'cats',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/animals/6',
        title: 'Nemo enim ipsam voluptatem',
        category: 'animals',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/animals/7',
        title: 'At vero eos et accusamus',
        category: 'animals',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/animals/8',
        title: 'Itaque earum rerum hic tenetur',
        category: 'animals',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/animals/9',
        title: 'Ut enim ad minima veniam',
        category: 'animals',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/animals/10',
        title: 'Temporibus autem quibusdam',
        category: 'animals',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/city/1',
        title: 'Neque porro quisquam est',
        category: 'cities',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/city/2',
        title: 'Nam libero tempore',
        category: 'cities',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/city/3',
        title: 'Neque porro quisquam est',
        category: 'cities',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/city/4',
        title: 'Nam libero tempore',
        category: 'cities',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/city/5',
        title: 'Neque porro quisquam est',
        category: 'cities',
        selected: false
      },{
        src: 'http://lorempixel.com/800/600/city/6',
        title: 'Nam libero tempore',
        category: 'cities',
        selected: false
     }
    ];

    $scope.selectedAll = false;
    $scope.isSelected = false;

    $scope.selectAll = function () {

      if ($scope.selectedAll) {
        $scope.selectedAll = false;
        $scope.isSelected = false;
      } else {
        $scope.selectedAll = true;
        $scope.isSelected = true;
      }

      angular.forEach($scope.images, function(image) {
        image.selected = $scope.selectedAll;
      });
    };

    $scope.selectImage = function(index) {

      var i = 0;

      if ($scope.images[index].selected) {
        $scope.images[index].selected = false;
      } else {
        $scope.images[index].selected = true;
        $scope.isSelected = true;
      }

      angular.forEach($scope.images, function(image) {
        if (image.selected) {
          i++;
        }
      });

      if (i === 0) {
        $scope.isSelected = false;
      }
    };

  });

// 'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesLoginCtrl
 * @description
 * # PagesLoginCtrl
 * Controller of the minovateApp
 */
// angular.module('minovateApp')
//   .controller('LoginCtrl', function ($scope, $state) {
//     $scope.login = function() {
//       $state.go('app.dashboard');
//     };
//   });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesProfileCtrl
 * @description
 * # PagesProfileCtrl
 * Controller of the minovateApp
 */
// angular.module('minovateApp')
//   .controller('ProfileCtrl', function ($scope) {
//     $scope.page = {
//       title: 'Profile Page',
//       subtitle: 'Place subtitle here...'
//     };
//   });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesSearchResultsCtrl
 * @description
 * # PagesSearchResultsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('SearchResultsCtrl', function ($scope) {
    $scope.page = {
      title: 'Search Results',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesSignupCtrl
 * @description
 * # PagesSignupCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('SignupCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesTimelineCtrl
 * @description
 * # PagesTimelineCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('TimelineCtrl', function ($scope) {
    $scope.page = {
      title: 'Timeline',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:RtlCtrl
 * @description
 * # RtlCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('RtlCtrl', function ($scope) {
    $scope.page = {
      title: 'RTL Layout',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ShopOrdersCtrl
 * @description
 * # ShopOrdersCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('InvoicesCtrl', function ($scope) {
    $scope.page = {
      title: 'Invoices',
      subtitle: 'Place subtitle here...'
    };
  })

  .controller('InvoicesTableCtrl', function ($scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource) {

    var vm = this;
    vm.invoices = [];
    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withBootstrap()
      .withOption('order', [[1, 'asc']])
      .withDOM('<"row"<"col-md-8 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"pull-right"f>>>t<"row"<"col-md-4 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"inline-controls text-center"i>><"col-md-4 col-sm-12"p>>')
      .withLanguage({
        "sLengthMenu": 'View _MENU_ records',
        "sInfo":  'Found _TOTAL_ records',
        "oPaginate": {
          "sPage":    "Page",
          "sPageOf":  "of"
        }
      })
      .withPaginationType('input')
      //.withScroller()
      //.withOption("sScrollY", false)
      //.withOption("sScrollX")
      .withColumnFilter();


    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0).notSortable(),
      DTColumnDefBuilder.newColumnDef(6).notSortable()
    ];

    vm.selectedAll = false;

    vm.selectAll = function () {

      if ($scope.selectedAll) {
        $scope.selectedAll = false;
      } else {
        $scope.selectedAll = true;
      }

      angular.forEach(vm.invoices, function(invoice) {
        invoice.selected = $scope.selectedAll;
      });
    };

    $resource('http://www.filltext.com/?rows=300&id={index}&date={date|01-01-2012,01-01-2015}&invoicefor={firstName}~{lastName}&status=["paid","unpaid","sent","cancelled"]&total={numberLength|3}}&selected=false&pretty=true').query().$promise.then(function(invoices) {
      vm.invoices = invoices;
    });

  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ShopOrdersCtrl
 * @description
 * # ShopOrdersCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('OrdersCtrl', function ($scope) {
    $scope.page = {
      title: 'Orders',
      subtitle: 'Place subtitle here...'
    };
  })

  .controller('OrdersTableCtrl', function ($scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource) {

    var vm = this;
    vm.orders = [];
    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withBootstrap()
      .withOption('order', [[1, 'asc']])
      .withDOM('<"row"<"col-md-8 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"pull-right"f>>>t<"row"<"col-md-4 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"inline-controls text-center"i>><"col-md-4 col-sm-12"p>>')
      .withLanguage({
        "sLengthMenu": 'View _MENU_ records',
        "sInfo":  'Found _TOTAL_ records',
        "oPaginate": {
          "sPage":    "Page",
          "sPageOf":  "of"
        }
      })
      .withPaginationType('input')
      //.withScroller()
      //.withOption("sScrollY", false)
      //.withOption("sScrollX")
      .withColumnFilter();


    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0).notSortable(),
      DTColumnDefBuilder.newColumnDef(8).notSortable()
    ];

    vm.selectedAll = false;

    vm.selectAll = function () {

      if ($scope.selectedAll) {
        $scope.selectedAll = false;
      } else {
        $scope.selectedAll = true;
      }

      angular.forEach(vm.orders, function(order) {
        order.selected = $scope.selectedAll;
      });
    };

    $resource('http://www.filltext.com/?rows=300&id={index}&date={date|01-01-2012,01-01-2015}&placedby={firstName}~{lastName}&status=["pending","closed","sent","cancelled"]&quantity={number|20}&total={numberLength|3}}&shipto={streetAddress}~{city}&selected=false&pretty=true').query().$promise.then(function(orders) {
      vm.orders = orders;
    });

  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ShopOrdersCtrl
 * @description
 * # ShopOrdersCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('ProductsCtrl', function ($scope) {
    $scope.page = {
      title: 'Products',
      subtitle: 'Place subtitle here...'
    };
  })

  .controller('ProductsTableCtrl', function ($scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource) {

    var vm = this;
    vm.products = [];
    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withBootstrap()
      .withOption('order', [[1, 'asc']])
      .withDOM('<"row"<"col-md-8 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"pull-right"f>>>t<"row"<"col-md-4 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"inline-controls text-center"i>><"col-md-4 col-sm-12"p>>')
      .withLanguage({
        "sLengthMenu": 'View _MENU_ records',
        "sInfo":  'Found _TOTAL_ records',
        "oPaginate": {
          "sPage":    "Page",
          "sPageOf":  "of"
        }
      })
      .withPaginationType('input')
      //.withScroller()
      //.withOption("sScrollY", false)
      //.withOption("sScrollX")
      .withColumnFilter();


    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0).notSortable(),
      DTColumnDefBuilder.newColumnDef(7).notSortable()
    ];

    vm.selectedAll = false;

    vm.selectAll = function () {

      if ($scope.selectedAll) {
        $scope.selectedAll = false;
      } else {
        $scope.selectedAll = true;
      }

      angular.forEach(vm.products, function(product) {
        product.selected = $scope.selectedAll;
      });
    };

    $resource('http://www.filltext.com/?rows=300&id={index}&name={lorem|2}&category=["Food","Drinks","Accesories","Electro","Kitchen","Bathroom"]&price={numberLength|3}}&date={date|01-01-2012,01-01-2015}&status=["published","not published","deleted"]&pretty=true').query().$promise.then(function(products) {
      vm.products = products;
    });

  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ShopSingleInvoiceCtrl
 * @description
 * # ShopSingleInvoiceCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('SingleInvoiceCtrl', function ($scope) {
    $scope.page = {
      title: 'Single Invoice',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ShopSingleOrderCtrl
 * @description
 * # ShopSingleOrderCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('SingleOrderCtrl', function ($scope) {
    $scope.page = {
      title: 'Single Order',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ShopSingleProductCtrl
 * @description
 * # ShopSingleProductCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('SingleProductCtrl', function ($scope) {
    $scope.page = {
      title: 'Single Product',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:SidebarsmlayoutCtrl
 * @description
 * # SidebarsmlayoutCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('SidebarsmlayoutCtrl', function ($scope) {
    $scope.page = {
      title: 'Small Sidebar Layout',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:SidebarxslayoutCtrl
 * @description
 * # SidebarxslayoutCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('SidebarxslayoutCtrl', function ($scope) {
    $scope.page = {
      title: 'Extra-small Sidebar Layout',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:TablesBootstrapCtrl
 * @description
 * # TablesBootstrapCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('TablesBootstrapCtrl', function ($scope) {
     $scope.page = {
      title: 'Bootstrap Tables',
      subtitle: 'Place subtitle here...'
    };

    $scope.users = [
      { name: 'Mark', lastname: 'Otto', username: '@mdo', checked: true, selected: false },
      { name: 'Jacob', lastname: 'Thornton', username: '@fat', checked: false, selected: false },
      { name: 'Mary', lastname: 'the Bird', username: '@twitter', checked: true, selected: false },
      { name: 'Marv', lastname: 'Bond', username: '@marvo', checked: false, selected: false },
      { name: 'Larry', lastname: 'Cardl', username: '@lurie', checked: false, selected: false },
      { name: 'Jennifer', lastname: 'Minelly', username: '@jen', checked: true, selected: false },
      { name: 'Sly', lastname: 'Stall', username: '@sly', checked: true, selected: false },
      { name: 'Arnold', lastname: 'Percy', username: '@arnie', checked: true, selected: false },
      { name: 'Jack', lastname: 'Black', username: '@blacko', checked: false, selected: false }
    ];

    $scope.selectedAll = false;

    $scope.selectAll = function () {

      if ($scope.selectedAll) {
        $scope.selectedAll = false;
      } else {
        $scope.selectedAll = true;
      }

      angular.forEach($scope.users, function(user) {
        user.selected = $scope.selectedAll;
      });
    };

  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:TablesDatatablesCtrl
 * @description
 * # TablesDatatablesCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

  .controller('TablesDatatablesCtrl', function ($scope) {

    $scope.page = {
      title: 'DataTables',
      subtitle: 'Place subtitle here...'
    };

  })

  .controller('BasicDatatableCtrl', function ($scope, DTOptionsBuilder, DTColumnBuilder, $resource) {

    var vm = this;
    vm.message = '';

    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
      angular.element('td', nRow).unbind('click');
      angular.element('td', nRow).bind('click', function() {
        $scope.$apply(function() {
          vm.someClickHandler(aData);
        });
        angular.element('.row_selected').removeClass('row_selected');
        angular.element(nRow).addClass('row_selected');
      });
      return nRow;
    }

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        return $resource('http://www.filltext.com/?rows=300&id={index}&firstName={firstName}&lastName={lastName}&pretty=true').query().$promise;
    })

      .withPaginationType('full_numbers')
      .withBootstrap()
      // Activate col reorder plugin
      .withColReorder()
      .withColReorderCallback(function() {
        console.log('Columns order has been changed with: ' + this.fnOrder());
      })
      .withOption('rowCallback', rowCallback);

    vm.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle('ID'),
      DTColumnBuilder.newColumn('firstName').withTitle('First name'),
      DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];

    function someClickHandler(info) {
      vm.message = info.id + ' - ' + info.firstName;
    }

    vm.someClickHandler = someClickHandler;

  })

  .controller('ChangeDatatableCtrl', function ($scope, $resource, DTOptionsBuilder, DTColumnDefBuilder) {

    var vm = this;

    function _buildPerson2Add(id) {
      return {
        id: id,
        firstName: 'Foo' + id,
        lastName: 'Bar' + id
      };
    }
    function addPerson() {
      vm.persons.push(angular.copy(vm.person2Add));
      vm.person2Add = _buildPerson2Add(vm.person2Add.id + 1);
    }
    function modifyPerson(index) {
      vm.persons.splice(index, 1, angular.copy(vm.person2Add));
      vm.person2Add = _buildPerson2Add(vm.person2Add.id + 1);
    }
    function removePerson(index) {
      vm.persons.splice(index, 1);
    }

    vm.persons = $resource('http://www.filltext.com/?rows=16&id={index}&firstName={firstName}&lastName={lastName}&pretty=true').query();
    vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withBootstrap();
    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2),
      DTColumnDefBuilder.newColumnDef(3).notSortable()
    ];
    vm.person2Add = _buildPerson2Add(1);
    vm.addPerson = addPerson;
    vm.modifyPerson = modifyPerson;
    vm.removePerson = removePerson;

  })

  .controller('ResponsiveDatatableCtrl', function ($scope, DTOptionsBuilder, DTColumnBuilder) {

    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('http://www.filltext.com/?rows=300&id={index}&firstName={firstName}&lastName={lastName}&tel={phone|format}&address={streetAddress}&city={city}&state={usState|abbr}&zip={zip}&pretty=true')
      .withPaginationType('full_numbers')
      .withBootstrap()
      // Active Responsive plugin
      .withOption('responsive', true);
    vm.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle('ID'),
      DTColumnBuilder.newColumn('firstName').withTitle('First name'),
      DTColumnBuilder.newColumn('lastName').withTitle('Last name'),
      // .notVisible() does not work in this case. Use .withClass('none') instead
      DTColumnBuilder.newColumn('tel').withTitle('Phone').withClass('none'),
      DTColumnBuilder.newColumn('address').withTitle('Street Address').withClass('none'),
      DTColumnBuilder.newColumn('city').withTitle('City').withClass('none'),
      DTColumnBuilder.newColumn('state').withTitle('State').withClass('none'),
      DTColumnBuilder.newColumn('zip').withTitle('Zip').withClass('none')
    ];
  })

  .controller('AdvancedDatatableCtrl', function ($scope, DTOptionsBuilder, DTColumnBuilder) {

    var vm = this;

    function stateChange(iColumn, bVisible) {
      console.log('The column', iColumn, ' has changed its status to', bVisible);
    }

    vm.dtOptions = DTOptionsBuilder.fromSource('http://www.filltext.com/?rows=300&id={index}&firstName={firstName}&lastName={lastName}&pretty=true')
      // Add Bootstrap compatibility
      .withBootstrap()
      // Active ColVis plugin
      .withColVis()
      // Add a state change function
      .withColVisStateChange(stateChange)
      // Exclude the last column from the list
      .withColVisOption('aiExclude', [2])
      // Add Table tools compatibility
      .withTableTools('scripts/vendor/datatables/TableTools/swf/copy_csv_xls_pdf.swf')
      .withTableToolsButtons([
        'copy',
        'print', {
          'sExtends': 'collection',
          'sButtonText': 'Save',
          'aButtons': ['csv', 'xls', 'pdf']
        }
      ]);
    vm.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle('ID'),
      DTColumnBuilder.newColumn('firstName').withTitle('First name'),
      DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];


  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:TablesFootableCtrl
 * @description
 * # TablesFootableCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('TablesFootableCtrl', function ($scope) {
    $scope.page = {
      title: 'FooTable',
      subtitle: 'Place subtitle here...'
    };

    $scope.users = [
      { name: 'Mark', lastname: 'Otto', username: '@mdo', phone: '59411994', email: 'otto@mail.com' },
      { name: 'Jacob', lastname: 'Thornton', username: '@fat', phone: '55499126', email: 'jacob@mail.com' },
      { name: 'Mary', lastname: 'the Bird', username: '@twitter', phone: '3159694', email: 'mary@mail.com' },
      { name: 'Marv', lastname: 'Bond', username: '@marvo', phone: '98456152', email: 'marv@mail.com' },
      { name: 'Larry', lastname: 'Cardl', username: '@lurie', phone: '69851195', email: 'larry@mail.com' },
      { name: 'Jennifer', lastname: 'Minelly', username: '@jen', phone: '396784', email: 'jenny@mail.com' },
      { name: 'Sly', lastname: 'Stall', username: '@sly', phone: '9564842', email: 'sly@mail.com' },
      { name: 'Arnold', lastname: 'Percy', username: '@arnie', phone: '1236978', email: 'arnie@mail.com' },
      { name: 'Jack', lastname: 'Black', username: '@blacko', phone: '63248895', email: 'blacko@mail.com' }
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:TablesNgTableCtrl
 * @description
 * # TablesNgTableCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('TablesNgTableCtrl', function ($scope) {
    $scope.page = {
      title: 'ngTable',
      subtitle: 'Place subtitle here...'
    };
  })

  .controller('TableSortCtrl', function($scope, $filter, ngTableParams) {
    var data = [{name: 'Moroni', age: 50},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34}];

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      sorting: {
        name: 'asc'     // initial sorting
      }
    }, {
      total: data.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.sorting() ?
            $filter('orderBy')(data, params.orderBy()) :
            data;

        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
  })

  .controller('TableFilterCtrl', function($scope, $filter, ngTableParams) {
    var data = [{name: 'Moroni', age: 50},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34}];

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      filter: {
        name: 'M'       // initial filter
      },
      sorting: {
        name: 'asc'     // initial sorting
      }
    }, {
      total: data.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        var filteredData = params.filter() ?
            $filter('filter')(data, params.filter()) :
            data;
        var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) :
            data;

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
  })

  .controller('TableEditCtrl', function($scope, $filter, $q, ngTableParams) {
    var data = [{id: 1, name: 'Moroni', age: 50, money: -10},
      {id: 2, name: 'Tiancum', age: 43,money: 120},
      {id: 3, name: 'Jacob', age: 27, money: 5.5},
      {id: 4, name: 'Nephi', age: 29,money: -54},
      {id: 5, name: 'Enos', age: 34,money: 110},
      {id: 6, name: 'Tiancum', age: 43, money: 1000},
      {id: 7, name: 'Jacob', age: 27,money: -201},
      {id: 8, name: 'Nephi', age: 29, money: 100},
      {id: 9, name: 'Enos', age: 34, money: -52.5},
      {id: 10, name: 'Tiancum', age: 43, money: 52.1},
      {id: 11, name: 'Jacob', age: 27, money: 110},
      {id: 12, name: 'Nephi', age: 29, money: -55},
      {id: 13, name: 'Enos', age: 34, money: 551},
      {id: 14, name: 'Tiancum', age: 43, money: -1410},
      {id: 15, name: 'Jacob', age: 27, money: 410},
      {id: 16, name: 'Nephi', age: 29, money: 100},
      {id: 17, name: 'Enos', age: 34, money: -100}
    ];

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,           // count per page
      sorting: {
        name: 'asc'     // initial sorting
      }
    }, {
      total: data.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.sorting() ?
            $filter('orderBy')(data, params.orderBy()) :
            data;

        $defer.resolve($scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    var inArray = Array.prototype.indexOf ?
      function (val, arr) {
        return arr.indexOf(val);
      } :
      function (val, arr) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === val) {return i;}
        }
        return -1;
      };

    $scope.names = function() {
      var def = $q.defer(),
          arr = [],
          names = [];
      angular.forEach(data, function(item){
        if (inArray(item.name, arr) === -1) {
          arr.push(item.name);
          names.push({
            'id': item.name,
            'title': item.name
          });
        }
      });
      def.resolve(names);
      return def;
    };

    $scope.checkboxes = { 'checked': false, items: {} };

    // watch for check all checkbox
    $scope.$watch('checkboxes.checked', function(value) {
      angular.forEach($scope.users, function(item) {
        if (angular.isDefined(item.id)) {
          $scope.checkboxes.items[item.id] = value;
        }
      });
    });

    // watch for data checkboxes
    $scope.$watch('checkboxes.items', function() {
      if (!$scope.users) {
        return;
      }
      var checked = 0, unchecked = 0,
          total = $scope.users.length;
      angular.forEach($scope.users, function(item) {
        checked   +=  ($scope.checkboxes.items[item.id]) || 0;
        unchecked += (!$scope.checkboxes.items[item.id]) || 0;
      });
      if ((unchecked === 0) || (checked === 0)) {
        $scope.checkboxes.checked = (checked === total);
      }
      // grayed checkbox
      angular.element(document.getElementById('select_all')).prop('indeterminate', (checked !== 0 && unchecked !== 0));
    }, true);
  })

  .controller('TableColumnsCtrl', function($scope, $filter, ngTableParams) {
    var data = [{name: 'Moroni', age: 50},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34}];
    $scope.columns = [
      { title: 'Name', field: 'name', visible: true, filter: { 'name': 'text' } },
      { title: 'Age', field: 'age', visible: true }
    ];
    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      filter: {
        name: 'M'       // initial filter
      }
    }, {
      total: data.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.sorting() ?
            $filter('orderBy')(data, params.orderBy()) :
            data;

        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
  })

  .controller('TableGroupCtrl', function($scope, $filter, ngTableParams, $timeout) {
    $scope.rows = [{name: 'Moroni', age: 50, role: 'Administrator', date: '00/00/01'},
      {name: 'Tiancum', age: 43, role: 'Administrator', date: '00/00/01'},
      {name: 'Jacob', age: 27, role: 'Administrator', date: '00/00/01'},
      {name: 'Nephi', age: 29, role: 'Moderator', date: '00/00/01'},
      {name: 'Enos', age: 34, role: 'User', date: '00/00/01'},
      {name: 'Tiancum', age: 43, role: 'User', date: '00/00/01'},
      {name: 'Jacob', age: 27, role: 'User', date: '00/00/01'},
      {name: 'Nephi', age: 29, role: 'Moderator', date: '00/00/01'},
      {name: 'Enos', age: 34, role: 'User', date: '00/00/01'},
      {name: 'Tiancum', age: 43, role: 'Moderator', date: '00/00/01'},
      {name: 'Jacob', age: 27, role: 'User', date: '00/00/01'},
      {name: 'Nephi', age: 29, role: 'User', date: '00/00/01'},
      {name: 'Enos', age: 34, role: 'Moderator', date: '00/00/01'},
      {name: 'Tiancum', age: 43, role: 'User', date: '00/00/01'},
      {name: 'Jacob', age: 27, role: 'User', date: '00/00/01'},
      {name: 'Nephi', age: 29, role: 'User', date: '00/00/01'},
      {name: 'Enos', age: 34, role: 'User', date: '00/00/01'},
      {name: 'Micah', age: 29, role: 'Moderator', date: '00/00/01'},
      {name: 'Viviane', age: 34, role: 'Moderator', date: '00/00/01'},
      {name: 'Marconi', age: 43, role: 'User', date: '00/00/01'},
      {name: 'Leonan', age: 27, role: 'Administrator', date: '00/00/02'},
      {name: 'Arnaldo', age: 29, role: 'User', date: '00/00/02'},
      {name: 'Zuleide', age: 34, role: 'Moderator', date: '00/00/02'}];

    $scope.groupby = 'role'; //Default order IF null get table without groups(not possible ?)

    //dynamic grouping
    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 100          // count per page
    }, {
      groupBy: $scope.groupby,
      total: function () { return $scope.rows.length; }, // length of data
      getData: function($defer, params) {
        var orderedData = params.sorting() ?
            $filter('orderBy')($scope.rows, $scope.tableParams.orderBy()) :   $scope.rows;

        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    $timeout(function(){
      $scope.$watch('groupby', function(value){
        $scope.tableParams.settings().groupBy = value;
        console.log('Scope Value', $scope.groupby);
        console.log('Watch value', this.last);
        console.log('new table',$scope.tableParams);
        $scope.tableParams.reload();
      });
    }, 0);


  })

  .controller('TableRowCtrl', function ($scope, $filter, ngTableParams) {
    var data = [
      {name: 'Moroni', age: 50},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34}
    ];
    $scope.data = data;

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      filter: {
        //name: 'M'       // initial filter
      },
      sorting: {
        //name: 'asc'     // initial sorting
      }
    }, {
      total: data.length, // length of data
      getData: function ($defer, params) {
        // use build-in angular filter
        var filteredData = params.filter() ?
            $filter('filter')(data, params.filter()) :
            data;
        var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) :
            data;

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    $scope.changeSelection = function() {
      // console.info(user);
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:TablesSmartTableCtrl
 * @description
 * # TablesSmartTableCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('TablesSmartTableCtrl', function ($scope) {
    $scope.page = {
      title: 'Smart Table',
      subtitle: 'Place subtitle here...'
    };
  })

  .controller('BasicTableCtrl', ['$scope', '$filter', function ($scope) {
    var firstnames = ['Laurent', 'Blandine', 'Olivier', 'Max'];
    var lastnames = ['Renard', 'Faivre', 'Frere', 'Eponge'];
    var dates = ['1987-05-21', '1987-04-25', '1955-08-27', '1966-06-06'];
    var id = 1;

    function generateRandomItem(id) {

      var firstname = firstnames[Math.floor(Math.random() * 3)];
      var lastname = lastnames[Math.floor(Math.random() * 3)];
      var birthdate = dates[Math.floor(Math.random() * 3)];
      var balance = Math.floor(Math.random() * 2000);

      return {
        id: id,
        firstName: firstname,
        lastName: lastname,
        birthDate: new Date(birthdate),
        balance: balance
      };
    }

    $scope.rowCollection = [];

    for (id; id < 5; id++) {
      $scope.rowCollection.push(generateRandomItem(id));
    }

    //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
    $scope.displayedCollection = [].concat($scope.rowCollection);

    //add to the real data holder
    $scope.addRandomItem = function addRandomItem() {
      $scope.rowCollection.push(generateRandomItem(id));
      id++;
    };

    //remove to the real data holder
    $scope.removeItem = function removeItem(row) {
      var index = $scope.rowCollection.indexOf(row);
      if (index !== -1) {
        $scope.rowCollection.splice(index, 1);
      }
    };

    $scope.predicates = ['firstName', 'lastName', 'birthDate', 'balance', 'email'];
    $scope.selectedPredicate = $scope.predicates[0];
  }])

  .controller('RowTableCtrl', ['$scope', '$filter', function (scope) {
    var
        nameList = ['Pierre', 'Pol', 'Jacques', 'Robert', 'Elisa'],
        familyName = ['Dupont', 'Germain', 'Delcourt', 'bjip', 'Menez'];

    function createRandomItem() {
      var
          firstName = nameList[Math.floor(Math.random() * 4)],
          lastName = familyName[Math.floor(Math.random() * 4)],
          age = Math.floor(Math.random() * 100),
          email = firstName + lastName + '@whatever.com',
          balance = Math.random() * 3000;

      return{
        firstName: firstName,
        lastName: lastName,
        age: age,
        email: email,
        balance: balance
      };
    }

    scope.itemsByPage=10;

    scope.rowCollection = [];
    for (var j = 0; j < 200; j++) {
      scope.rowCollection.push(createRandomItem());
    }
  }])

  .controller('PipeTableCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var nameList = ['Pierre', 'Pol', 'Jacques', 'Robert', 'Elisa'];
    var familyName = ['Dupont', 'Germain', 'Delcourt', 'bjip', 'Menez'];
    var promise = null;


    $scope.isLoading = false;
    $scope.rowCollection = [];


    function createRandomItem() {
      var
          firstName = nameList[Math.floor(Math.random() * 4)],
          lastName = familyName[Math.floor(Math.random() * 4)],
          age = Math.floor(Math.random() * 100),
          email = firstName + lastName + '@whatever.com',
          balance = Math.random() * 3000;

      return{
        firstName: firstName,
        lastName: lastName,
        age: age,
        email: email,
        balance: balance
      };
    }

    function getAPage() {
      $scope.rowCollection=[];
      for (var j = 0; j < 20; j++) {
        $scope.rowCollection.push(createRandomItem());
      }
    }

    $scope.callServer = function getData(tableState, tableController) {

      //here you could create a query string from tableState
      //fake ajax call
      $scope.isLoading = true;

      $timeout(function () {
        getAPage();
        $scope.isLoading = false;
      }, 2000);

    };

    getAPage();

  }]);



'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:TablesUiGridCtrl
 * @description
 * # TablesUiGridCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('TablesUiGridCtrl', function ($scope) {
     $scope.page = {
      title: 'UI Grid',
      subtitle: 'Place subtitle here...'
    };
  })

  .controller('BasicUiGridCtrl', function ($scope, $resource) {

    $scope.myData = $resource('http://www.filltext.com/?rows=300&firstName={firstName}&lastName={lastName}&company={business}&employed={bool}&pretty=true').query();

    $scope.gridOptions = {
      data: 'myData'
    };

  })

  .controller('FilterUiGridCtrl', function ($scope, $resource, uiGridConstants) {

    $scope.myData = $resource('http://www.filltext.com/?rows=300&name={firstName}~{lastName}&gender=["male","female"]&company={business}&email={email}&phone={phone}&age={numberRange|18,80}}&pretty=true').query();

    $scope.gridOptions = {
      data: 'myData',
      enableFiltering: true,
      columnDefs: [
        // default
        { field: 'name' },
        // pre-populated search field
        { field: 'gender', filter: { term: 'male' } },
        // no filter input
        { field: 'company', enableFiltering: false  },
        // specifies one of the built-in conditions
        // and a placeholder for the input
        {
          field: 'email',
          filter: {
            condition: uiGridConstants.filter.ENDS_WITH,
            placeholder: 'ends with'
          }
        },
        // custom condition function
        {
          field: 'phone',
          filter: {
            condition: function(searchTerm, cellValue) {
              var strippedValue = (cellValue + '').replace(/[^\d]/g, '');
              return strippedValue.indexOf(searchTerm) >= 0;
            }
          }
        },
        // multiple filters
        { field: 'age', filters: [
          {
            condition: uiGridConstants.filter.GREATER_THAN,
            placeholder: 'greater than'
          },
          {
            condition: uiGridConstants.filter.LESS_THAN,
            placeholder: 'less than'
          }
        ]}
      ]
    };

  })

  .controller('FooterUiGridCtrl', function ($scope, $resource, uiGridConstants) {

    $scope.myData = $resource('http://www.filltext.com/?rows=300&name={firstName}~{lastName}&street={numberLength}&age={numberRange|18,80}&ageMin={numberRange|18,80}&ageMax={numberRange|18,80}&customCellTemplate={numberRange|18,80}&pretty=true').query();

    $scope.gridOptions = {
      showFooter: true,
      enableFiltering: true,
      columnDefs: [
        { field: 'name', width: 150, aggregationType: uiGridConstants.aggregationTypes.count },
        { field: 'street',aggregationType: uiGridConstants.aggregationTypes.sum, width: 150 },
        { field: 'age', aggregationType: uiGridConstants.aggregationTypes.avg, aggregationHideLabel: true, width: 100 },
        { name: 'ageMin', field: 'age', aggregationType: uiGridConstants.aggregationTypes.min, width: 130, displayName: 'Age for min' },
        { name: 'ageMax', field: 'age', aggregationType: uiGridConstants.aggregationTypes.max, width: 130, displayName: 'Age for max' },
        { name: 'customCellTemplate', field: 'age', width: 150, footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: Red;color: White">custom template</div>' }
      ],
      data: 'myData'
    };

  })

  .controller('ResizeUiGridCtrl', function ($scope, $resource) {

    $scope.myData = $resource('http://www.filltext.com/?rows=300&name={firstName}~{lastName}&gender=["male","female"]&company={business}&pretty=true').query();

    $scope.gridOptions = {
      enableSorting: true,
      columnDefs: [
        { field: 'name', minWidth: 200, width: '50%' },
        { field: 'gender', width: '30%', enableColumnResizing: false },
        { field: 'company', width: '20%' }
      ],
      data: 'myData'
    };

  })

  .controller('EditUiGridCtrl', function ($scope, $resource) {

    $scope.myData = $resource('http://www.filltext.com/?rows=300&id={index}&name={firstName}~{lastName}&age={numberRange|18,80}&gender=[1,2]&registered={date}&isActive={bool}&pretty=true').query();

    $scope.gridOptions = {
      columnDefs: [
        { name: 'id', enableCellEdit: false, width: '10%' },
        { name: 'name', displayName: 'Name (editable)', width: '20%' },
        { name: 'age', displayName: 'Age' , type: 'number', width: '10%' },
        { name: 'gender', displayName: 'Gender', cellFilter: 'mapGender', width: '20%',editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'gender', editDropdownOptionsArray: [
          { id: 1, gender: 'male' },
          { id: 2, gender: 'female' }
        ] },
        { name: 'registered', displayName: 'Registered' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '20%' },
        { name: 'isActive', displayName: 'Active', type: 'boolean', width: '10%' }
      ],
      data: 'myData'
    };

    $scope.msg = {};

    $scope.gridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
        $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
        $scope.$apply();
      });
    };

  })

  .filter('mapGender', function() {
    var genderHash = {
      1: 'male',
      2: 'female'
    };

    return function(input) {
      if (!input){
        return '';
      } else {
        return genderHash[input];
      }
    };
  })

  .controller('ReorderUiGridCtrl', function ($scope, $resource) {

    $scope.myData = $resource('http://www.filltext.com/?rows=300&name={firstName}~{lastName}&gender=["male","female"]&company={business}&pretty=true').query();

    $scope.gridOptions = {
      data: 'myData'
    };

  });



'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:UiAlertsCtrl
 * @description
 * # UiAlertsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('AlertsCtrl', function ($scope) {
     $scope.page = {
      title: 'Alerts & Notifications',
      subtitle: 'Place subtitle here...'
    };
  })

  .controller('AlertDemoCtrl', ['$scope', '$location', '$anchorScroll', '$timeout', function ($scope, $location, $anchorScroll, $timeout) {

    $scope.alerts = [];

    $scope.alertOptions = {
      colors: [
        {name:'primary'},
        {name:'success'},
        {name:'warning'},
        {name:'danger'},
        {name:'info'},
        {name:'default'},
        {name:'cyan'},
        {name:'amethyst'},
        {name:'green'},
        {name:'orange'},
        {name:'red'},
        {name:'greensea'},
        {name:'dutch'},
        {name:'hotpink'},
        {name:'drank'},
        {name:'blue'},
        {name:'lightred'},
        {name:'slategray'},
        {name:'darkgray'}
      ],
      durations: [
        {name:'never close', value: 9999*9999},
        {name:'1 second', value: 1000},
        {name:'5 seconds', value: 5000},
        {name:'10 seconds', value: 10000}
      ],
      icons: [
        {name: 'none', value: ''},
        {name: 'warning', value: 'fa-warning'},
        {name: 'check', value: 'fa-check'},
        {name: 'user', value: 'fa-user'}
      ],
      msg: 'Place alert text here...'
    };

    $scope.alertType = $scope.alertOptions.colors[2]; // warning

    $scope.alertDuration = $scope.alertOptions.durations[0]; // never close

    $scope.alertIcon = $scope.alertOptions.icons[0]; // none

    $scope.alertCloseable = true;

    $scope.alertCloseAll = true;

    $scope.alertFocus = true;

    $scope.showAlert = function() {

      var alert = {
        msg: $scope.alertOptions.msg,
        type: $scope.alertType.name,
        timeout: $scope.alertDuration.value,
        icon: $scope.alertIcon.value,
        closeable: $scope.alertCloseable,
        closeall: $scope.alertCloseAll,
        focus: $scope.alertFocus
      };

      if (alert.closeall) {
        $scope.alerts = [];
      }

      $scope.alerts.push(alert);

      if (alert.focus) {
        $location.hash('alertsPlaceholder');

        // call $anchorScroll()
        $anchorScroll();
      }

      $timeout(function() {

        $scope.alerts.splice($scope.alerts.indexOf(alert), 1);

      }, $scope.alerts[$scope.alerts.indexOf(alert)].timeout);

    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

  }])

  .controller('ToasterDemoCtrl',['$scope', 'toastr', 'toastrConfig', function ($scope, toastr, toastrConfig) {

    var openedToasts = [];

    $scope.toast = {
      colors: [
        {name:'primary'},
        {name:'success'},
        {name:'warning'},
        {name:'danger'},
        {name:'info'},
        {name:'default'},
        {name:'cyan'},
        {name:'amethyst'},
        {name:'green'},
        {name:'orange'},
        {name:'red'},
        {name:'greensea'},
        {name:'dutch'},
        {name:'hotpink'},
        {name:'drank'},
        {name:'blue'},
        {name:'lightred'},
        {name:'slategray'},
        {name:'darkgray'}
      ],
      icons: [
        {name: 'none', value: ''},
        {name: 'warning', value: 'fa-warning'},
        {name: 'check', value: 'fa-check'},
        {name: 'user', value: 'fa-user'}
      ],
      msg: 'Gnome & Growl type non-blocking notifications',
      title: 'This is toaster notification'
    };

    $scope.options = {
      position: 'toast-top-right',
      type: 'success',
      iconClass: $scope.toast.colors[1],
      iconType: $scope.toast.icons[2],
      timeout: '5000',
      extendedTimeout: '1000',
      html: false,
      closeButton: false,
      tapToDismiss: true,
      closeHtml: '<i class="fa fa-times"></i>'
    };

    $scope.$watchCollection('options', function(newValue) {
      toastrConfig.allowHtml = newValue.html;
      toastrConfig.extendedTimeOut = parseInt(newValue.extendedTimeout, 10);
      toastrConfig.positionClass = newValue.position;
      toastrConfig.timeOut = parseInt(newValue.timeout, 10);
      toastrConfig.closeButton = newValue.closeButton;
      toastrConfig.tapToDismiss = newValue.tapToDismiss;
      toastrConfig.closeHtml = newValue.closeHtml;
      toastrConfig.iconType = newValue.iconType;
    });

    $scope.clearLastToast = function() {
      var toast = openedToasts.pop();
      toastr.clear(toast);
    };

    $scope.clearToasts = function() {
      toastr.clear();
    };

    $scope.openToast = function() {

      var toast = toastr[$scope.options.type]($scope.toast.msg, $scope.toast.title, {
                    iconClass: 'bg-'+$scope.options.iconClass.name,
                    iconType: $scope.options.iconType.value
                  });

      openedToasts.push(toast);

    };

  }]);


'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ButtonsiconsCtrl
 * @description
 * # ButtonsiconsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('ButtonsIconsCtrl', function ($scope) {
     $scope.page = {
      title: 'Buttons & Icons',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:UiGeneralCtrl
 * @description
 * # UiGeneralCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('GeneralCtrl', function ($scope) {
    $scope.page = {
      title: 'General Elements',
      subtitle: 'Place subtitle here...'
    };
  })

  .controller('ProgressDemoCtrl', function ($scope) {
    $scope.max = 200;

    $scope.random = function() {
      var value = Math.floor((Math.random() * 100) + 1);
      var type;

      if (value < 25) {
        type = 'success';
      } else if (value < 50) {
        type = 'info';
      } else if (value < 75) {
        type = 'warning';
      } else {
        type = 'danger';
      }

      $scope.showWarning = (type === 'danger' || type === 'warning');

      $scope.dynamic = value;
      $scope.type = type;
    };

    $scope.random();

    $scope.randomStacked = function() {
      $scope.stacked = [];
      var types = ['success', 'info', 'warning', 'danger'];

      for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
          var index = Math.floor((Math.random() * 4));
          $scope.stacked.push({
            value: Math.floor((Math.random() * 30) + 1),
            type: types[index]
          });
      }
    };

    $scope.randomStacked();
  })

  .controller('RatingDemoCtrl', function ($scope) {
    $scope.rate = 7;
    $scope.max = 10;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };
  })

  .controller('ButtonsCtrl', function ($scope) {
    $scope.singleModel = 1;

    $scope.radioModel = 'Middle';

    $scope.checkModel = {
      left: false,
      middle: true,
      right: false
    };
  })

  .controller('CarouselDemoCtrl', function ($scope) {
    $scope.myInterval = 5000;

    var slides = $scope.slides = [];

    $scope.addSlide = function() {
      var newWidth = 801 + slides.length;
      slides.push({
        image: 'http://placekitten.com/' + newWidth + '/400',
        text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
          ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
      });
    };

    for (var i=0; i<4; i++) {
      $scope.addSlide();
    }

  })

  .controller('TooltipDemoCtrl', function ($scope) {
    $scope.dynamicTooltip = 'Hello, World!';
    $scope.dynamicTooltipText = 'dynamic';
    $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
  })

  /* jshint ignore:start */
  .controller('TypeaheadCtrl', function($scope, $http) {

    $scope.selected = undefined;
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    // Any function returning a promise object can be used to load values asynchronously
    $scope.getLocation = function(val) {
      return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: val,
          sensor: false
        }
      }).then(function(response){
        return response.data.results.map(function(item){
          return item.formatted_address;
        });
      });

    };

    $scope.statesWithFlags = [{'name':'Alabama','flag':'5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},{'name':'Alaska','flag':'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},{'name':'Arizona','flag':'9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},{'name':'Arkansas','flag':'9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},{'name':'California','flag':'0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},{'name':'Colorado','flag':'4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},{'name':'Connecticut','flag':'9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},{'name':'Delaware','flag':'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},{'name':'Florida','flag':'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},{'name':'Georgia','flag':'5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'},{'name':'Hawaii','flag':'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},{'name':'Idaho','flag':'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},{'name':'Illinois','flag':'0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},{'name':'Indiana','flag':'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},{'name':'Iowa','flag':'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},{'name':'Kansas','flag':'d/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},{'name':'Kentucky','flag':'8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},{'name':'Louisiana','flag':'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},{'name':'Maine','flag':'3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},{'name':'Maryland','flag':'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},{'name':'Massachusetts','flag':'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},{'name':'Michigan','flag':'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},{'name':'Minnesota','flag':'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},{'name':'Mississippi','flag':'4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},{'name':'Missouri','flag':'5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},{'name':'Montana','flag':'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},{'name':'Nebraska','flag':'4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},{'name':'Nevada','flag':'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},{'name':'New Hampshire','flag':'2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},{'name':'New Jersey','flag':'9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},{'name':'New Mexico','flag':'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},{'name':'New York','flag':'1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},{'name':'North Carolina','flag':'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},{'name':'North Dakota','flag':'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},{'name':'Ohio','flag':'4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},{'name':'Oklahoma','flag':'6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},{'name':'Oregon','flag':'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},{'name':'Pennsylvania','flag':'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},{'name':'Rhode Island','flag':'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},{'name':'South Carolina','flag':'6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},{'name':'South Dakota','flag':'1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},{'name':'Tennessee','flag':'9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},{'name':'Texas','flag':'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},{'name':'Utah','flag':'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},{'name':'Vermont','flag':'4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},{'name':'Virginia','flag':'4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},{'name':'Washington','flag':'5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},{'name':'West Virginia','flag':'2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},{'name':'Wisconsin','flag':'2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},{'name':'Wyoming','flag':'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}];
  })
  /* jshint ignore:end */

  .controller('DropdownCtrl', function ($scope) {

     $scope.items = [
      'The first choice!',
      'And another choice for you.',
      'but wait! A third!'
    ];

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };
  })

  .controller('DatepickerDemoCtrl', function ($scope) {

    $scope.today = function() {
      $scope.dt = new Date();
    };

    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      'class': 'datepicker'
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
  })

  .controller('TimepickerDemoCtrl', function ($scope) {
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
      $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
      var d = new Date();
      d.setHours( 14 );
      d.setMinutes( 0 );
      $scope.mytime = d;
    };

    $scope.changed = function () {
      console.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function() {
      $scope.mytime = null;
    };
  })

  .controller('PaginationDemoCtrl', function ($scope) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
      console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
  })

  .controller('PopoverDemoCtrl', function ($scope) {
    $scope.dynamicPopover = 'Hello, World!';
    $scope.dynamicPopoverTitle = 'Title';
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:UiGridCtrl
 * @description
 * # UiGridCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('GridCtrl', function ($scope) {
    $scope.page = {
      title: 'Grid',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ListsCtrl
 * @description
 * # ListsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('ListsCtrl', function ($scope) {

    $scope.page = {
      title: 'Lists',
      subtitle: 'Place subtitle here...'
    };

    $scope.list = [
      {
        id: 1,
        title: 'Item 1',
        items: []
      }, {
        id: 2,
        title: 'Item 2',
        items: [
          {
            id: 21,
            title: 'Item 2.1',
            items: [
              {
                id: 211,
                title: 'Item 2.1.1',
                items: []
              }, {
                id: 212,
                title: 'Item 2.1.2',
                items: []
              }
            ]
          }, {
            id: 22,
            title: 'Item 2.2',
            items: [
              {
                id: 221,
                title: 'Item 2.2.1',
                items: []
              }, {
                id: 222,
                title: 'Item 2.2.2',
                items: []
              }
            ]
          }
        ]
      }, {
        id: 3,
        title: 'Item 3',
        items: []
      }, {
        id: 4,
        title: 'Item 4',
        items: [
          {
            id: 41,
            title: 'Item 4.1',
            items: []
          }
        ]
      }, {
        id: 5,
        title: 'Item 5',
        items: []
      }, {
        id: 6,
        title: 'Item 6',
        items: []
      }, {
        id: 7,
        title: 'Item 7',
        items: []
      }
    ];

    $scope.list2 = [
      {
        id: 1,
        title: 'Item 1',
        items: []
      }, {
        id: 2,
        title: 'Item 2',
        items: [
          {
            id: 21,
            title: 'Item 2.1',
            items: [
              {
                id: 211,
                title: 'Item 2.1.1',
                items: []
              }, {
                id: 212,
                title: 'Item 2.1.2',
                items: []
              }
            ]
          }, {
            id: 22,
            title: 'Item 2.2',
            items: [
              {
                id: 221,
                title: 'Item 2.2.1',
                items: []
              }, {
                id: 222,
                title: 'Item 2.2.2',
                items: []
              }
            ]
          }
        ]
      }, {
        id: 3,
        title: 'Item 3',
        items: []
      }, {
        id: 4,
        title: 'Item 4',
        items: [
          {
            id: 41,
            title: 'Item 4.1',
            items: []
          }
        ]
      }, {
        id: 5,
        title: 'Item 5',
        items: []
      }, {
        id: 6,
        title: 'Item 6',
        items: []
      }, {
        id: 7,
        title: 'Item 7',
        items: []
      }
    ];

    /*$scope.editItem = function(scope) {
      scope.editing = true;
    };*/

    $scope.cancelEditingItem = function(scope) {
      scope.editing = false;
    };

    /*$scope.saveGroup = function(group) {
      group.save();
    };*/

    $scope.selectedItem = {};

    $scope.options = {};

    $scope.remove = function(scope) {
      scope.remove();
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.newSubItem = function(scope) {
      var nodeData;
      nodeData = scope.$modelValue;
      nodeData.items.push({
        id: nodeData.id * 10 + nodeData.items.length,
        title: nodeData.title + '.' + (nodeData.items.length + 1),
        items: []
      });
    };

    var getRootNodesScope = function($event) {
      var target = angular.element($event.target).parents('.tile').find('.angular-ui-tree');

      return target.scope();
    };

    $scope.collapseAll = function($event) {
      var scope = getRootNodesScope($event);
      scope.collapseAll();
    };

    $scope.expandAll = function($event) {
      var scope = getRootNodesScope($event);
      scope.expandAll();
    };

  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:UiModalsCtrl
 * @description
 * # UiModalsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('ModalsCtrl', function ($scope) {
    $scope.page = {
      title: 'Modals',
      subtitle: 'Place subtitle here...'
    };
  })

  .controller('ModalDemoCtrl', function ($scope, $modal, $log) {

    $scope.items = ['HQ', 'Paris Office', 'Warehouse'];

    $scope.open = function(size) {

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  })

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.

  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })

  .controller('SplashDemoCtrl', function ($scope, $modal, $log) {
    $scope.items = ['item1', 'item2', 'item3'];

    $scope.openSplash = function(event, size) {

      var options = angular.element(event.target).data('options');

      var modalInstance = $modal.open({
        templateUrl: 'mySplashContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        backdropClass: 'splash' + ' ' + options,
        windowClass: 'splash' + ' ' + options,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  });


'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:UiNavsCtrl
 * @description
 * # UiNavsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('NavsCtrl', function ($scope) {
    $scope.page = {
      title: 'Navigation & Accordions',
      subtitle: 'Place subtitle here...'
    };
  })
  .controller('AccordionDemoCtrl', function ($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [
      {
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
      },
      {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
      }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
      var newItemNo = $scope.items.length + 1;
      $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
  })

  .controller('TabsDemoCtrl', function ($scope) {
    $scope.tabs = [
      { title:'Dynamic Title 1', content:'Dynamic content 1' },
      { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];

    $scope.alertMe = function() {
      setTimeout(function() {
         //alert('You\'ve selected the alert tab!');
      });
    };
  })

  .controller('PillsDemoCtrl', function ($scope) {
    $scope.pills = [
      { title:'Dynamic Title 1', content:'Dynamic content 1' },
      { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];

    $scope.alertMe = function() {
      setTimeout(function() {
        //alert('You\'ve selected the alert pill!');
      });
    };
  });


'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:UiPortletsCtrl
 * @description
 * # UiPortletsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('PortletsCtrl', function ($scope) {
    $scope.page = {
      title: 'Portlets',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:UitilesCtrl
 * @description
 * # UitilesCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('TilesCtrl', function ($scope) {
    $scope.page = {
      title: 'Tiles',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:UiTreeCtrl
 * @description
 * # UiTreeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  /* jshint ignore:start */
  .controller('AbnTestController', function($scope, $timeout) {
    var apple_selected, tree, treedata_avm, treedata_geography;
    $scope.my_tree_handler = function(branch) {
      var _ref;
      $scope.output = "You selected: " + branch.label;
      if ((_ref = branch.data) != null ? _ref.description : void 0) {
        return $scope.output += '(' + branch.data.description + ')';
      }
    };
    apple_selected = function(branch) {
      return $scope.output = "APPLE! : " + branch.label;
    };
    treedata_avm = [
      {
        label: 'Animal',
        children: [
          {
            label: 'Dog',
            data: {
              description: "man's best friend"
            }
          }, {
            label: 'Cat',
            data: {
              description: "Felis catus"
            }
          }, {
            label: 'Hippopotamus',
            data: {
              description: "hungry, hungry"
            }
          }, {
            label: 'Chicken',
            children: ['White Leghorn', 'Rhode Island Red', 'Jersey Giant']
          }
        ]
      }, {
        label: 'Vegetable',
        data: {
          definition: "A plant or part of a plant used as food, typically as accompaniment to meat or fish, such as a cabbage, potato, carrot, or bean.",
          data_can_contain_anything: true
        },
        onSelect: function(branch) {
          return $scope.output = "Vegetable: " + branch.data.definition;
        },
        children: [
          {
            label: 'Oranges'
          }, {
            label: 'Apples',
            children: [
              {
                label: 'Granny Smith',
                onSelect: apple_selected
              }, {
                label: 'Red Delicous',
                onSelect: apple_selected
              }, {
                label: 'Fuji',
                onSelect: apple_selected
              }
            ]
          }
        ]
      }, {
        label: 'Mineral',
        children: [
          {
            label: 'Rock',
            children: ['Igneous', 'Sedimentary', 'Metamorphic']
          }, {
            label: 'Metal',
            children: ['Aluminum', 'Steel', 'Copper']
          }, {
            label: 'Plastic',
            children: [
              {
                label: 'Thermoplastic',
                children: ['polyethylene', 'polypropylene', 'polystyrene', ' polyvinyl chloride']
              }, {
                label: 'Thermosetting Polymer',
                children: ['polyester', 'polyurethane', 'vulcanized rubber', 'bakelite', 'urea-formaldehyde']
              }
            ]
          }
        ]
      }
    ];
    treedata_geography = [
      {
        label: 'North America',
        children: [
          {
            label: 'Canada',
            children: ['Toronto', 'Vancouver']
          }, {
            label: 'USA',
            children: ['New York', 'Los Angeles']
          }, {
            label: 'Mexico',
            children: ['Mexico City', 'Guadalajara']
          }
        ]
      }, {
        label: 'South America',
        children: [
          {
            label: 'Venezuela',
            children: ['Caracas', 'Maracaibo']
          }, {
            label: 'Brazil',
            children: ['Sao Paulo', 'Rio de Janeiro']
          }, {
            label: 'Argentina',
            children: ['Buenos Aires', 'Cordoba']
          }
        ]
      }
    ];
    $scope.my_data = treedata_avm;
    $scope.try_changing_the_tree_data = function() {
      if ($scope.my_data === treedata_avm) {
        return $scope.my_data = treedata_geography;
      } else {
        return $scope.my_data = treedata_avm;
      }
    };
    $scope.my_tree = tree = {};
    $scope.try_async_load = function() {
      $scope.my_data = [];
      $scope.doing_async = true;
      return $timeout(function() {
        if (Math.random() < 0.5) {
          $scope.my_data = treedata_avm;
        } else {
          $scope.my_data = treedata_geography;
        }
        $scope.doing_async = false;
        return tree.expand_all();
      }, 1000);
    };
    return $scope.try_adding_a_branch = function() {
      var b;
      b = tree.get_selected_branch();
      return tree.add_branch(b, {
        label: 'New Branch',
        data: {
          something: 42,
          "else": 43
        }
      });
    };
  })
  /* jshint ignore:end */
  .controller('TreeCtrl', function ($scope) {
    $scope.page = {
      title: 'Tree',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:TypographyCtrl
 * @description
 * # TypographyCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('TypographyCtrl', function ($scope) {
    $scope.page = {
      title: 'Typography',
      subtitle: 'Place subtitle here...'
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:UiWidgetsCtrl
 * @description
 * # UiWidgetsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('WidgetsCtrl', function ($scope) {
    $scope.page = {
      title: 'Widgets',
      subtitle: 'Place subtitle here...'
    };
  })

  .controller('TodoWidgetCtrl', function($scope) {
    $scope.todos = [{
      text: 'Release update',
      completed: false
    },{
      text: 'Make a backup',
      completed: false
    },{
      text: 'Send e-mail to Ici',
      completed: true
    },{
      text: 'Buy tickets',
      completed: false
    },{
      text: 'Resolve issues',
      completed: false
    },{
      text: 'Compile new version',
      completed: false
    }];

    var todos = $scope.todos;

    $scope.addTodo = function() {
      $scope.todos.push({
        text: $scope.todo,
        completed: false
      });
      $scope.todo = '';
    };

    $scope.removeTodo = function(todo) {
      todos.splice(todos.indexOf(todo), 1);
    };

    $scope.editTodo = function(todo) {
      $scope.editedTodo = todo;
      // Clone the original todo to restore it on demand.
      $scope.originalTodo = angular.extend({}, todo);
    };

    $scope.doneEditing = function(todo) {
      $scope.editedTodo = null;

      todo.text = todo.text.trim();

      if (!todo.text) {
        $scope.removeTodo(todo);
      }
    };

    $scope.revertEditing = function(todo) {
      todos[todos.indexOf(todo)] = $scope.originalTodo;
      $scope.doneEditing($scope.originalTodo);
    };

  })

  .controller('CalendarWidgetCtrl', function ($scope) {

    $scope.today = function() {
      $scope.dt = new Date();
    };

    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      'class': 'datepicker'
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
  })

  .controller('MessageWidgetCtrl', function($scope){
    $scope.availableRecipients = ['RLake@nec.gov','RBastian@lacus.io','VMonroe@orci.ly','YMckenzie@mattis.gov','VMcmyne@molestie.org','BKliban@aliquam.gov','HHellems@tincidunt.org','KAngell@sollicitudin.ly'];
    $scope.recipients = {};
    $scope.recipients.emails = ['RLake@nec.gov','VMonroe@orci.ly'];

    $scope.messageContent = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';
  })

  .controller('AppointmentsWidgetCtrl', function($scope){
    $scope.date = new Date();
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:activateButton
 * @description
 * # activateButton
 */
angular.module('minovateApp')
  .directive('activateButton', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var activatedClass = 'btn-activated';
        var status = attrs.activateButton;
        var activate = function() {
          element.addClass(activatedClass);
          setTimeout(function() {
            element.removeClass(activatedClass);
          }, 1000 );
        };

        element.on('click', function() {
          if (!element.hasClass(activatedClass) && status === 'success') {
            element.addClass('btn-activated-success');
            setTimeout(function() {
              element.removeClass('btn-activated-success');
            }, 1000 );
          } else if (!element.hasClass(activatedClass) && status === 'error') {
            element.addClass('btn-activated-error');
            setTimeout(function() {
              element.removeClass('btn-activated-error');
            }, 1000 );
          } else if (!element.hasClass(activatedClass)) {
            activate();
          }
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:activeToggle
 * @description
 * # activeToggle
 */
angular.module('minovateApp')
  .directive('activeToggle', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attr) {

        element.on('click', function(){

          var target = angular.element(attr.target) || Array(element);

          if (element.hasClass('active')) {
            element.removeClass('active');
            target.removeClass('show');
          } else {
            element.addClass('active');
            target.addClass('show');
          }

        });

      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:anchorScroll
 * @description
 * # anchorScroll
 */
angular.module('minovateApp')
  .directive('anchorScroll', ['$location', '$anchorScroll', function($location, $anchorScroll) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        el.on('click', function(e) {
          $location.hash(attr.anchorScroll);
          $anchorScroll();
        });
      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:chartMorris
 * @description
 * # chartMorris
 * https://github.com/jasonshark/ng-morris/blob/master/src/ngMorris.js
 */
angular.module('minovateApp')
  .directive('morrisLineChart', function(){

    return {
      restrict: 'A',
      scope: {
        lineData: '=',
        lineXkey: '@',
        lineYkeys: '@',
        lineLabels: '@',
        lineColors: '@'
      },
      link: function (scope, elem, attrs){
        var colors,
            morris;
        if (scope.lineColors === void 0 || scope.lineColors === '') {
          colors = null;
        } else {
          colors = JSON.parse(scope.lineColors);
        }
        scope.$watch('lineData', function(){
          if(scope.lineData){
            if(!morris) {
              morris = new Morris.Line({
                element: elem,
                data: scope.lineData,
                xkey: scope.lineXkey,
                ykeys: JSON.parse(scope.lineYkeys),
                labels: JSON.parse(scope.lineLabels),
                lineColors: colors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
                resize: true
              });
            } else {
              morris.setData(scope.lineData);
            }
          }
        });
      }
    };
  })

  .directive('morrisAreaChart', function(){

    return {
      restrict: 'A',
      scope: {
        lineData: '=',
        lineXkey: '@',
        lineYkeys: '@',
        lineLabels: '@',
        lineColors: '@',
        lineWidth: '@',
        fillOpacity: '@',
        showGrid: '@'
      },
      link: function (scope, elem, attrs){
        var colors,
            morris;
        if (scope.lineColors === void 0 || scope.lineColors === '') {
          colors = null;
        } else {
          colors = JSON.parse(scope.lineColors);
        }
        scope.$watch('lineData', function(){
          if(scope.lineData){
            if(!morris) {
              morris = new Morris.Area({
                element: elem,
                data: scope.lineData,
                xkey: scope.lineXkey,
                ykeys: JSON.parse(scope.lineYkeys),
                labels: JSON.parse(scope.lineLabels),
                lineColors: colors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
                lineWidth: scope.lineWidth || '0',
                fillOpacity: scope.fillOpacity || '0.8',
                grid: scope.showGrid || false,
                resize: true
              });
            } else {
              morris.setData(scope.lineData);
            }
          }
        });
      }
    };
  })

  .directive('morrisBarChart', function(){
    return {
      restrict: 'A',
      scope: {
        barData: '=',
        barXkey: '@',
        barYkeys: '@',
        barLabels: '@',
        barColors: '@'
      },
      link: function(scope, elem, attrs){

        var colors,
            morris;
        if (scope.barColors === void 0 || scope.barColors === '') {
          colors = null;
        } else {
          colors = JSON.parse(scope.barColors);
        }

        scope.$watch('barData', function(){
          if(scope.barData){
            if(!morris) {
              morris = new Morris.Bar({
                element: elem,
                data: scope.barData,
                xkey: scope.barXkey,
                ykeys: JSON.parse(scope.barYkeys),
                labels: JSON.parse(scope.barLabels),
                barColors: colors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
                xLabelMargin: 2,
                resize: true
              });
            } else {
              morris.setData(scope.barData);
            }
          }
        });
      }
    };
  })

  .directive('morrisDonutChart', function(){
    return {
      restrict: 'A',
      scope: {
        donutData: '=',
        donutColors: '@'
      },
      link: function(scope, elem, attrs){
        var colors,
            morris;
        if (scope.donutColors === void 0 || scope.donutColors === '') {
          colors = null;
        } else {
          colors = JSON.parse(scope.donutColors);
        }

        scope.$watch('donutData', function(){
          if(scope.donutData){
            if(!morris) {
              morris = new Morris.Donut({
                element: elem,
                data: scope.donutData,
                colors: colors || ['#0B62A4', '#3980B5', '#679DC6', '#95BBD7', '#B0CCE1', '#095791', '#095085', '#083E67', '#052C48', '#042135'],
                resize: true
              });
            } else {
              morris.setData(scope.donutData);
            }
          }
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:checkToggler
 * @description
 * # checkToggler
 */
angular.module('minovateApp')
  .directive('checkToggler', function () {
    return {
      restrict: 'E',
      link: function postLink(scope, element) {
        element.on('click', function(){

          if (element.hasClass('checked')) {
            element.removeClass('checked');
          } else {
            element.addClass('checked');
          }

        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:clock
 * @description
 * # clock
 */
angular.module('minovateApp')
  .directive('clock', function () {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        radius: '@',
        zone: '@?',
        lightFill: '@?',
        darkFill: '@?'
      },
      template: '<div class=\'bloc-clock\' ng-style=\'divStyle()\'>\n  <svg xmlns="http://www.w3.org/2000/svg"\n   style="padding: 10px 0"\n    width="100%"\n       height="100%"\n       viewBox="0 0 200 200">\n    <g class=\'face\' style=\'stroke: black; stroke-width: 0px;\'>\n      <g>\n        <circle style="stroke: rgba(255,255,255,.5); fill: rgba(255,255,255,0); stroke-width: 6px;"\n                cx="100"\n                cy="100"\n                r="100"/>\n        <line x1="100"\n              x2="100"\n              y1="10"\n              y2="0"\n              />\n        <line x1="150"\n              x2="145"\n              y1="13"\n              y2="22"\n              />\n        <line x1="150"\n              x2="145"\n              y1="13"\n              y2="22"\n              />\n        <line x1="187"\n              x2="178"\n              y1="50"\n              y2="55"\n              />\n        <line x1="190"\n              x2="200"\n              y1="100"\n              y2="100"\n              />\n        <line x1="187"\n              x2="178"\n              y1="150"\n              y2="145"\n              />\n        <line x1="150"\n              x2="145"\n              y1="187"\n              y2="178"\n              />\n        <line x1="100"\n              x2="100"\n              y1="190"\n              y2="200"\n              />\n        <line x1="50"\n              x2="55"\n              y1="187"\n              y2="178"\n              />\n        <line x1="13"\n              x2="22"\n              y1="150"\n              y2="145"\n              />\n        <line x1="0"\n              x2="10"\n              y1="100"\n              y2="100"\n              />\n        <line x1="13"\n              x2="22"\n              y1="50"\n              y2="55"\n              />\n        <line x1="50"\n              x2="55"\n              y1="13"\n              y2="22"\n              />\n      </g>\n      <g>\n          <line x1="100"\n                y1="100"\n                x2="100"\n                y2="45"\n                style="stroke-width: 6px"\n                class="hourhand"/>\n          <line x1="100"\n                y1="100"\n                x2="100"\n                y2="15"\n                style="stroke-width: 6px"\n                class="minutehand" />\n          <line x1="100"\n                y1="100"\n                x2="100"\n                y2="5"\n                style="stroke-width: 3px; stroke: rgba(255,255,255,.5)"\n                class="secondhand"/>\n      <circle cx="100"\n cy="100"\n r="8"\n fill="white"\n />\n   </g>\n    </g>\n  </svg>\n</div>',
      link: function(scope, el, attrs) {
        var drawClock, drawHands, getRad, getX, getY;

        scope.divStyle = function() {
          return {
            width: scope.w(),
            height: scope.w(),
            margin: '0 auto'
          };
        };

        scope.w = function() {
          return scope.radius * 2;
        };

        getX = function(degrees, r, adjust, x) {
          var adj;
          x = x || r;
          adj = adjust || 1;
          return x + r * adj * Math.cos(getRad(degrees));
        };

        getY = function(degrees, r, adjust, y) {
          var adj;
          y = y || r;
          adj = adjust || 1;
          return y + r * adj * Math.sin(getRad(degrees));
        };

        getRad = function(degrees) {
          var adjust;
          adjust = Math.PI / 2;
          return (degrees * Math.PI / 180) - adjust;
        };

        drawHands = function() {
          var $circle, H_HAND_SIZE, M_HAND_SIZE, S_HAND_SIZE, dark, drawHand, fillColor, hour, hour24, r, strokeColor, t;
          S_HAND_SIZE = 0.95;
          M_HAND_SIZE = 0.85;
          H_HAND_SIZE = 0.55;
          t = scope.zone ? moment.tz(new Date(), scope.zone) : moment();
          r = 100;
          $circle = el.find('circle');
          hour24 = Number(t.format('H'));
          dark = hour24 >= 18 || hour24 < 6;
          strokeColor = 'rgba(255,255,255,1)';
          el.find('line').not('.secondhand').css('stroke', strokeColor);
          drawHand = function(hand, value, size, degrees) {
            var deg, x2, y2;
            deg = degrees * value;
            x2 = getX(deg, r, size, r);
            y2 = getY(deg, r, size, r);
            hand.attr('x1', r);
            hand.attr('y1', r);
            hand.attr('x2', x2);
            hand.attr('y2', y2);
          };
          hour = t.hour() + t.minute() / 60;
          drawHand(angular.element(el).find('.secondhand'), t.second(), S_HAND_SIZE, 6);
          drawHand(angular.element(el).find('.minutehand'), t.minute(), M_HAND_SIZE, 6);
          drawHand(angular.element(el).find('.hourhand'), hour, H_HAND_SIZE, 30);
        };
        drawHands();
        setInterval(drawHands, 1000);
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:collapseSidebarSm
 * @description
 * # collapseSidebarSm
 */
angular.module('minovateApp')
  .directive('collapseSidebar', function ($rootScope) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {

        var app = angular.element('#minovate'),
            $window = angular.element(window),
            width = $window.width();

        var removeRipple = function() {
          angular.element('#sidebar').find('.ink').remove();
        };

        var collapse = function() {

          width = $window.width();

          if (width < 992) {
            app.addClass('sidebar-sm');
          } else {
            app.removeClass('sidebar-sm sidebar-xs');
          }

          if (width < 768) {
            app.removeClass('sidebar-sm').addClass('sidebar-xs');
          } else if (width > 992){
            app.removeClass('sidebar-sm sidebar-xs');
          } else {
            app.removeClass('sidebar-xs').addClass('sidebar-sm');
          }

          if (app.hasClass('sidebar-sm-forced')) {
            app.addClass('sidebar-sm');
          }

          if (app.hasClass('sidebar-xs-forced')) {
            app.addClass('sidebar-xs');
          }

        };

        collapse();

        $window.resize(function() {
          if(width !== $window.width()) {
            var t;
            clearTimeout(t);
            t = setTimeout(collapse, 300);
            removeRipple();
          }
        });

        element.on('click', function(e) {
          if (app.hasClass('sidebar-sm')) {
            app.removeClass('sidebar-sm').addClass('sidebar-xs');
          }
          else if (app.hasClass('sidebar-xs')) {
            app.removeClass('sidebar-xs');
          }
          else {
            app.addClass('sidebar-sm');
          }

          app.removeClass('sidebar-sm-forced sidebar-xs-forced');
          app.parent().removeClass('sidebar-sm sidebar-xs');
          removeRipple();
          e.preventDefault();
        });

      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:daterangepicker
 * @description
 * # daterangepicker
 */
angular.module('minovateApp')
  .directive('daterangepicker', function() {
    return {
      restrict: 'A',
      scope: {
        options: '=daterangepicker',
        start: '=dateBegin',
        end: '=dateEnd'
      },
      link: function(scope, element) {
        element.daterangepicker(scope.options, function(start, end) {
          scope.start = start.format('MMMM D, YYYY');
          scope.end = end.format('MMMM D, YYYY');
          scope.$apply();
        });
      }
    };
  });


'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:formSubmit
 * @description
 * # formSubmit
 */
angular.module('minovateApp')
  .directive('submit', function() {
    return {
      restrict: 'A',
      link: function(scope, formElement, attrs) {
        var form;
        form = scope[attrs.name];
        return formElement.bind('submit', function() {
          angular.forEach(form, function(field, name) {
            if (typeof name === 'string' && !name.match('^[$]')) {
              if (field.$pristine) {
                return field.$setViewValue(field.$value);
              }
            }
          });
          if (form.$valid) {
            return scope.$apply(attrs.submit);
          }
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:gaugeChart
 * @description
 * # gaugeChart
*/

angular.module('minovateApp')
  .directive('gaugeChart', [
  function() {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        options: '='
      },
      link: function($scope, $el) {
        var data = $scope.data,
            options = $scope.options,
            gauge = new Gauge($el[0]).setOptions(options);

        gauge.maxValue = data.maxValue;
        gauge.animationSpeed = data.animationSpeed;
        gauge.set(data.val);
      }
    };
  }
]);

/**
 * lazy-model directive
 *
 * AngularJS directive that works like `ng-model` but saves changes
 * only when form is submitted (otherwise changes are canceled)
 */

angular.module('lazyModel', [])

// lazy-model
.directive('lazyModel', ['$compile', '$timeout',
  function($compile, $timeout) {
    'use strict';
    return {
      restrict: 'A',
      priority: 500,
      terminal: true,
      require: ['lazyModel', '^form', '?^lazySubmit'],
      scope: true,
      controller: ['$scope', '$element', '$attrs', '$parse',
        function($scope, $element, $attrs, $parse) {
          if ($attrs.lazyModel === '') {
            throw '`lazy-model` should have a value.';
          }

          // getter and setter for original model
          var ngModelGet = $parse($attrs.lazyModel);
          var ngModelSet = ngModelGet.assign;

          // accept changes
          this.accept = function() {
            ngModelSet($scope.$parent, $scope.buffer);
          };

          // reset changes
          this.reset = function() {
            $scope.buffer = ngModelGet($scope.$parent);
          };

          // watch for original model change (and initialization also)
          $scope.$watch($attrs.lazyModel, angular.bind(this, function () {
            this.reset();
          }));
        }],
      compile: function compile(elem) {
        // set ng-model to buffer in directive scope (nested)
        elem.attr('ng-model', 'buffer');
        // remove lazy-model attribute to exclude recursion
        elem.removeAttr('lazy-model');
        // store compiled fn
        var compiled = $compile(elem);
        return {
          pre: function(scope) {
            // compile element with ng-model directive poining to `scope.buffer`   
            compiled(scope);
          },
          post: function postLink(scope, elem, attr, ctrls) {
            var lazyModelCtrl = ctrls[0];
            var formCtrl = ctrls[1];
            var lazySubmitCtrl = ctrls[2];
            // parentCtrl may be formCtrl or lazySubmitCtrl
            var parentCtrl = lazySubmitCtrl || formCtrl;

            // for the first time attach hooks
            if (parentCtrl.$lazyControls === undefined) {
              parentCtrl.$lazyControls = [];

              // find form element
              var form = elem.parent();
              while (form[0].tagName !== 'FORM') {
                form = form.parent();
              }

              // bind submit
              form.bind('submit', function() {
                // this submit handler must be called LAST after all other `submit` handlers
                // to get final value of formCtrl.$valid. The only way - is to call it in
                // the next tick via $timeout
                $timeout(function() {
                  if (formCtrl.$valid) {
                    // form valid - accept new values
                    for (var i = 0; i < parentCtrl.$lazyControls.length; i++) {
                      parentCtrl.$lazyControls[i].accept();
                    }

                    // call final hook `lazy-submit`
                    if (lazySubmitCtrl) {
                      lazySubmitCtrl.finalSubmit();
                    }
                  }
                });
              });

              // bind reset
              form.bind('reset', function(e) {
                e.preventDefault();
                $timeout(function() {
                  // reset changes
                  for (var i = 0; i < parentCtrl.$lazyControls.length; i++) {
                    parentCtrl.$lazyControls[i].reset();
                  }
                });
              });

            }

            // add to collection
            parentCtrl.$lazyControls.push(lazyModelCtrl);

            // remove from collection on destroy
            scope.$on('$destroy', function() {
              for (var i = parentCtrl.$lazyControls.length; i--;) {
                if (parentCtrl.$lazyControls[i] === lazyModelCtrl) {
                  parentCtrl.$lazyControls.splice(i, 1);
                }
              }
            });

          }
        };
      }
    };
  }
])

// lazy-submit
.directive('lazySubmit', function() {
    'use strict';
    return {
      restrict: 'A',
      require: ['lazySubmit', 'form'],
      controller: ['$element', '$attrs', '$scope', '$parse',
        function($element, $attrs, $scope, $parse) {
          var finalHook = $attrs.lazySubmit ? $parse($attrs.lazySubmit) : angular.noop;
          this.finalSubmit = function() {
            finalHook($scope);
          };
        }
      ]
    };
});
'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:navCollapse
 * @description
 * # navCollapse
 * # sidebar navigation dropdown collapse
 */
angular.module('minovateApp')
  .directive('navCollapse', function () {
    return {
      restrict: 'A',
      transclude:true,
      link: function($scope, $el) {
        var $dropdowns = $el.find('ul').parent('li'),
            $a = $dropdowns.children('a'),
            $notDropdowns = $el.children('li').not($dropdowns),
            $notDropdownsLinks = $notDropdowns.children('a'),
            app = angular.element('#minovate'),
            sidebar = angular.element('#sidebar'),
            controls = angular.element('#controls');

        $dropdowns.addClass('dropdown');

        var $submenus = $dropdowns.find('ul >.dropdown');
        $submenus.addClass('submenu');

        $a.append('<i class="fa fa-plus"></i>');

        $a.on('click', function(event) {
          if (app.hasClass('sidebar-sm') || app.hasClass('sidebar-xs') || app.hasClass('hz-menu')) {
            return false;
          }

          var $this = angular.element(this),
              $parent = $this.parent('li'),
              $openSubmenu = angular.element('.submenu.open');

          if (!$parent.hasClass('submenu')) {
            $dropdowns.not($parent).removeClass('open').find('ul').slideUp();
          }

          $openSubmenu.not($this.parents('.submenu')).removeClass('open').find('ul').slideUp();
          $parent.toggleClass('open').find('>ul').stop().slideToggle();
          event.preventDefault();
        });

        $dropdowns.on('mouseenter', function() {
          sidebar.addClass('dropdown-open');
          controls.addClass('dropdown-open');
        });

        $dropdowns.on('mouseleave', function() {
          sidebar.removeClass('dropdown-open');
          controls.removeClass('dropdown-open');
        });

        $notDropdownsLinks.on('click', function() {
          $dropdowns.removeClass('open').find('ul').slideUp();
        });

        var $activeDropdown = angular.element('.dropdown>ul>.active').parent();

        $activeDropdown.css('display', 'block');
        console.log($el);
      },
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:offcanvasSidebar
 * @description
 * # offcanvasSidebar
 */
angular.module('minovateApp')
  .directive('offcanvasSidebar', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {

        var app = angular.element('#minovate'),
            $window = angular.element(window),
            width = $window.width();

        element.on('click', function(e) {
          if (app.hasClass('offcanvas-opened')) {
            app.removeClass('offcanvas-opened');
          } else {
            app.addClass('offcanvas-opened');
          }
          e.preventDefault();
        });

      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:onBlurValidation
 * @description
 * # onBlurValidation
 */
angular.module('minovateApp')
  .directive('onBlurValidation', function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, elm, attr, ctrl) {
        if (!ctrl) {
          return;
        }

        elm.on('focus', function () {
          elm.addClass('has-focus');

          scope.$apply(function () {
            ctrl.hasFocus = true;
          });
        });

        elm.on('blur', function () {
          elm.removeClass('has-focus');
          elm.addClass('has-visited');

          scope.$apply(function () {
            ctrl.hasFocus = false;
            ctrl.hasVisited = true;
          });
        });

        elm.closest('form').on('submit', function () {
          elm.addClass('has-visited');

          scope.$apply(function () {
            ctrl.hasFocus = false;
            ctrl.hasVisited = true;
          });
        });

      }
    };
  });
'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:pageLoader
 * @description
 * # pageLoader
 */
angular.module('minovateApp')
  .directive('pageLoader', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'AE',
        template: '<div class="dot1"></div><div class="dot2"></div>',
        link: function (scope, element) {
          element.addClass('hide');
          scope.$on('$stateChangeStart', function() {
            element.toggleClass('hide animate');
          });
          scope.$on('$stateChangeSuccess', function (event) {
            event.targetScope.$watch('$viewContentLoaded', function () {
              $timeout(function () {
                element.toggleClass('hide animate');
              }, 600);
            });
          });
        }
      };
    }
  ]);

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:prettyprint
 * @description
 * # prettyprint
 */
/* jshint ignore:start */
angular.module('minovateApp')
  .directive('prettyprint', function () {
    return {
      restrict: 'C',
      link: function postLink(scope, element) {
        element.html(prettyPrintOne(element.html(),'',true));
      }
    };
  });
/* jshint ignore:end */

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:ripple
 * @description
 * # ripple
 */
angular.module('minovateApp')
  .directive('ripple', function () {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var parent, ink, d, x, y;

        angular.element(element).find('>li>a').click(function(e){
          parent = angular.element(this).parent();

          if(parent.find('.ink').length === 0) {
            parent.prepend('<span class="ink"></span>');
          }

          ink = parent.find('.ink');
          //incase of quick double clicks stop the previous animation
          ink.removeClass('animate');

          //set size of .ink
          if(!ink.height() && !ink.width())
          {
            //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
            d = Math.max(parent.outerWidth(), parent.outerHeight());
            ink.css({height: d, width: d});
          }

          //get click coordinates
          //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
          x = e.pageX - parent.offset().left - ink.width()/2;
          y = e.pageY - parent.offset().top - ink.height()/2;

          //set the position and add class .animate
          ink.css({top: y+'px', left: x+'px'}).addClass('animate');

          setTimeout(function(){
            angular.element('.ink').remove();
          }, 600);
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:setNgAnimate
 * @description
 * # setNgAnimate
 */
angular.module('minovateApp')
  .directive('setNgAnimate', ['$animate', function ($animate) {
    return {
      link: function ($scope, $element, $attrs) {
        $scope.$watch( function() {
          return $scope.$eval($attrs.setNgAnimate, $scope);
        }, function(valnew){
          console.log('Directive animation Enabled: ' + valnew);
          $animate.enabled(!!valnew, $element);
        });
      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:slimScroll
 * @description
 * # slimScroll
 */
angular.module('minovateApp')
  .directive('slimscroll', function () {
    return {
      restrict: 'A',
      link: function($scope, $el, $attr) {

        var option = {};
        var refresh = function() {
          if ($attr.slimscroll) {
            option = $scope.$eval($attr.slimscroll);
          } else if ($attr.slimscrollOption) {
            option = $scope.$eval($attr.slimscrollOption);
          }
          $el.slimscroll({ destroy: true });
          $el.slimscroll(option);
        };

        refresh();

        var collapseBtn = angular.element('.sidebar-collapse'),
            $window = angular.element(window),
            sidebar = angular.element('#sidebar');

        var checkScrollbar = function() {
          refresh();
          if (!angular.element('#sidebar .slimScrollBar').is(':visible')) {
            sidebar.addClass('scroll-inactive');
          } else {
            sidebar.removeClass('scroll-inactive');
          }
        };

        collapseBtn.on('click', function(){
          checkScrollbar();
        });

        $window.resize(function() {
          checkScrollbar();
        });

        if ($attr.slimscroll && !option.noWatch) {
          $scope.$watchCollection($attr.slimscroll, refresh);
        }

        if ($attr.slimscrollWatch) {
          $scope.$watchCollection($attr.slimscrollWatch, refresh);
        }

        if ($attr.slimssrollListenTo) {
          $scope.on($attr.slimscrollListenTo, refresh);
        }
      }
    };
  });
'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:sparkline
 * @description
 * # sparkline
 */
angular.module('minovateApp')
  .directive('sparkline', [
  function() {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        options: '='
      },
      link: function($scope, $el) {
        var data = $scope.data,
            options = $scope.options,
            chartResize,
            chartRedraw = function() {
              return $el.sparkline(data, options);
            };
        angular.element(window).resize(function() {
          clearTimeout(chartResize);
          chartResize = setTimeout(chartRedraw, 200);
        });
        return chartRedraw();
      }
    };
  }
]);
'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:TileControlClose
 * @description
 * # TileControlClose
 */
angular.module('minovateApp')
  .directive('tileControlClose', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var tile = element.parents('.tile');

        element.on('click', function() {
          tile.addClass('closed').fadeOut();
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:tileControlFullscreen
 * @description
 * # tileControlFullscreen
 */
angular.module('minovateApp')
  .directive('tileControlFullscreen', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var dropdown = element.parents('.dropdown');

        element.on('click', function(){
          dropdown.trigger('click');
        });

      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:tileControlRefresh
 * @description
 * # tileControlRefresh
 */
angular.module('minovateApp')
  .directive('tileControlRefresh', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var tile = element.parents('.tile');
        var dropdown = element.parents('.dropdown');

        element.on('click', function(){
          tile.addClass('refreshing');
          dropdown.trigger('click');
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:tileControlToggle
 * @description
 * # tileControlToggle
 */
angular.module('minovateApp')
  .directive('tileControlToggle', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var tile = element.parents('.tile');

        element.on('click', function(){
          tile.toggleClass('collapsed');
          tile.children().not('.tile-header').slideToggle(150);
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:toastrInject
 * @description
 * # toastrInject - fontawesome support for angular-toastr plugin
 */
angular.module('minovateApp')
  /* jshint ignore:start */
  .run(['$templateCache', function($templateCache) {
    'use strict';

    $templateCache.put('templates/toastr/toastr.html',
            "<div class=\"{{toastClass}} {{toastType}}\" ng-click=\"tapToast()\">\n" +
            "  <i class=\"fa {{iconType}}\"></i>\n" +
            "  <div ng-switch on=\"allowHtml\">\n" +
            "    <div ng-switch-default ng-if=\"title\" class=\"{{titleClass}}\">{{title}}</div>\n" +
            "    <div ng-switch-default class=\"{{messageClass}}\">{{message}}</div>\n" +
            "    <div ng-switch-when=\"true\" ng-if=\"title\" class=\"{{titleClass}}\" ng-bind-html=\"title\"></div>\n" +
            "    <div ng-switch-when=\"true\" class=\"{{messageClass}}\" ng-bind-html=\"message\"></div>\n" +
            "  </div>\n" +
            "</div>"
    );

  }])

  .constant('toastrConfig', {
    allowHtml: false,
    closeButton: false,
    closeHtml: '<button>&times;</button>',
    containerId: 'toast-container',
    extendedTimeOut: 1000,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning'
    },
    messageClass: 'toast-message',
    positionClass: 'toast-top-right',
    tapToDismiss: true,
    timeOut: 5000,
    titleClass: 'toast-title',
    toastClass: 'toast'
  })

  .factory('toastr', ['$animate', '$compile', '$document', '$rootScope', '$sce', 'toastrConfig', '$q', function($animate, $compile, $document, $rootScope, $sce, toastrConfig, $q) {

    var container, index = 0, toasts = [];
    var containerDefer = $q.defer();

    var toast = {
      clear: clear,
      error: error,
      info: info,
      remove: remove,
      success: success,
      warning: warning
    };

    return toast;

    /* Public API */
    function clear(toast) {
      if (toast) {
        remove(toast.toastId);
      } else {
        for (var i = 0; i < toasts.length; i++) {
          remove(toasts[i].toastId);
        }
      }
    }

    function error(message, title, optionsOverride) {
      var type = _getOptions().iconClasses.error;
      return _buildNotification(type, message, title, optionsOverride);
    }

    function info(message, title, optionsOverride) {
      var type = _getOptions().iconClasses.info;
      return _buildNotification(type, message, title, optionsOverride);
    }

    function success(message, title, optionsOverride) {
      var type = _getOptions().iconClasses.success;
      return _buildNotification(type, message, title, optionsOverride);
    }

    function warning(message, title, optionsOverride) {
      var type = _getOptions().iconClasses.warning;
      return _buildNotification(type, message, title, optionsOverride);
    }

    function remove(toastId) {
      var toast = findToast(toastId);

      if (toast) { // Avoid clicking when fading out

        $animate.leave(toast.el).then(function() {
          if (toast.scope.options.onHidden) {
            toast.scope.options.onHidden();
          }
          toast.scope.$destroy();
          var index = toasts.indexOf(toast);
          toasts.splice(index, 1);
          var maxOpened = toastrConfig.maxOpened;
          if (maxOpened && toasts.length >= maxOpened) {
            toasts[maxOpened - 1].open.resolve();
          }
          if (lastToast()) {
            container.remove();
            container = null;
            containerDefer = $q.defer();
          }
        });
      }

      function findToast(toastId) {
        for (var i = 0; i < toasts.length; i++) {
          if (toasts[i].toastId === toastId) {
            return toasts[i];
          }
        }
      }

      function lastToast() {
        return !toasts.length;
      }
    }

    /* Internal functions */
    function _buildNotification(type, message, title, optionsOverride)
    {
      if (typeof title === 'object') {
        optionsOverride = title;
        title = null;
      }

      return _notify({
        iconClass: type,
        message: message,
        optionsOverride: optionsOverride,
        title: title
      });
    }

    function _getOptions() {
      return angular.extend({}, toastrConfig);
    }

    function _createOrGetContainer(options) {
      if(container) { return containerDefer.promise; }

      container = angular.element('<div></div>');
      container.attr('id', options.containerId);
      container.addClass(options.positionClass);
      container.css({'pointer-events': 'auto'});

      var body = $document.find('body').eq(0);

      $animate.enter(container, body).then(function() {
        containerDefer.resolve();
      });

      return containerDefer.promise;
    }

    function _notify(map) {
      var options = _getOptions();

      var newToast = createToast();

      toasts.push(newToast);

      if (maxOpenedNotReached()) {
        newToast.open.resolve();
      }

      newToast.open.promise.then(function() {
        _createOrGetContainer(options).then(function() {
          if (options.newestOnTop) {
            $animate.enter(newToast.el, container).then(function() {
              newToast.scope.init();
            });
          } else {
            $animate.enter(newToast.el, container, container[0].lastChild).then(function() {
              newToast.scope.init();
            });
          }
        });
      });

      return newToast;

      function createScope(toast, map, options) {
        if (options.allowHtml) {
          toast.scope.allowHtml = true;
          toast.scope.title = $sce.trustAsHtml(map.title);
          toast.scope.message = $sce.trustAsHtml(map.message);
        } else {
          toast.scope.title = map.title;
          toast.scope.message = map.message;
        }

        toast.scope.toastType = toast.iconClass;
        toast.scope.toastId = toast.toastId;

        toast.scope.options = {
          extendedTimeOut: options.extendedTimeOut,
          messageClass: options.messageClass,
          onHidden: options.onHidden,
          onShown: options.onShown,
          tapToDismiss: options.tapToDismiss,
          timeOut: options.timeOut,
          titleClass: options.titleClass,
          toastClass: options.toastClass,
          //iconType added for fontawesome
          iconType: options.iconType
        };

        if (options.closeButton) {
          toast.scope.options.closeHtml = options.closeHtml;
        }
      }

      function createToast() {
        var newToast = {
          toastId: index++,
          scope: $rootScope.$new(),
          open: $q.defer()
        };
        newToast.iconClass = map.iconClass;
        if (map.optionsOverride) {
          options = angular.extend(options, map.optionsOverride);
          newToast.iconClass = map.optionsOverride.iconClass || newToast.iconClass;
        }

        createScope(newToast, map, options);

        newToast.el = createToastEl(newToast.scope);

        return newToast;
      }

      function createToastEl(scope) {
        var angularDomEl = angular.element('<div toast></div>');
        return $compile(angularDomEl)(scope);
      }

      function maxOpenedNotReached() {
        return options.maxOpened && toasts.length <= options.maxOpened || !options.maxOpened;
      }
    }

  }])
  /* jshint ignore:end */

  .directive('toast', function () {
    return {
      link: function(scope) {
        //scope iconType added for fontawesome
        scope.iconType = scope.options.iconType;
      }
    };
  });


'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:todoEscape
 * @description
 * # todoEscape
 */
angular.module('minovateApp')
  .directive('todoEscape', function() {
    var ESCAPE_KEY = 27;

    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.bind('keydown', function (event) {
          if (event.keyCode === ESCAPE_KEY) {
            scope.$apply(attrs.todoEscape);
          }
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:todoFocus
 * @description
 * # todoFocus
 */
angular.module('minovateApp')
  .directive('todoFocus', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$watch(attrs.todoFocus, function (newVal) {
          if (newVal) {
            $timeout(function () {
              element[0].focus();
            }, 0, false);
          }
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:vectorMap
 * @description
 * # vectorMap
 */
angular.module('minovateApp')
  .directive('vectorMap', function () {
    return {
      restrict: 'AE',
      scope: {
        options: '='
      },
      link: function postLink(scope, element) {
        var options = scope.options;
        element.vectorMap(options);
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:wrapOwlcarousel
 * @description
 * # wrapOwlcarousel
 */
angular.module('minovateApp')
  .directive('wrapOwlcarousel', function () {
    return {
      restrict: 'E',
      link: function postLink(scope, element) {
        var options = scope.$eval(angular.element(element).attr('data-options'));

        angular.element(element).owlCarousel(options);
      }
    };
  });
