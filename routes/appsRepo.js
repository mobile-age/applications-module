var express = require('express');
var router = express.Router();
var credentials = require('../config');
var request = require('request');


/**
 * @api {post} repos/users List the registered users into the local repository.
 * @apiName ListUsers
 * @apiGroup Users
 *
 * @apiParam {String} token The token used for administrator privileges in local repository.
 *
 * @apiSuccess {String} routerStatus Success
 * @apiSuccess {String} info Information of the users.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *          "info": {
 *            "name": "developer_1",
 *            "username": "dev_1",
 *            "id": 2,
 *            "state": "active",
 *            "avatar_url": "http://www.gravatar.com/avatar/316a94c9e95ff8704325b0a7de2785f3?s=80&d=identicon",
 *            "web_url": "http://repos.mobileage/u/developer_1",
 *            "created_at": "2016-09-15T11:27:08.010Z",
 *            "is_admin": false,
 *            "bio": null,
 *            "location": null,
 *            "skype": "",
 *            "linkedin": "",
 *            "twitter": "",
 *            "website_url": "",
 *            "last_sign_in_at": "2016-09-15T11:27:08.055Z",
 *            "confirmed_at": "2016-09-15T11:27:08.012Z",
 *            "email": "developer@gmail.com",
 *            "theme_id": 2,
 *            "color_scheme_id": 1,
 *            "projects_limit": 100,
 *            "current_sign_in_at": "2016-09-15T11:27:08.055Z",
 *            "identities": [],
 *            "can_create_group": true,
 *            "can_create_project": true,
 *            "two_factor_enabled": false,
 *            "external": false
 *          }
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message Information regarding the origin of failure (e.g. Internal error)
 *
 */

router.post('/users', function(req, res, next) {

    request.get({

        url: credentials.gitlab_url + '/api/v3/users',
        headers: {
            'PRIVATE-TOKEN': credentials.token
        },

    },function(error, response, body){

        if (error){
            res.json({routerStatus:'Failure', routerMessage: 'Cannot communicate with local repositories'});
        }
        else{
            try{
                data = JSON.parse(body);
                res.json({routerStatus: "Success", info: data});
            }
            catch (e) {

                res.json({routerStatus: "Failure", routerMessage: "Internal error"});
            }
        }
    });
});


/**
 * @api {post} repos/projects List all the projects of the local repository.
 * @apiName ListProjects
 * @apiGroup Applications
 *
 * @apiParam {String} token The token used for administrator privileges in local repository.
 *
 * @apiSuccess {String} routerStatus Success
 * @apiSuccess {String} info Information of the projects.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *          "info": {
 *              "id": 4,
 *              "description": null,
 *              "default_branch": null,
 *              "tag_list": [],
 *              "public": false,
 *              "archived": false,
 *              "visibility_level": 0,
 *              "ssh_url_to_repo": "ssh://git@git.repos.mobileage/dev_1/myEvents.git",
 *              "http_url_to_repo": "http://repos.mobileage/dev_1/myEvents.git",
 *              "web_url": "http://repos.mobileage/dev_1/myEvents",
 *              "owner": {
 *                  "name": "developer_1",
 *                  "username": "dev_1",
 *                  "id": 3,
 *                  "state": "active",
 *                  "avatar_url": "http://www.gravatar.com/avatar/75f7b0e924085da9c3b433c5631cd26b?s=80&d=identicon",
 *                  "web_url": "http://repos.mobileage/u/dev_1"
 *                },
 *              "name": "myEvents",
 *              "name_with_namespace": "dev_1 / myEvents",
 *              "path": "myEvents",
 *              "path_with_namespace": "dev_1/myEvents",
 *              "issues_enabled": true,
 *              "merge_requests_enabled": true,
 *              "wiki_enabled": true,
 *              "builds_enabled": true,
 *              "snippets_enabled": false,
 *              "container_registry_enabled": true,
 *              "created_at": "2016-09-27T10:05:55.742Z",
 *              "last_activity_at": "2016-09-27T10:05:59.221Z",
 *              "shared_runners_enabled": true,
 *              "creator_id": 3,
 *              "namespace": {
 *                  "id": 4,
 *                  "name": "myEvents",
 *                  "path": "myEvents",
 *                  "owner_id": 3,
 *                  "created_at": "2016-09-22T12:31:10.563Z",
 *                  "updated_at": "2016-09-22T12:31:10.563Z",
 *                  "description": "",
 *                  "avatar": null,
 *                  "share_with_group_lock": false,
 *                  "visibility_level": 20,
 *                  "request_access_enabled": true,
 *                  "deleted_at": null
 *              },
 *              "avatar_url": null,
 *              "star_count": 0,
 *              "forks_count": 0,
 *              "open_issues_count": 0,
 *              "public_builds": true,
 *              "shared_with_groups": [],
 *              "permissions": {
 *              "project_access": null,
 *              "group_access": null
 *              }
 *          }
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message Information regarding the origin of failure (e.g. Internal error)
 *
 */

