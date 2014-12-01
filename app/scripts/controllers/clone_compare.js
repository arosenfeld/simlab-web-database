(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('ClonesCompareCtrl', ['$scope',
            '$http', '$routeParams', '$timeout', '$log', '$modal', 'dnaCompare',
            'APIService',
        function($scope, $http, $routeParams, $timeout, $log, $modal,
                dnaCompare, APIService) {

            $scope.SEQS_PER_CANVAS = 100;

            $scope.openModal = function(title, mutations) {
                $modal.open({
                    templateUrl: 'mutationsModal.html',
                    controller: 'AlertModalCtrl',
                    resolve: {
                        title: function() {
                            return title;
                        },
                        data: function() {
                            return mutations;
                        }
                    }
                });
            }

            $scope.prevPage = function(cloneId) {
                updateScroller(cloneId, Math.max(0, --$scope.pages[cloneId]));
            }

            $scope.nextPage = function(cloneId) {
                updateScroller(cloneId, ++$scope.pages[cloneId]);
            }

            var updateScroller = function(cloneId, page) {
                var info = $scope.cloneInfo[cloneId];
                dnaCompare.makeComparison(
                    $('#compare-' + cloneId).get(0),
                    info.clone.germline,
                    info.clone.group.cdr3_num_nts,
                    info.seqs.slice(page * $scope.SEQS_PER_CANVAS, (page + 1) * $scope.SEQS_PER_CANVAS),
                    info.mutation_stats);
            }

            var init = function() {
                $scope.showLoader();
                $scope.$parent.page_title = 'Clone Comparison';
                $scope.api = APIService.getUrl();
                $scope.params = $routeParams['uids'];
                $scope.pages = {};

                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'clone_compare/' + $routeParams['uids']
                }).success(function(data, status) {
                    $scope.cloneInfo = data['clones'];
                    $scope.ceil = Math.ceil;
                    $timeout(function(){
                        for (var cid in $scope.cloneInfo) {
                            updateScroller(cid, 0);
                            $scope.pages[cid] = 0;
                        }
                    }, 0);
                    $scope.hideLoader();
                }).error(function(data, status, headers, config) {
                    $scope.showError()
                });
            }

            init();
        }
    ]);
})();
