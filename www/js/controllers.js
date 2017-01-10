'use strict';
angular.module('dashboard').controller('AppCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicPopover, $timeout) {
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };
    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };
    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };
    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };
    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;
        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }
        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };
    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };
    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };
    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };
    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
    $scope.logout = function() {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('refineData');
        window.localStorage.removeItem('userData');
        $state.go('app.login');
    };
    $rootScope.logout = function() {
	    window.localStorage.removeItem('token');
	    window.localStorage.removeItem('refineData');
	    window.localStorage.removeItem('userData');
	    $state.go('app.login');
    }
    $rootScope.saveToken = function(token) {
        window.localStorage.setItem('token', token);
    };
    $rootScope.saveuserData = function(userData){
    	window.localStorage.setItem('userData', JSON.stringify(userData));
    	$scope.fname = userData.firstname;
    	$scope.lname = userData.lastname;
    };
    $rootScope.getToken = function(token) {
        var token = window.localStorage.getItem('token');
        return token;
    };
    $rootScope.getUserData = function() {
        var userData = window.localStorage.getItem('userData');
        return userData;
    };
    $rootScope.getcolor = function(brightness) {
        var rgb = [Math.random() * 0, Math.random() * 255, Math.random() * 255];
        var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
        var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x) {
            return Math.round(x / 2.0)
        })
        return "rgba(" + mixedrgb.join(",") + ",0.9)";
        //return "rgba("+(Math.floor(Math.random() * 255))+", "+(Math.floor(Math.random() * 255))+","+(Math.floor(Math.random() * 255))+",0.8)";
        //return '#' + Math.random().toString(16).substr(-6);
    }
    $rootScope.getBarGraphData = function(inputData, stacked, chartType) {
        var labels = [];
        var data = [];
        var datasets = [];
        var option;
        	if(inputData[0].buckets !== undefined){
        	for (var j = 0; j < inputData[0].buckets.length; j++) {
                for (var i = 0; i < inputData[0].buckets[j].aggregations.length; i++) {
                    data[i] = [];
                }
            }
            for (var j = 0; j < inputData[0].buckets.length; j++) {
                if (inputData[0].buckets[j].key_as_string !== undefined) {
                    labels.push((inputData[0].buckets[j].key_as_string).substring(0, 10));
                } else {
                    labels.push((inputData[0].buckets[j].key).substring(0, 10));
                }
                for (var i = 0; i < inputData[0].buckets[j].aggregations.length; i++) {
                	if(inputData[0].buckets[j].aggregations[i].name != 'YrsOfExperience' && inputData[0].buckets[j].aggregations[i].name != "TotalSpentEffort" && (inputData[0].buckets[j].aggregations[i].name !='SpentEffort' || chartType =='line')){
                		data[i].push(inputData[0].buckets[j].aggregations[i].value);
                	}
                }
            }
            if (chartType === 'bar') {
                for (var j = 0; j < inputData[0].buckets[0].aggregations.length; j++) {
                	if(inputData[0].buckets[0].aggregations[j].name !='SpentEffort' && inputData[0].buckets[0].aggregations[j].name != 'YrsOfExperience' && inputData[0].buckets[0].aggregations[j].name != "TotalSpentEffort" ){
	                	datasets.push({
	                        'label': inputData[0].buckets[0].aggregations[j].name,
	                        'backgroundColor': $rootScope.getcolor(3),
	                        'borderColor': $rootScope.getcolor(1),
	                        'borderWidth': 0.6,
	                        'pointBackgroundColor': $rootScope.getcolor(3),
	                        'pointBorderColor': $rootScope.getcolor(1),
	                        'data': data[j]
	                    });
                	}
                }
                option = {
                    animation: {
                        duration: 5000
                    },
                    barThickness: 1,
                    scales: {
                        xAxes: [{
                            stacked: stacked,
                            barPercentage: 0.6,
                            categoryPercentage: 0.2
                        }],
                        yAxes: [{
                            stacked: stacked
                        }]
                    }
                };
        } else if (chartType === 'line') {
	            for (var j = 0; j < inputData[0].buckets[0].aggregations.length; j++) {
	                datasets.push({
	                    'label': inputData[0].buckets[0].aggregations[j].name,
	                    'backgroundColor': $rootScope.getcolor(2),
	                    'borderColor': $rootScope.getcolor(1),
	                    'lineTension': 0.5,
	                    'borderWidth': 2,
	                    'fill': false,
	                    'pointBackgroundColor': $rootScope.getcolor(2 ),
	                    'pointBorderColor': $rootScope.getcolor(1),
	                    'data': data[j]
	                });
	
	            }
	            option = {
	                animation: {
	                    duration: 5000,
	                },
	                scales: {
	                    xAxes: [{
	                        display: true
	                    }]
	                }
	            }
        }
    }
        var outputData = {
            labels: labels,
            datasets: datasets,
            option: option
        };
        return outputData;
    };
}).controller('UserProfileCtrl', function($scope, $ionicModal, $rootScope, $timeout, $state, $stateParams, ionicMaterialMotion, ionicMaterialInk, userService) {
	$scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);
    ionicMaterialMotion.fadeSlideInRight();
    ionicMaterialInk.displayEffect();
    $ionicModal.fromTemplateUrl('templates/changePassword.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.changePassModal = modal;
    });
    $scope.showChangePassModal = function(){
    	$scope.changePassModal.show();
    };
    $scope.closepasswordModal = function(){
    	$scope.changePassModal.hide();
    };
    $scope.changePassword = function(changePassData){
    	userService.changePass($rootScope.getToken(), changePassData, JSON.parse($rootScope.getUserData())).then(function(changePassResp) {
    		$scope.changePassResp = changePassResp;
    		$scope.closepasswordModal();
    		$rootScope.logout();
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
    };
    $scope.goBack = function() {
        $state.go('app.profile');
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        $timeout(function() {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);
        $timeout(function() {
            ionicMaterialMotion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);
        ionicMaterialInk.displayEffect();
    };
    $scope.userProfileData = JSON.parse($rootScope.getUserData());
}).controller('LoginCtrl', function($scope, $ionicModal, $rootScope, $timeout, $state, $stateParams, ionicMaterialMotion, ionicMaterialInk, loginService) {
    $scope.$parent.clearFabs();
    $scope.$parent.hideHeader();
    $scope.login = function(data) {
        $scope.authTokenForLogin = btoa(data.username + ":" + data.password);
        loginService.login($scope.authTokenForLogin, data).then(function(loginResp) {
            $rootScope.saveToken($scope.authTokenForLogin);
            $rootScope.saveuserData(loginResp);
            $scope.errorObj = false;
            $state.go('app.profile');
            $scope.$parent.showHeader();
            $scope.$parent.clearFabs();
            $scope.isExpanded = false;
            $scope.$parent.setExpanded(false);
            $scope.$parent.setHeaderFab(false);
            $timeout(function() {
                ionicMaterialMotion.slideUp({
                    selector: '.slide-up'
                });
            }, 300);
            $timeout(function() {
                ionicMaterialMotion.fadeSlideInRight({
                    startVelocity: 3000
                });
            }, 700);
            ionicMaterialInk.displayEffect();
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
    }
    var authToken = window.localStorage.getItem('token');
    if (authToken !== "undefined" && authToken !== null) {
        $scope.errorObj = false;
        $state.go('app.profile');
    }
}).controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);
    ionicMaterialMotion.fadeSlideInRight();
    ionicMaterialInk.displayEffect();
}).controller('ProfileCtrl', function($scope, $rootScope, $ionicModal, $state, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, graphService, programService) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);
    $timeout(function() {
        document.getElementById('estimatedEffort').classList.toggle('on');
        document.getElementById('remainingEffort').classList.toggle('on');
        document.getElementById('spentEffort').classList.toggle('on');
    }, 600);
    ionicMaterialInk.displayEffect();
    $ionicModal.fromTemplateUrl('templates/refineDashboard.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.refineModal = modal;
    });
    $scope.userData =  JSON.parse(window.localStorage.getItem('userData'));
    $scope.closeRefineModal = function() {
        $scope.refineModal.hide();
    }
    //$scope.drawEffortsChart($scope.estimatedEffort, $scope.spentEffort);
    $scope.drawEffortsChart = function(estimatedEffort, spentEffort){
        //d3.select('svg').remove();
        var estimatedVal = estimatedEffort[0].value;
        var spentVal = spentEffort[0].value;
        
        var estimated = estimatedVal;
        var spent = spentVal;
        
        var spentPercentage = (spent/estimated)*100;
        
        var effortsData = function () {
            var ran = Math.random();

            return    [
                {index: 0, name: 'estimated', icon: "\uF105", percentage: 0, newPercentage: 98},
                {index: 1, name: 'spent', icon: "\uF101", percentage: 0, newPercentage: spentPercentage}
            ];

        };
        spentLabel = spent +" hrs";
        estimLabel = estimated + " hrs";
        var parentElement = document.getElementById("effortsChartDivId");
        build(effortsData, parentElement); 
    };
    $scope.destroyGraphs = function (){
    	if($scope.myBarChart0 != undefined || $scope.myBarChart0 != null){
            $scope.myBarChart0.destroy();
    	}
    	if($scope.myBarChart1 != undefined || $scope.myBarChart1 != null){
            $scope.myBarChart1.destroy();
    	}
    	if($scope.myBarChart2 != undefined || $scope.myBarChart2 != null){
            $scope.myBarChart2.destroy();
    	}
    	if($scope.myBarChart3 != undefined || $scope.myBarChart3 != null){
            $scope.myBarChart3.destroy();
    	}
    	if($scope.myBarChart4 != undefined || $scope.myBarChart4 != null){
            $scope.myBarChart4.destroy();
    	}
    	if($scope.myBarChart5 != undefined || $scope.myBarChart5 != null){
            $scope.myBarChart5.destroy();
    	}
    	if($scope.myBarChart6 != undefined || $scope.myBarChart6 != null){
            $scope.myBarChart6.destroy();
    	}
    	if($scope.myBarChart7 != undefined || $scope.myBarChart7 != null){
            $scope.myBarChart7.destroy();
    	}
    };
    $scope.drawCharts = function(){
    	var params = [];
    	$scope.params = {};
        if (($scope.refineData.sprint!=undefined ||$scope.refineData.sprint!=null) && ($scope.refineData.selectProject!=undefined ||$scope.refineData.selectProject!=null)){
        	params[0]  = { "sprintId": $scope.refineData.selectProject+$scope.refineData.sprint }
        }
        if (($scope.refineData.selectProject!=undefined || $scope.refineData.selectProject!=null) && ($scope.refineData.selectProject!='Select')){
        	params[1] = { "projectId": $scope.refineData.selectProject}
        }
    	if(params[0]!=undefined && params[1]!=undefined){
    		$scope.params['sprintId'] = params[0].sprintId;
    		$scope.params['projectId'] = params[1].projectId;
    	}else if(params[0]!=undefined && params[1]==undefined){
    		$scope.params['sprintId'] = params[0].sprintId;
    	}else if(params[1]!=undefined) {
    		$scope.params['projectId'] = params[1].projectId;
    	}
    	$scope.destroyGraphs();
    	graphService.getCircleDataEstimatedEffort($rootScope.getToken(), $scope.refineData, $scope.userData, $scope.params).then(function(estimatedEffort) {
            $scope.estimatedEffort = estimatedEffort;
            $scope.color1 = $rootScope.getcolor(2);
            graphService.getCircleDataSpentEffort($rootScope.getToken(), $scope.refineData, $scope.userData , $scope.params).then(function(spentEffort) {
                $scope.spentEffort = spentEffort;
                $scope.color3 = $rootScope.getcolor(2);
                $scope.drawEffortsChart($scope.estimatedEffort, $scope.spentEffort);
            }, function(err) {
                $scope.errorObj = err.data.message;
                console.log("Failed!, something went wrong. " + err.data.message);
            });
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
        graphService.getCircleDataRemainingEffort($rootScope.getToken(), $scope.refineData, $scope.userData, $scope.params).then(function(remainingEffort) {
            $scope.remainingEffort = remainingEffort;
            $scope.color2 = $rootScope.getcolor(2);
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
        
        graphService.getSpentEffortHistogram($rootScope.getToken(), $scope.refineData, $scope.userData, $scope.params).then(function(SpentEffortResp) {
            $scope.spentEffortData = $rootScope.getBarGraphData(SpentEffortResp, true, 'bar');
            var bar = document.getElementById("spentEffortHistogramCanvas").getContext("2d");
            $scope.myBarChart0 = new Chart(bar, {
                type: 'bar',
                data: $scope.spentEffortData,
                options: $scope.spentEffortData.option
            });
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
        graphService.getBurndown($rootScope.getToken(), $scope.refineData, $scope.userData, $scope.params).then(function(burnDownResp) {
            $scope.burndownData = $rootScope.getBarGraphData(burnDownResp, true, 'line');
            var bar = document.getElementById("burndownCanvas").getContext("2d");
            $scope.myBarChart1 = new Chart(bar, {
                type: 'line',
                data: $scope.burndownData,
                options: $scope.burndownData.option
            });
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
        graphService.getproductivityHistogramCanvas($rootScope.getToken(), $scope.refineData, $scope.userData, $scope.params).then(function(productivityResp) {
            $scope.productivityResp = $rootScope.getBarGraphData(productivityResp, false, 'bar');
            var bar = document.getElementById("productivityHistogramCanvas").getContext("2d");
            $scope.myBarChart2 = new Chart(bar, {
                type: 'bar',
                data: $scope.productivityResp,
                options: $scope.productivityResp.option
            });
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
        graphService.getQualityHistogram($rootScope.getToken(), $scope.refineData, $scope.userData, $scope.params).then(function(qualityHistogramResp) {
            $scope.qualityHistogramResp = $rootScope.getBarGraphData(qualityHistogramResp, false, 'bar');
            var bar = document.getElementById("qualityHistogramCanvas").getContext("2d");
            $scope.myBarChart3 = new Chart(bar, {
                type: 'bar',
                data: $scope.qualityHistogramResp,
                options: $scope.qualityHistogramResp.option
            });
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
        graphService.getTeamHistogram($rootScope.getToken(), $scope.refineData, $scope.userData, $scope.params).then(function(teamResp) {
            $scope.teamResp = $rootScope.getBarGraphData(teamResp, true, 'bar');
            var bar = document.getElementById("teamCanvas").getContext("2d");
            $scope.myBarChart4 = new Chart(bar, {
                type: 'bar',
                data: $scope.teamResp,
                options: $scope.teamResp.option
            });
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
        graphService.getProjectProductivity($rootScope.getToken(), $scope.refineData, $scope.userData, $scope.params).then(function(projectProductivityStatResp) {
            $scope.projectProductivityStatResp = $rootScope.getBarGraphData(projectProductivityStatResp, false, 'bar');
            var bar = document.getElementById("projectProductivityStatCanvas").getContext("2d");
            $scope.myBarChart5 = new Chart(bar, {
                type: 'bar',
                data: $scope.projectProductivityStatResp,
                options: $scope.projectProductivityStatResp.option
            });
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
        graphService.getProjectQuality($rootScope.getToken(), $scope.refineData, $scope.userData, $scope.params).then(function(projectQualityStatResp) {
            $scope.projectQualityStatResp = $rootScope.getBarGraphData(projectQualityStatResp, false, 'bar');
            var bar = document.getElementById("projectQualityStatCanvas").getContext("2d");
            $scope.myBarChart6 = new Chart(bar, {
                type: 'bar',
                data: $scope.projectQualityStatResp,
                options: $scope.projectQualityStatResp.option
            });
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
        graphService.getProjectSpentEfforts($rootScope.getToken(), $scope.refineData, $scope.userData, $scope.params).then(function(projectSpentEffortsStatResp) {
            $scope.projectSpentEffortsStatResp = $rootScope.getBarGraphData(projectSpentEffortsStatResp, false, 'bar');
            var bar = document.getElementById("projectSpentEffortsStatCanvas").getContext("2d");
            $scope.myBarChart7 = new Chart(bar, {
                type: 'bar',
                data: $scope.projectSpentEffortsStatResp,
                options: $scope.projectSpentEffortsStatResp.option
            });
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
    };
    $scope.refineShow = function(){
    	$scope.refineData = {};
    	var refinesaveData = JSON.parse(window.localStorage.getItem('refineData'));
    	$scope.refineData.selectProgram = (refinesaveData != null && refinesaveData.selectProgram!=null)?refinesaveData.selectProgram:undefined;
    	$scope.refineData.selectProject = (refinesaveData != null && refinesaveData.selectProject!=null)?refinesaveData.selectProject:undefined;
    	$scope.refineData.startDate = new Date((refinesaveData != null && refinesaveData.startDate!=null)?refinesaveData.startDate:'');
    	$scope.refineData.endDate = new Date((refinesaveData != null && refinesaveData.endDate!=null)?refinesaveData.endDate:'');
    	$scope.refineData.interval = (refinesaveData != null && refinesaveData.interval!=null)?refinesaveData.interval:undefined;
    	$scope.refineData.sprint = (refinesaveData != null && refinesaveData.sprint!=null)?refinesaveData.sprint:undefined;
    	$scope.refineModal.show();
    };
    $scope.refreshCharts = function(refineData){
    	window.localStorage.setItem('refineData', JSON.stringify(refineData));
    	$scope.refineData = JSON.parse(window.localStorage.getItem('refineData'));
    	var projectName = ($scope.refineData.selectProject != 'Select' && $scope.refineData.selectProject != undefined && $scope.refineData.selectProject != null)?' -> '+$scope.refineData.selectProject:'';
    	var sprintId = ($scope.refineData.sprint != null && $scope.refineData.sprint != undefined)?' -> '+$scope.refineData.sprint:'';
    	$scope.titleName = $scope.refineData.selectProgram+projectName+sprintId +' DASHBOARD';
    	$scope.closeRefineModal(); 
    	$scope.drawCharts();
    };
    $scope.getAllProjects = function(programId) {
        programService.getAllProjects(programId, $rootScope.getToken(), $scope.userData).then(function(projectResp) {
            $scope.projectOptions = projectResp;
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
    };
    programService.getAllProgram($rootScope.getToken(),$scope.userData).then(function(loginResp) {
        $scope.programOption = loginResp;
    }, function(err) {
        $scope.errorObj = err.data.message;
        console.log("Failed!, something went wrong. " + err.data.message);
    });
    $scope.refinesaveData =  window.localStorage.getItem('refineData');
    if($scope.refinesaveData === 'undefined' || $scope.refinesaveData === null){
    	$ionicModal.fromTemplateUrl('templates/refineDashboard.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.refineModal = modal;
            $scope.refineModal.show();
        });
    }else{
    	$scope.refineData = JSON.parse(window.localStorage.getItem('refineData'));
    	$scope.drawCharts();
    }
    var projectName = ($scope.refineData!= undefined && $scope.refineData.selectProject != 'Select' && $scope.refineData.selectProject != undefined && $scope.refineData.selectProject != null)?' -> '+$scope.refineData.selectProject:'';
    var sprintId = ($scope.refineData!= undefined && $scope.refineData.sprint != null && $scope.refineData.sprint != undefined)?' -> '+$scope.refineData.sprint:'';
    var programName = ($scope.refineData!= undefined && $scope.refineData.selectProgram != undefined)?$scope.refineData.selectProgram:'';
    $scope.titleName = programName+projectName+sprintId +' DASHBOARD';
}).controller('ActivityCtrl', function($scope, $state, $filter, $rootScope, $stateParams, $ionicSlideBoxDelegate, $timeout, ionicMaterialMotion, ionicMaterialInk, programService, ERROR, userService) {
	 $scope.$parent.showHeader();
     $scope.isExpanded = false;
     $scope.$parent.setExpanded(false);
     $scope.$parent.setHeaderFab(false);
     $timeout(function() {
         document.getElementById('fab-profile1').classList.toggle('on');
         document.getElementById('fab-profile2').classList.toggle('on');
     }, 600);
     ionicMaterialInk.displayEffect();
     $scope.selection = [];
    $scope.goBack = function() {
        $state.go('app.profile');
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        $timeout(function() {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);
        $timeout(function() {
            ionicMaterialMotion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);
        ionicMaterialInk.displayEffect();
    }
    $scope.search = function(serachInput) {
    	userService.search($rootScope.getToken(), serachInput).then(function(searchResp) {
    		$scope.searchResult = searchResp
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
    };
    $scope.toggleSelection = function toggleSelection(option, value, index, userRole) {
    	option.userrole = (userRole == undefined)?'Developer':userRole
        var idx = $scope.selection.indexOf(option);
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        } else if(value[index]) {
            $scope.selection.push(option);
        }
    };
    $scope.deleteUser = function toggleSelection(option) {
        var idx = $scope.selection.indexOf(option);
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        } else if(value) {
            $scope.selection.push(option);
        }
    };
    $scope.refinesaveData =  window.localStorage.getItem('refineData');
    $scope.userData =  JSON.parse(window.localStorage.getItem('userData'));
    programService.getAllProgram($rootScope.getToken(), $scope.userData).then(function(loginResp) {
        $scope.programOption = loginResp;
    }, function(err) {
        $scope.errorObj = err.data.message;
        console.log("Failed!, something went wrong. " + err.data.message);
    });
    $scope.$parent.showHeader();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');
    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);
    $scope.data = {};
    ionicMaterialInk.displayEffect();
    $scope.currentSlide = 0;
    $scope.disableSwipe = function() {
        $ionicSlideBoxDelegate.enableSlide(false);
    };
    $scope.isBackdate = false;
    $scope.backDate = function(isBackDate){
    	if(isBackDate){
    		$scope.isBackdate = true;
    	}
    	else {
    		$scope.isBackdate = false;
    	}
    };
    $scope.nextSlide = function(data, $event) {
        $scope.currentSlide = $ionicSlideBoxDelegate.currentIndex();
        if ($scope.currentSlide === 0) {
            if (data.selectProgram === undefined || data.selectProject === undefined) {
                $scope.slideError1 = true;
                $scope.slideError1Message = ERROR.errorMessage;
            } else {
                $scope.slideError1 = false;
                $scope.currentSlide++;
                $ionicSlideBoxDelegate.next();
            }
        } else if ($scope.currentSlide === 1) {
            if (data.sprint === undefined || data.userStoryCount === undefined || data.startDate === undefined || data.endDate === undefined) {
                $scope.slideError2 = true;
                $scope.slideError2Message = ERROR.errorMessage;
            } else if (data.sprint < 0 || data.userStoryCount < 0) {
                $scope.slideError2 = true;
                $scope.slideError2Message = ERROR.errorMessageValue;
            } else if(data.isBackDate){
            	if(data.backDate === undefined){
            		$scope.slideError2 = true;
                    $scope.slideError2Message = ERROR.errorMessage;
            	}
            	else{
            		 $scope.slideError2 = false;
                     $scope.currentSlide++;
                     $ionicSlideBoxDelegate.next();
            	}
            }else {
                $scope.slideError2 = false;
                $scope.currentSlide++;
                $ionicSlideBoxDelegate.next();
            }
        } else if ($scope.currentSlide === 2) {
            if (data.searchinput === undefined || $scope.selection.length <= 0) {
                $scope.slideError3 = true;
                $scope.slideError3Message = ERROR.errorMessage;
            } else {
                $scope.slideError3 = false;
                $scope.currentSlide++;
                $ionicSlideBoxDelegate.next();
            }
        } else if ($scope.currentSlide === 3) {
            if (data.spentHours_requirements === undefined || data.spentHours_design === undefined || data.spentHours_build === undefined || data.spentHours_test === undefined || data.spentHours_support === undefined || data.spentHours_unproductive === undefined) {
                $scope.slideError4 = true;
                $scope.slideError4Message = ERROR.errorMessage;
            } else {
                $scope.slideError4 = false;
                $scope.currentSlide++;
                $ionicSlideBoxDelegate.next();
            }
        } else if ($scope.currentSlide === 4) {
            if (data.remainingHours_requirements === undefined || data.remainingHours_design === undefined || data.remainingHours_build === undefined || data.remainingHours_test === undefined || data.remainingHours_support === undefined || data.remainingHours_unproductive === undefined) {
                $scope.slideError5 = true;
                $scope.slideError5Message = ERROR.errorMessage;
            } else {
                $scope.slideError5 = false;
                $scope.currentSlide++;
                $ionicSlideBoxDelegate.next();
            }
        } else if ($scope.currentSlide === 5) {
            if (data.estimatedHours_requirements === undefined || data.estimatedHours_design === undefined || data.estimatedHours_build === undefined || data.estimatedHours_test === undefined || data.estimatedHours_support === undefined || data.estimatedHours_unproductive === undefined) {
                $scope.slideError6 = true;
                $scope.slideError6Message = ERROR.errorMessage;
            } else {
                $scope.slideError6 = false;
                $scope.currentSlide++;
                $ionicSlideBoxDelegate.next();
            }
        } else if ($scope.currentSlide === 6) {
            if (data.qualityMetrics_stats_junit === undefined || data.qualityMetrics_stats_sonarCritical === undefined || data.qualityMetrics_stats_sonarMajor === undefined || data.qualityMetrics_stats_defectSev1 === undefined || data.qualityMetrics_stats_defectSev2 === undefined || data.qualityMetrics_stats_defectSev3 === undefined || data.qualityMetrics_stats_defectSev4 === undefined) {
                $scope.slideError7 = true;
                $scope.slideError7Message = ERROR.errorMessage;
            } else {
                $scope.slideError7 = false;
                $scope.currentSlide++;
                $ionicSlideBoxDelegate.next();
            }
        } else {
            if (data.productivityMetrics_stats_storypoints === undefined || data.productivityMetrics_stats_velocity === undefined) {
                $scope.slideError8 = true;
                $scope.slideError8Message = ERROR.errorMessage;
            } else {
                $scope.slideError8 = false;
                $scope.currentSlide++;
                $ionicSlideBoxDelegate.next();
                var sprintStatus;
                $scope.selecteduser = [];
                for ( var i = 0; i < $scope.selection.length; i ++){
                	$scope.selecteduser.push({
                        "user": {
                            "id": $scope.selection[i].id,
                            "email": $scope.selection[i].email
                        },
                        "role": $scope.selection[i].userrole
                    })
                }
                var logDate = (data.backDate === undefined)?new Date():data.backDate;
                var projectData = {
                    "logDate": $filter('date')(logDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    "project": {
                        "id": data.selectProject
                    },
                    "sprint": {
                        "id": data.selectProject+data.sprint,
                        "sprintNumber": data.sprint,
                        "status": (data.isSprintActive) ? sprintStatus = "ACTIVE" : sprintStatus = "INACTIVE",
                        "startDate": $filter('date')(data.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                        "endDate": $filter('date')(data.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                        "userStoryCount": data.userStoryCount,
                        "teamMembers": $scope.selecteduser,
                        "effortMetrics": {
                            "spentHours": {
                                "requirements": data.spentHours_requirements,
                                "design": data.spentHours_design,
                                "build": data.spentHours_build,
                                "test": data.spentHours_test,
                                "support": data.spentHours_support,
                                "unproductive": data.spentHours_unproductive
                            },
                            "remainingHours": {
                                "requirements": data.remainingHours_requirements,
                                "design": data.remainingHours_design,
                                "build": data.remainingHours_build,
                                "test": data.remainingHours_test,
                                "support": data.remainingHours_support,
                                "unproductive": data.remainingHours_unproductive
                            },
                            "estimatedHours": {
                                "requirements": data.estimatedHours_requirements,
                                "design": data.estimatedHours_design,
                                "build": data.estimatedHours_build,
                                "test": data.estimatedHours_test,
                                "support": data.estimatedHours_support,
                                "unproductive": data.estimatedHours_unproductive
                            }
                        },
                        "qualityMetrics": {
                            "stats": {
                                "junit": data.qualityMetrics_stats_junit,
                                "sonarCritical": data.qualityMetrics_stats_sonarCritical,
                                "sonarMajor": data.qualityMetrics_stats_sonarMajor,
                                "DefectsSev1": data.qualityMetrics_stats_defectSev1,
                                "DefectsSev2": data.qualityMetrics_stats_defectSev2,
                                "DefectsSev3": data.qualityMetrics_stats_defectSev3,
                                "DefectsSev4": data.qualityMetrics_stats_defectSev4
                            }
                        },
                        "productivityMetrics": {
                            "stats": {
                                "storyPoints": data.productivityMetrics_stats_storypoints,
                                "velocity": data.productivityMetrics_stats_velocity
                            }
                        }
                    }
                };
                programService.saveProjectSnapshot(data.selectProgram, projectData, $rootScope.getToken(), JSON.parse($rootScope.getUserData())).then(function(createProjectSnapshotResp) {
                    $scope.createProjectSnapshotResp = createProjectSnapshotResp;
                    $state.go('app.profile');
                    $scope.$parent.showHeader();
                    $scope.$parent.clearFabs();
                    $scope.isExpanded = false;
                    $scope.$parent.setExpanded(false);
                    $scope.$parent.setHeaderFab(false);
                    $timeout(function() {
                        ionicMaterialMotion.slideUp({
                            selector: '.slide-up'
                        });
                    }, 300);
                    $timeout(function() {
                        ionicMaterialMotion.fadeSlideInRight({
                            startVelocity: 3000
                        });
                    }, 700);
                    ionicMaterialInk.displayEffect();
                }, function(err) {
                    $scope.errorObj = err.data.message;
                    console.log("Failed!, something went wrong. " + err.data.message);
                });
            }
        }
        if (data.length === undefined) {
            $ionicSlideBoxDelegate.stop();
            $event.preventDefault();
        }
    };
    $scope.previousSlide = function() {
        $scope.currentSlide = $ionicSlideBoxDelegate.currentIndex();
        $scope.currentSlide--;
        $ionicSlideBoxDelegate.previous();
    };
    $scope.getAllProjects = function(programId) {
        programService.getAllProjects(programId, $rootScope.getToken(),  $scope.userData).then(function(projectResp) {
            $scope.projectOptions = projectResp;
        }, function(err) {
            $scope.errorObj = err.data.message;
            console.log("Failed!, something went wrong. " + err.data.message);
        });
    };
}).controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });
});