router.post('/projects', function(req, res, next) {

    request.get({

        url: credentials.gitlab_url + '/api/v3/projects/all',
        headers: {
            'PRIVATE-TOKEN': credentials.token
        }
    },function(error, response, body){

        if (error){
            res.json({routerStatus:'Failure', routerMessage: 'Cannot communicate with local repositories'});
        }
        else{
            try{
                data = JSON.parse(body);
                res.json({routerStatus: "Success", info: data});
            }
            catch (e) {
                res.json({routerStatus: "Failure", routerMessage: "Internal error"});
            }
        }
    });
});

/**
 * @api {post} repos/users/create Create a new user.
 * @apiName AddNewUser
 * @apiGroup Users
 *
 * @apiParam {String} token The token used for administrator privileges in local repository.
 * @apiParam {String} name The name of the user to be added.
 * @apiParam {String} username The username of the user to be added.
 * @apiParam {String} password The password of the user to be added.
 * @apiParam {String} email The email of the user to be added
 *
 * @apiSuccess {String} routerStatus Success
 * @apiSuccess {String} info Information of the users.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *          "info": {
 *            "name": "developer_1",
 *            "username": "dev_1",
 *            "id": 2,
 *            "state": "active",
 *            "avatar_url": "http://www.gravatar.com/avatar/316a94c9e95ff8704325b0a7de2785f3?s=80&d=identicon",
 *            "web_url": "http://repos.mobileage/u/developer_1",
 *            "created_at": "2016-09-15T11:27:08.010Z",
 *            "is_admin": false,
 *            "bio": null,
 *            "location": null,
 *            "skype": "",
 *            "linkedin": "",
 *            "twitter": "",
 *            "website_url": "",
 *            "last_sign_in_at": "2016-09-15T11:27:08.055Z",
 *            "confirmed_at": "2016-09-15T11:27:08.012Z",
 *            "email": "developer@gmail.com",
 *            "theme_id": 2,
 *            "color_scheme_id": 1,
 *            "projects_limit": 100,
 *            "current_sign_in_at": "2016-09-15T11:27:08.055Z",
 *            "identities": [],
 *            "can_create_group": true,
 *            "can_create_project": true,
 *            "two_factor_enabled": false,
 *            "external": false
 *          }
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message Information regarding the origin of failure (e.g. Internal error)
 *
 */


router.post('/users/create', function(req, res, next) {
    console.log(req.body.name);
    request.post({

        url: credentials.gitlab_url + '/api/v3/users',
        headers: {
            'PRIVATE-TOKEN': credentials.token
        },
        form: {
            'name': req.body.name,
            'username': req.body.username,
            'password': req.body.password,
            'email': req.body.email
        }

    },function(error, response, body){

        if (error){
            res.json({routerStatus:'Failure', routerMessage: 'Cannot communicate with local repositories'});
        }
        else{
            try{
                data = JSON.parse(body);

                if (data.hasOwnProperty("message")){
                    res.json({routerStatus: "Failure", routerMessage: data});
                }
                else{
                    res.json({routerStatus: "Success", info: data});
                }
            }
            catch (e) {
                res.json({routerStatus: "Failure", routerMessage: "Internal error"});
            }
        }
    });
});



router.post('/users/username', function(req, res, next) {

    request.get({

        url: credentials.gitlab_url + '/api/v3/users?username=' + req.body.username,
        headers: {
            'PRIVATE-TOKEN': credentials.token
        }

    },function(error, response, body){

        if (error){
            res.json({routerStatus:'Failure', routerMessage: 'Cannot communicate with local repositories'});
        }
        else{
            try{
                data = JSON.parse(body);
                res.json({routerStatus: "Success", info: data});
            }
            catch (e) {
                res.json({routerStatus: "Failure", routerMessage: "Internal error"});
            }
        }
    });
});

router.post('/project/create', function(req, res, next) {


    var send = {};

    request.post({

        url: credentials.gitlab_url + '/api/v3/projects/user/' + req.body.user_id,
        headers: {
            'PRIVATE-TOKEN': credentials.token
        },
        form: {
            'name': req.body.name
        }
    },function(error, response, body){

        if (error){
            res.json({routerStatus:"Failure", routerMessage: "Cannot communicate with local repositories"});
        }
        else{
            try{

                data = JSON.parse(body);

                if (data.hasOwnProperty("message")){
                    res.json({routerStatus: "Failure", info: data});
                }
                else{
                    res.json({routerStatus: "Success", info: data});
                }
            }
            catch (e) {
                res.json({routerStatus: "Failure", routerMessage: "Internal error"});
            }
        }
    });
});

router.post('/project/info', function(req, res, next) {

    request.get({

        url: credentials.gitlab_url + '/api/v3/projects/' + req.body.project_id,
        headers: {
            'PRIVATE-TOKEN': credentials.token
        }
    },function(error, response, body){

        if (error){
            res.json({routerStatus:'Failure', routerMessage: 'Cannot communicate with local repositories'});
        }
        else{
            try{
                data = JSON.parse(body);
                res.json({routerStatus: "Success", info: data});
            }
            catch (e) {
                res.json({routerStatus: "Failure", routerMessage: "Internal error"});
            }
        }
    });
});


module.exports = router;
