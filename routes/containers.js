var express = require('express');
var router = express.Router();
var shell = require('shelljs');
var request = require('request');
var credentials = require('../config');
/* Deploy container. */


/**
 * @api {post} containers/deploy/:user/:image_tag/:port_number Deploy a container based on a pre-existing image
 * @apiName DeployContainer
 * @apiGroup Developers
 *
 * @apiParam {String} user The username of the container owner.
 * @apiParam {String} image_tag The name of the image which will be used in container creation process.
 * @apiParam {Number} port_number The number of the port to be exposed for the application.
 *
 * @apiSuccess {String} routerStatus Success
 * @apiSuccess {String} containerId The <code>id</code> of the container created.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *          "containerId": "33c23dd5af51785affe61493ce66fa501b697b9850e86e7b01eaaa3751946708"
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message The failed request
 *
 */

router.post('/deploy/:user/:image_tag/:port_number', function(req, res, next) {
    
    var request = "./scripts/execute_commands.sh 'deploy_container' " + req.params.user + " " + req.params.port_number + " " + req.params.image_tag;
    var output = shell.exec(request);
    
    info = output.split('\n');
    if (info.length == 3){

        res.json({ routerStatus: "Success", containerId: info[0] });
    }
    else{
        
        res.statusCode = 400;
        res.json({ routerStatus: "Failure", message: "Request: " + request });
    }
    
});

/**
 * @api {post} containers/start/:container_id Start a container
 * @apiName StartContainer
 * @apiGroup Developers
 *
 * @apiParam {String} container_id The container <code>id</code>
 *
 * @apiSuccess {String} routerStatus Success
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message The failed request
 *
 */

router.post('/start/:container_id', function(req, res, next) {
    
    var request = "./scripts/execute_commands.sh 'start_container' " + req.params.container_id;
    var output = shell.exec(request);
    
    info = output.split('\n');
    
    if (info.length == 3){
        
        res.json({ routerStatus: "Success" });
    }
    else{
        
        res.statusCode = 400;
        res.json({ routerStatus: "Failure", message: "Request: " + request });
    }
    
});

/**
 * @api {post} containers/stop/:container_id Stop a container
 * @apiName StopContainer
 * @apiGroup Developers
 *
 * @apiParam {String} container_id The container <code>id</code>
 *
 * @apiSuccess {String} routerStatus Success
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message The failed request
 *
 */

router.post('/stop/:container_id', function(req, res, next) {
    
    var request = "./scripts/execute_commands.sh 'stop_container' " + req.params.container_id;
    var output = shell.exec(request);
    
    info = output.split('\n');
    
    if (info.length == 3){
        
        res.json({ routerStatus: "Success" });
    }
    else{
        
        res.statusCode = 400;
        res.json({ routerStatus: "Failure", message: "Request: " + request });
    }
    
});

/**
 * @api {post} containers/initialize/:user/:container_id Initialize a container's workspace.
 * @apiName InitializeContainer
 * @apiGroup Developers
 *
 * @apiParam {String} user The username of the container owner.
 * @apiParam {String} container_id The container <code>id</code>.
 *
 * @apiSuccess {String} routerStatus Success
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message The failed request
 *
 */

router.post('/initialize/:user/:container_id', function(req, res, next) {
    
    var request = "./scripts/execute_commands.sh 'create_workspace' " + req.params.container_id + " " + req.params.user;
    var output = shell.exec(request);
    
    info = output.split('\n');
    
    if (info[0] == 0){
        
        res.json({ routerStatus: "Success" });
    }
    else{
        
        res.statusCode = 400;
        res.json({ routerStatus: "Failure", message: "Request: " + request });
    }
    
});

/**
 * @api {post} containers/sync/:container_id/:repo_id Syncronize a container's workspace with a git repository.
 * @apiName SyncContainer
 * @apiGroup Developers
 *
 * @apiParam {String} container_id The container <code>id</code>.
 * @apiParam {Number} repo_id The <code>id</code> of the project from the local git repository.
 *
 * @apiSuccess {String} routerStatus Success
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message The failed request
 *
 */

router.post('/sync/:container_id/:repo_id', function(req, res, next) {
    
    
    request.post({
        url: 'http://localhost:3000/repos/project/info',
        form: {
            project_id: req.params.repo_id
        }
    }, function(error, response, body){
        
        if (error){
            res.json({ routerStatus: "Failure", message: "Internal Error" });
        }
        else{
            data = JSON.parse(body);
            
            var url = data["info"]["http_url_to_repo"].replace('http://localhost:10081', credentials.gitlab_url);
            url = url.replace('http://', 'http://gitlab-ci-token:' + data["info"]["runners_token"] + '@')
            var request = "./scripts/execute_commands.sh 'sync' " + req.params.container_id + " " + data["info"]["owner"]["username"] + " " + url;
            var output = shell.exec(request);
            
            //var output = shell.exec(request);
            res.json(output);
        }
        
    });
    
    /*
    var request = "./scripts/execute_commands.sh 'create_workspace' " + req.params.container_id + " " + req.params.user;
    var output = shell.exec(request);
    
    info = output.split('\n');
    
    if (info[0] == 0){
        
        res.json({ routerStatus: "Success" });
    }
    else{
        
        res.statusCode = 400;
        res.json({ routerStatus: "Failure", message: "Request: " + request });
    }*/
    
});

/**
 * @api {post} containers/isActive/:container_id Check whether a container is running.
 * @apiName ContainerIsActive
 * @apiGroup Developers
 *
 * @apiParam {String} container_id The container <code>id</code>.
 *
 * @apiSuccess {String} routerStatus Success
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *          "isActive": "true"
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message The failed request
 *
 */

router.post('/isActive/:container_id', function(req, res, next) {
    
    var request = "./scripts/execute_commands.sh 'check_if_active' " + req.params.container_id;
    var output = shell.exec(request);
    
    info = output.split('\n');
    
    if (info[1] == 0){
        
        res.json({ routerStatus: "Success" , isActive: info[0]});
    }
    else{
        
        res.statusCode = 400;
        res.json({ routerStatus: "Failure", message: "Request: " + request });
    }
    
});


module.exports = router;
