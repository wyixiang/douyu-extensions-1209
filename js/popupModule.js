var app = angular.module('app', []);
app.run(onAppRun);

function onAppRun($rootScope) {
    $rootScope.CONST = window.CONST;
    $rootScope.Math = window.Math;
    $rootScope.console = window.console;
}

CONST = {
    DEV_MODE: true,
    Switch: Switch
};

app.directive('switch', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            switched: '=switch',
            stateChange: '&'
        },
        template:
        '<div ng-click="onClick()">' +
        ' <div class="back cantSelect" ng-class="{ switched: switched }">' +
        //'  <div>NO</div>' +
        //'  <div>YES</div>' +
        '  <div class="item"></div>' +
        ' </div>' +
        '</div>',
        link: function ($scope, element) {
            $scope.onClick = function () {
                $scope.switched = !$scope.switched;
                $scope.stateChange({ switched: $scope.switched });
            };
        }
    }
}]);

app.directive('checkBox', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            checked: '=checkBox',
            stateChange: '&',
            text: '='
        },
        template:
        '<div class="checkBox cantSelect" ng-click="onClick()">' +
        ' <div class="box" ng-class="{ checked: checked }"></div>' +
        ' <div class="text">{{ text }}</div>' +
        '</div>',
        link: function ($scope, element) {
            $scope.onClick = function () {
                $scope.checked = !$scope.checked;
                $scope.stateChange({ checked: $scope.checked });
            };
        }
    }
}]);

app.directive('crosswiseList', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            label: '=',
            liData: '=',
            index: '=',
            stateChange: '&'
        },
        template:
        '<div class="crosswiseList cantSelect">' +
        '   {{ label }}: <span>{{ liData[index] }}</span>' +
        '   <button ng-click="change(false)"><</button><button ng-click="change(true)">></button>' +
        '</div>',
        link: function ($scope, element) {
            $scope.change = function (isAdd) {
                if (isAdd) {
                    if ($scope.index + 1 >= $scope.liData.length) {
                        $scope.index = 0;
                    } else {
                        $scope.index++;
                    }
                } else {
                    if ($scope.index <= 0) {
                        $scope.index = $scope.liData.length - 1;
                    } else {
                        $scope.index--;
                    }
                }
                $scope.stateChange({ index: $scope.index, val: $scope.liData[$scope.index] });
            };
        }
    }
}]);

app.directive('dropDown', [function () {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        scope: {
            height: '=',
            width: '=',
            liData: '=liData',
            liSelect: '=liSelect',
            clickChange: '&'
        },
        template:
        '<div class="cus-select" style="width: {{width}};">'
        +'<span dropDown="1" ng-click="toggle()" style="line-height: {{height}}" ng-class="{ expand: showMe }">{{ selectTitle }}</span>'
        +'<ul ng-if="showMe" class="drop-down-animation">'
        +' <li style="width: {{ width }}; line-height: {{height}}; height: {{height}}" ng-mousedown="$event.which == 1 ? toggle() : null">{{ selectTitle }}</li>'
        +' <li style="width: {{ width }}; line-height: {{height}}; height: {{height}}" ng-repeat="data in liData" ng-hide="data == selectTitle" ng-mousedown="$event.which == 1 ? clickLi(data) : null">{{ data }}</li>'
        +'</ul>'
        +'</div>',
        link: function ($scope, element) {
            $scope.showMe = false;
            $scope.selectTitle = $scope.liData[0];
            $scope.selected = $scope.liSelect ? $scope.liSelect : '';
            if($scope.selected != '' && $scope.liData.indexOf($scope.selected) > -1) $scope.selectTitle = $scope.selected;
            var oneMouseDown = function(event){
                var elm = angular.element(event.target);
                var elms = elm.parents('.cus-select');
                if(elms.length == 0 || elms[0] != element[0]) $scope.showMe = false;
                $scope.$apply();
            };

            $scope.toggle = function toggle() {
                $scope.showMe = !$scope.showMe;
                if($scope.showMe) angular.element(document).one('mousedown', oneMouseDown);
                else angular.element(document).off('mousedown', oneMouseDown);
            };

            $scope.clickLi = function clickLi(data_){
                $scope.showMe = !$scope.showMe;
                if($scope.selectTitle == data_) return;
                $scope.selectTitle = data_;
                $scope.clickChange({ val: data_ });
            };
        }
    }
}]);