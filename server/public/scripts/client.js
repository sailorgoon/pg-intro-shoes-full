console.log('client.js has been loaded');

var app = angular.module('ShoeApp', []);

app.controller('ShoeController', ['$http', function ($http) {  //putting in brackets added a dependency
    console.log('ShoeController has been loaded');
    var self = this;
    self.message = 'Hey';
    self.newShoe = {
        name: '',
        cost: ''
    }
    self.getAllShoes = function(){
        $http({
            method: 'GET',
            url: '/shoe'    
        })
            .then(function (response) {
                console.log(response);
                self.shoes = response.data;
            })
            .catch(function (error) {
                console.log('error on /shoe GET', error);
            })
    }

    self.addShoe = function(){ //?
        $http({
            method: 'POST',
            url: '/shoe',
            data: self.newShoe
        })
        .then(function(response){
            console.log(response);
            self.getAllShoes();
        })
        .catch(function(error){
            console.log('error on /shoe POST', error);
        })
    
};

self.deleteShoe = function (deleteShoe) {
    let confirmStatus = confirm('Are you sure?');
    if (confirmStatus) {
        $http({
            method: 'DELETE',
            url: '/shoe',
            params: deleteShoe
        })
            .then(function (response) {
                self.getAllShoes();
                console.log('response from delete', response);
            })
            .catch(function (error) {
                console.log('error on DELETE', error);
            });
    }
    else {
        console.log('delete cancelled');
    }
    
}

self.updateShoe = function (updateShoe) {
    $http({
        method: 'PUT',
        url: '/shoe',
        data: updateShoe
    })
    .then(function(response){
        self.getAllShoes();
        console.log('response from update', response);
    })
    .catch(function (error){
        console.log('error on update', error);
    })
}

self.getAllShoes();

}])