angular.module('dashboard').service('loginService', function($q, $http, URL) {
    var login = function(authTokenForLogin, data) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + 'user/' + data.username + '/',
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    return {
        login: login,
    };
}).service('userService', function($q, $http, URL) {
    var search = function(authTokenForLogin, searchInput) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + 'users/',
                method: 'GET',
                params: {
                	fts:searchInput
                },
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var changePass = function(authTokenForLogin, newPassData, userData) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + 'user/profile',
                method: 'PATCH',
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json'
                },
                data: {
                	"email":userData.email,
            	    "password":newPassData.newPass,
            	    "firstname": userData.firstname
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    return {
    	search: search,
    	changePass: changePass
    };
}).service('graphService', function($q, $http, URL, $filter) {
    var getCircleDataEstimatedEffort = function(authTokenForLogin , refineData, userData, params) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/'+refineData.selectProgram+'/effort/estimated/total',
                method: 'GET',
                params: params,
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json',
                    'fromDate': $filter('date')(refineData.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'toDate': $filter('date')(refineData.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'interval': refineData.interval+'w'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var getCircleDataRemainingEffort = function(authTokenForLogin, refineData, userData, params) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/'+refineData.selectProgram+'/effort/remaining/total',
                method: 'GET',
                params: params,
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json',
                    'fromDate': $filter('date')(refineData.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'toDate': $filter('date')(refineData.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'interval': refineData.interval+'w'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var getCircleDataSpentEffort = function(authTokenForLogin ,refineData, userData, params) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/'+refineData.selectProgram+'/effort/spent/total',
                method: 'GET',
                params:  params,
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json',
                    'fromDate': $filter('date')(refineData.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'toDate': $filter('date')(refineData.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'interval': refineData.interval+'w'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var getBurndown = function(authTokenForLogin ,refineData, userData, params) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/'+refineData.selectProgram+'/effort/burndown',
                method: 'GET',
                params: params,
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json',
                    'fromDate': $filter('date')(refineData.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'toDate': $filter('date')(refineData.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'interval': refineData.interval+'w'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var getSpentEffortHistogram = function(authTokenForLogin ,refineData, userData, params) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/'+refineData.selectProgram+'/effort/spent/dateHistogram',
                method: 'GET',
                params: params,
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json',
                    'fromDate': $filter('date')(refineData.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'toDate': $filter('date')(refineData.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'interval': refineData.interval+'w'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var getproductivityHistogramCanvas = function(authTokenForLogin ,refineData, userData, params) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/'+refineData.selectProgram+'/productivity/dateHistogram',
                method: 'GET',
                params: params,
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json',
                    'fromDate': $filter('date')(refineData.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'toDate': $filter('date')(refineData.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'interval': refineData.interval+'w'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var getQualityHistogram = function(authTokenForLogin ,refineData, userData, params) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/'+refineData.selectProgram+'/quality/dateHistogram',
                method: 'GET',
                params: params,
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json',
                    'fromDate': $filter('date')(refineData.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'toDate': $filter('date')(refineData.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'interval': refineData.interval+'w'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var getTeamHistogram = function(authTokenForLogin ,refineData, userData, params) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/'+refineData.selectProgram+'/team/dateHistogram',
                method: 'GET',
                params: params,
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json',
                    'fromDate': $filter('date')(refineData.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'toDate': $filter('date')(refineData.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'interval': refineData.interval+'w'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };

    var getProjectProductivity = function(authTokenForLogin ,refineData, userData, params) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/'+refineData.selectProgram+'/productivity/stats',
                method: 'GET',
                params: params,
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json',
                    'fromDate': $filter('date')(refineData.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'toDate': $filter('date')(refineData.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'interval': refineData.interval+'w'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var getProjectQuality = function(authTokenForLogin ,refineData, userData, params) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/'+refineData.selectProgram+'/quality/stats',
                method: 'GET',
                params: params,
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json',
                    'fromDate': $filter('date')(refineData.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'toDate': $filter('date')(refineData.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'interval': refineData.interval+'w'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var getProjectSpentEfforts = function(authTokenForLogin ,refineData, userData, params) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/'+refineData.selectProgram+'/effort/spent/stats',
                method: 'GET',
                params: params,
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json',
                    'fromDate': $filter('date')(refineData.startDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'toDate': $filter('date')(refineData.endDate, "yyyy-MM-dd" + "T00:00:00.000+0530"),
                    'interval': refineData.interval+'w'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };

    return {
    	getCircleDataEstimatedEffort: getCircleDataEstimatedEffort,
    	getCircleDataRemainingEffort: getCircleDataRemainingEffort,
    	getCircleDataSpentEffort: getCircleDataSpentEffort,
        getBurndown: getBurndown,
        getSpentEffortHistogram: getSpentEffortHistogram,
        getproductivityHistogramCanvas: getproductivityHistogramCanvas,
        getQualityHistogram: getQualityHistogram,
        getTeamHistogram: getTeamHistogram,
        getProjectProductivity: getProjectProductivity,
        getProjectQuality: getProjectQuality,
        getProjectSpentEfforts: getProjectSpentEfforts

    };
}).service('programService', function($q, $http, URL) {
    var getAllProgram = function(authTokenForLogin,userData) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/programs',
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var getAllProjects = function(programId, authTokenForLogin, userData) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/' + programId + '/projects',
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json'
                }
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var saveProjectSnapshot = function(selectProgram,data, authTokenForLogin, userData) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.account+'/' + selectProgram + '/' + data.project.id + '/projectsnapshot',
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + authTokenForLogin,
                    'Content-Type': 'application/json'
                },
                data: data
            }
            $http(req).then(function(data) {
                if (data.status === 200) {
                    resolve(data.data.response);
                } else {
                    reject('Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    return {
        getAllProgram: getAllProgram,
        getAllProjects: getAllProjects,
        saveProjectSnapshot: saveProjectSnapshot
    };
});