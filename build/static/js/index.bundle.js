/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		0: 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([102,1]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 101:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(6);
var react_dom_default = /*#__PURE__*/__webpack_require__.n(react_dom);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(7);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(8);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js + 1 modules
var possibleConstructorReturn = __webpack_require__(11);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
var getPrototypeOf = __webpack_require__(9);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js + 1 modules
var inherits = __webpack_require__(10);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
var assertThisInitialized = __webpack_require__(2);

// EXTERNAL MODULE: ./src/pages/App.css
var pages_App = __webpack_require__(67);

// CONCATENATED MODULE: ./src/enum/pages.js
var pages={PLAYLISTS:'playlists',SPOTIFYCONFIGURATION:'spotifyconfiguration'};/* harmony default export */ var enum_pages = (pages);
// CONCATENATED MODULE: ./src/components/DefaultLayout.js
var DefaultLayout_DefaultLayout=/*#__PURE__*/function(_React$Component){Object(inherits["a" /* default */])(DefaultLayout,_React$Component);function DefaultLayout(props){var _this;Object(classCallCheck["a" /* default */])(this,DefaultLayout);_this=Object(possibleConstructorReturn["a" /* default */])(this,Object(getPrototypeOf["a" /* default */])(DefaultLayout).call(this,props));_this.state={height:"50px"};_this.logOutApplication=_this.logOutApplication.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));_this.resize=_this.resize.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));return _this;}Object(createClass["a" /* default */])(DefaultLayout,[{key:"componentDidMount",value:function componentDidMount(){window.addEventListener('resize',this.resize);this.resize();}},{key:"resize",value:function resize(){if(window.innerWidth<768){var headerTopNavHeight=this.headerTopNav.clientHeight;var headerHeight=this.headerElement.clientHeight;this.setState({topNavHeight:headerTopNavHeight+10+"px",headerHeight:headerHeight+headerTopNavHeight+10});}else{var _headerHeight=this.headerElement.clientHeight;this.setState({headerHeight:_headerHeight+"px",topNavHeight:0/*, contentHeight: window.innerHeight - headerHeight*/});}}},{key:"render",value:function render(){var _this2=this;return react_default.a.createElement("div",null,react_default.a.createElement("div",{className:"header",ref:function ref(headerElement){return _this2.headerElement=headerElement;},style:{marginTop:this.state.topNavHeight}},react_default.a.createElement("div",{className:"header-title"},react_default.a.createElement("h1",null,"My Playlist of Playlists App"),react_default.a.createElement("p",null,"Create playlist that automatically updates with other playlists' songs.")),react_default.a.createElement("div",{className:"header-topnav",ref:function ref(headerTopNav){return _this2.headerTopNav=headerTopNav;}},react_default.a.createElement("div",{className:"header-topnav-buttons"},react_default.a.createElement("div",null,react_default.a.createElement("a",{href:"#",className:this.setClassName(enum_pages.PLAYLISTS),onClick:function onClick(){return _this2.props.onChange(enum_pages.PLAYLISTS);}},"Go To My Playlists"),this.props.isSpotifyUserLogged?react_default.a.createElement("a",{href:"#",onClick:this.logOutApplication},"Logout"):undefined,react_default.a.createElement("a",{href:"#",className:this.setClassName(enum_pages.SPOTIFYCONFIGURATION),onClick:function onClick(){return _this2.props.onChange(enum_pages.SPOTIFYCONFIGURATION);}},"Configure Spotify Account"))))),react_default.a.createElement("div",{style:{top:this.state.headerHeight/*, height: this.state.contentHeight*/},ref:function ref(contentElement){return _this2.contentElement=contentElement;},className:"content"},react_default.a.createElement("div",{className:"content-view-port"},this.props.children)),react_default.a.createElement("div",{className:"footer"},react_default.a.createElement("p",null,"Recommend to your friends ;)")));}},{key:"setClassName",value:function setClassName(page){if(page===this.props.actualPage){return"selected";}}},{key:"logOutApplication",value:function logOutApplication(){window.location.replace("/logout");}}]);return DefaultLayout;}(react_default.a.Component);/* harmony default export */ var components_DefaultLayout = (DefaultLayout_DefaultLayout);
// CONCATENATED MODULE: ./src/components/common/AlertDismissable.js
var Alert=__webpack_require__(21).Alert;var Button=__webpack_require__(21).Button;var AlertDismissable_AlertDismissable=/*#__PURE__*/function(_React$Component){Object(inherits["a" /* default */])(AlertDismissable,_React$Component);function AlertDismissable(props){var _this;Object(classCallCheck["a" /* default */])(this,AlertDismissable);_this=Object(possibleConstructorReturn["a" /* default */])(this,Object(getPrototypeOf["a" /* default */])(AlertDismissable).call(this,props));_this.handleHide=function(){_this.props.resetAlert();};_this.state={alert:_this.props.alert};return _this;}Object(createClass["a" /* default */])(AlertDismissable,[{key:"componentWillReceiveProps",value:function componentWillReceiveProps(nextProps){if(this.props.showLoadingModal===true&&nextProps.showLoadingModal===true){this.state={alert:{error:{},message:{}}};}else{this.state={alert:this.props.alert};}// if(nextProps.alert.error.toShow === false && nextProps.alert.message.toShow === false){
//     this.setState({alert: nextProps.alert});
// } else if(){
//     this.setState({alert: nextProps.alert});
// }
}},{key:"render",value:function render(){return react_default.a.createElement(react_default.a.Fragment,null,this.state.alert.error.toShow&&react_default.a.createElement("div",{className:"alert-dismisable-container"},react_default.a.createElement(Alert,{show:this.state.show,variant:"danger"},react_default.a.createElement(Alert.Heading,null,"Oops! We found an error"),react_default.a.createElement("p",null,this.state.alert.error.text),react_default.a.createElement("hr",null),react_default.a.createElement("div",{className:"d-flex justify-content-end"},react_default.a.createElement(Button,{onClick:this.handleHide,variant:"outline-danger"},"Close :\xB4(")))),this.state.alert.message.toShow&&react_default.a.createElement("div",{className:"alert-dismisable-container"},react_default.a.createElement(Alert,{show:this.state.show,variant:"success"},react_default.a.createElement(Alert.Heading,null,"Hey you!"),react_default.a.createElement("p",null,this.state.alert.message.text),react_default.a.createElement("hr",null),react_default.a.createElement("div",{className:"d-flex justify-content-end"},react_default.a.createElement(Button,{onClick:this.handleHide,variant:"outline-success"},"Close :)")))));}}]);return AlertDismissable;}(react_default.a.Component);/* harmony default export */ var common_AlertDismissable = (AlertDismissable_AlertDismissable);
// CONCATENATED MODULE: ./src/components/PlaylistPageComponents/PlaylistItem.js
var React=__webpack_require__(0);var PlaylistItem_PlaylistItem=/*#__PURE__*/function(_React$Component){Object(inherits["a" /* default */])(PlaylistItem,_React$Component);function PlaylistItem(){Object(classCallCheck["a" /* default */])(this,PlaylistItem);return Object(possibleConstructorReturn["a" /* default */])(this,Object(getPrototypeOf["a" /* default */])(PlaylistItem).apply(this,arguments));}Object(createClass["a" /* default */])(PlaylistItem,[{key:"render",value:function render(){var _this=this;return React.createElement("tr",{id:this.props.playlist.id,className:this.props.isSelected?"playlist-list-item-row selected":"playlist-list-item-row",onClick:function onClick(){return _this.props.clickAction(_this.props.playlist);}},React.createElement("td",{className:"playlist-list-item-image-column"},React.createElement("img",{className:"playlist-list-item-image-image",alt:"",src:this.props.playlist.images[2]?this.props.playlist.images[2].url:"/noplaylistimage.png"})),React.createElement("td",{className:this.props.isSelected?"playlist-list-item-name-column selected":"playlist-list-item-name-column"},React.createElement("strong",null,this.props.playlist.name),React.createElement("br",null),"Number of tracks: ",this.props.playlist.tracks.total),!this.props.isConfiguredPlaylist?React.createElement("td",{className:"playlist-list-item-checkbox-column"},React.createElement("div",{className:"playlist-list-item-checkbox-div"},React.createElement("label",null,React.createElement("input",{type:"checkbox",name:"notify-product-news:email",value:"1",checked:"checked",onChange:function onChange(){return _this.props.clickAction(_this.props.playlist);},className:"playlist-list-item-checkbox-input-checkbox"}),React.createElement("span",{className:this.props.playlist.selected?"playlist-list-item-checkbox-span checked":"playlist-list-item-checkbox-span"})))):undefined);}}]);return PlaylistItem;}(React.Component);/* harmony default export */ var PlaylistPageComponents_PlaylistItem = (PlaylistItem_PlaylistItem);
// CONCATENATED MODULE: ./src/components/PlaylistPageComponents/PlaylistPageList.js
var PlaylistPageList_PlaylistPageList=/*#__PURE__*/function(_React$Component){Object(inherits["a" /* default */])(PlaylistPageList,_React$Component);function PlaylistPageList(props){var _this;Object(classCallCheck["a" /* default */])(this,PlaylistPageList);_this=Object(possibleConstructorReturn["a" /* default */])(this,Object(getPrototypeOf["a" /* default */])(PlaylistPageList).call(this,props));_this.state={selectedConfiguredPlaylist:''};return _this;}Object(createClass["a" /* default */])(PlaylistPageList,[{key:"componentWillReceiveProps",value:function componentWillReceiveProps(nextProps){if(nextProps.selectedConfiguredPlaylist!==this.props.selectedConfiguredPlaylist)this.setState({selectedConfiguredPlaylist:nextProps.selectedConfiguredPlaylist});}},{key:"render",value:function render(){var _this2=this;return react_default.a.createElement("section",{className:"playlist-list-section"},react_default.a.createElement("div",{className:"playlist-list-title-div"},react_default.a.createElement("h1",{className:"playlist-list-title-text"},this.props.playlistPageTitle),react_default.a.createElement("div",{className:"playlist-list-button-div"},this.props.playlistPageButton)),react_default.a.createElement("div",{className:"playlist-list-div"},react_default.a.createElement("table",{className:"playlist-list-div-table"},react_default.a.createElement("tbody",{className:"playlist-list-div-table-tbody"},this.props.playlistsToShow?this.props.isConfiguredPlaylist&&this.props.playlistsToShow.length===0?react_default.a.createElement("h1",{className:"playlist-list-title-text"},react_default.a.createElement("br",null),"You do not have configured playlists. Start by Clicking on Create New Playlist ;)"):this.props.playlistsToShow.map(function(playlist){return react_default.a.createElement(PlaylistPageComponents_PlaylistItem,_this2.getPlaylistItemConfiguration(playlist));}).reduce(function(prev,curr){return[prev,' ',curr];},''):undefined))));}},{key:"getPlaylistItemConfiguration",value:function getPlaylistItemConfiguration(playlist){var _this3=this;return{isConfiguredPlaylist:this.props.isConfiguredPlaylist,isSelected:playlist.id===this.state.selectedConfiguredPlaylist.id?true:false,playlist:playlist,clickAction:function clickAction(playlist){return _this3.props.itemActionOnClick(playlist);}};}}]);return PlaylistPageList;}(react_default.a.Component);/* harmony default export */ var PlaylistPageComponents_PlaylistPageList = (PlaylistPageList_PlaylistPageList);
// EXTERNAL MODULE: ./src/components/PlaylistPageComponents/NewPlaylistDialog.css
var PlaylistPageComponents_NewPlaylistDialog = __webpack_require__(94);

// CONCATENATED MODULE: ./src/components/PlaylistPageComponents/NewPlaylistDialog.js
var NewPlaylistDialog_React=__webpack_require__(0);var ButtonToolbar=__webpack_require__(21).ButtonToolbar;var NewPlaylistDialog_Button=__webpack_require__(21).Button;var Modal=__webpack_require__(21).Modal;var NewPlaylistDialog_NewPlaylistDialog=/*#__PURE__*/function(_React$Component){Object(inherits["a" /* default */])(NewPlaylistDialog,_React$Component);function NewPlaylistDialog(props,context){var _this;Object(classCallCheck["a" /* default */])(this,NewPlaylistDialog);_this=Object(possibleConstructorReturn["a" /* default */])(this,Object(getPrototypeOf["a" /* default */])(NewPlaylistDialog).call(this,props,context));_this.lgClose=function(){return _this.setState({lgShow:false,name:''});};_this.state={lgShow:false,name:''};_this.handleNameChange=_this.handleNameChange.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));_this.handleClick=_this.handleClick.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));return _this;}Object(createClass["a" /* default */])(NewPlaylistDialog,[{key:"handleClick",value:function handleClick(){this.lgClose();this.props.action(this.state.name);}},{key:"handleNameChange",value:function handleNameChange(event){this.setState({name:event.target.value});}},{key:"render",value:function render(){var _this2=this;return NewPlaylistDialog_React.createElement(ButtonToolbar,null,NewPlaylistDialog_React.createElement(NewPlaylistDialog_Button,{className:"playlist-list-button-div-button",onClick:function onClick(){return _this2.setState({lgShow:true});}},"Create New Playlist"),NewPlaylistDialog_React.createElement(Modal,{size:"lg",show:this.state.lgShow,onHide:this.lgClose},NewPlaylistDialog_React.createElement("div",{className:"modal-div"},NewPlaylistDialog_React.createElement("h3",{className:"modal-div-title"},"Create New Playlist"),NewPlaylistDialog_React.createElement("form",{className:"modal-div-form"},NewPlaylistDialog_React.createElement("div",{className:"modal-div-form-item-group"},NewPlaylistDialog_React.createElement("div",{className:"input-group mb-3"},NewPlaylistDialog_React.createElement("div",{className:"input-group-prepend"},NewPlaylistDialog_React.createElement("span",{className:"input-group-text modal-div-form-item-group-input",id:"basic-addon1"},"Playlist Name")),NewPlaylistDialog_React.createElement("input",{type:"text",className:"form-control","aria-describedby":"basic-addon1",value:this.state.name,onChange:this.handleNameChange}))),NewPlaylistDialog_React.createElement("div",{className:"modal-div-form-item-group button-item-group"},NewPlaylistDialog_React.createElement(NewPlaylistDialog_Button,{className:"playlist-add-playlist-cancel-button",onClick:this.lgClose},"Close"),NewPlaylistDialog_React.createElement(NewPlaylistDialog_Button,{className:"playlist-add-playlist-create-button",onClick:this.handleClick},"Create New Playlist"))))));}}]);return NewPlaylistDialog;}(NewPlaylistDialog_React.Component);/* harmony default export */ var components_PlaylistPageComponents_NewPlaylistDialog = (NewPlaylistDialog_NewPlaylistDialog);
// EXTERNAL MODULE: ./src/components/AppPages/PlaylistPage.css
var PlaylistPage = __webpack_require__(95);

// EXTERNAL MODULE: ./node_modules/lodash/lodash.js
var lodash = __webpack_require__(45);
var lodash_default = /*#__PURE__*/__webpack_require__.n(lodash);

// CONCATENATED MODULE: ./src/components/AppPages/PlaylistsPage.js
var PlaylistsPage_Button=__webpack_require__(21).Button;var PlaylistsPage_PlaylistsPage=/*#__PURE__*/function(_React$Component){Object(inherits["a" /* default */])(PlaylistsPage,_React$Component);function PlaylistsPage(props){var _this;Object(classCallCheck["a" /* default */])(this,PlaylistsPage);_this=Object(possibleConstructorReturn["a" /* default */])(this,Object(getPrototypeOf["a" /* default */])(PlaylistsPage).call(this,props));_this.state={userPlaylists:'',spotifyPlaylistsToBeShown:''};_this.getUserPlaylists=_this.getUserPlaylists.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));_this.createPlaylist=_this.createPlaylist.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));_this.savePlaylistsConfiguration=_this.savePlaylistsConfiguration.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));return _this;}Object(createClass["a" /* default */])(PlaylistsPage,[{key:"componentDidMount",value:function componentDidMount(){if(this.props.isSpotifyUserLogged)this.getUserPlaylists();}},{key:"componentWillReceiveProps",value:function componentWillReceiveProps(nextProps){if(nextProps.isSpotifyUserLogged!==this.props.isSpotifyUserLogged&&nextProps.isSpotifyUserLogged===true)this.getUserPlaylists();}},{key:"getUserPlaylists",value:function getUserPlaylists(){var _this2=this;this.props.showLoadingModal();fetch('/spotify/user/playlists',{method:'POST',headers:{"Content-Type":"application/json"}}).then(function(result){var state=_this2;if(result.ok){result.json().then(function(playlists){state.setState({userPlaylists:playlists});state.props.hideLoadingModal();});}else{result.json().then(function(error){state.props.handleResponse(error);state.props.hideLoadingModal();});}});}},{key:"render",value:function render(){return react_default.a.createElement("div",null,this.props.isSpotifyUserLogged?this.showAppPlaylistsApp():react_default.a.createElement("div",null,react_default.a.createElement("div",{className:"playlist-page-title-div"},react_default.a.createElement("h1",{className:"playlist-page-title-text"},"You're not logged to your Spotify account. Please go to Configure Spotify Account."))));}},{key:"showAppPlaylistsApp",value:function showAppPlaylistsApp(){return react_default.a.createElement("div",{className:"playlist-page-content"},react_default.a.createElement("div",{className:this.state.selectedConfiguredPlaylist?"playlist-page-configured-playlist":"playlist-page-configured-playlist playlist-page-configured-playlist-full-width"},react_default.a.createElement(PlaylistPageComponents_PlaylistPageList,this.prepareConfiguredPlaylistsList())),react_default.a.createElement("div",{className:this.state.selectedConfiguredPlaylist?"playlist-page-spotify-playlist":"playlist-page-spotify-playlist playlist-page-spotify-playlist-not-showed"},react_default.a.createElement(PlaylistPageComponents_PlaylistPageList,this.prepareSpotifyPlaylistsList())));}},{key:"prepareConfiguredPlaylistsList",value:function prepareConfiguredPlaylistsList(){var _this3=this;return{playlistPageTitle:"Your configured playlists",playlistPageButton:react_default.a.createElement(components_PlaylistPageComponents_NewPlaylistDialog,{title:"Insert new Playlist's name",action:this.createPlaylist}),isConfiguredPlaylist:true,playlistsToShow:this.state.userPlaylists.configuredPlaylists,selectedConfiguredPlaylist:this.state.selectedConfiguredPlaylist,itemActionOnClick:function itemActionOnClick(playlist){return _this3.updateSpotifyPlaylistsSelectedStatus(playlist);}};}},{key:"prepareSpotifyPlaylistsList",value:function prepareSpotifyPlaylistsList(){var _this4=this;return{playlistPageTitle:"Your spotify playlists",playlistPageButton:react_default.a.createElement(PlaylistsPage_Button,{className:"playlist-list-button-div-button",onClick:function onClick(playlist){return _this4.savePlaylistsConfiguration(playlist);}},"Save Changes"),isConfiguredPlaylist:false,playlistsToShow:this.state.spotifyPlaylistsToBeShown,itemActionOnClick:function itemActionOnClick(playlist){return _this4.changePlaylistChecked(playlist);}};}},{key:"updateSpotifyPlaylistsSelectedStatus",value:function updateSpotifyPlaylistsSelectedStatus(playlist){this.setState({selectedConfiguredPlaylist:playlist,spotifyPlaylistsToBeShown:this.state.userPlaylists.spotifyPlaylists.map(function(spotifyPlaylist){spotifyPlaylist.selected=lodash_default.a.find(playlist.includedPlaylists,{"playlistId":spotifyPlaylist.id})?true:false;return spotifyPlaylist;})});}},{key:"changePlaylistChecked",value:function changePlaylistChecked(playlist){lodash_default.a.find(this.state.spotifyPlaylistsToBeShown,{id:playlist.id}).selected=!playlist.selected;this.setState({spotifyPlaylistsToBeShown:this.state.spotifyPlaylistsToBeShown});}},{key:"createPlaylist",value:function createPlaylist(name){var _this5=this;this.props.showLoadingModal();fetch('/spotify/createplaylist',{method:'POST',headers:{'Content-Type':"application/json"},body:JSON.stringify({name:name}),redirect:'manual'}).then(function(result){var state=_this5;if(result.ok){_this5.getUserPlaylists();state.props.handleResponse({messageToShow:"Playlist Successfully created =D"});}else{result.json().then(function(error){state.props.handleResponse(error);state.props.hideLoadingModal();});}});}},{key:"savePlaylistsConfiguration",value:function savePlaylistsConfiguration(){var _this6=this;this.props.showLoadingModal();var playlistToUpdate=this.state.selectedConfiguredPlaylist;playlistToUpdate.includedPlaylists=[];this.state.spotifyPlaylistsToBeShown.filter(function(playlist){return playlist.selected;}).forEach(function(playlist){playlistToUpdate.includedPlaylists.push(playlist.id);});fetch('/updateplaylist',{method:'POST',headers:{'Content-Type':"application/json"},body:JSON.stringify({playlistToUpdate:playlistToUpdate})}).then(function(result){var state=_this6;if(result.ok){_this6.getUserPlaylists();state.props.handleResponse({messageToShow:"Playlist Successfully updated =D"});state.props.hideLoadingModal();}else{result.json().then(function(error){state.props.handleResponse(error);state.props.hideLoadingModal();});}// if (result.ok) {
//         console.log('success updatedplaylist');
//         alert('success updatedplaylist');
//         this.getUserPlaylists();
//     } else {
//         // isSpotifyLogged: false
//         result.json().then((error) => {
//             this.props.handleError(error, (error) => {
//                 if (error.errorType === "dbError") {
//                     alert("Internal errors occurred, Please try later. Error desc: " + error.errorMessage);
//                 } else if (error.errorType === "spotifyError") {
//                     alert("Changes were saved, but was not able to update Spotify playlsit, try saving later. Error desc: " + error.errorMessage);
//                 }
//             });
//         });
//     }
});console.log(playlistToUpdate);}}]);return PlaylistsPage;}(react_default.a.Component);/* harmony default export */ var AppPages_PlaylistsPage = (PlaylistsPage_PlaylistsPage);
// EXTERNAL MODULE: ./src/components/AppPages/ConfigurePage.css
var AppPages_ConfigurePage = __webpack_require__(97);

// EXTERNAL MODULE: ./node_modules/react-bootstrap/Button.js
var react_bootstrap_Button = __webpack_require__(46);
var Button_default = /*#__PURE__*/__webpack_require__.n(react_bootstrap_Button);

// CONCATENATED MODULE: ./src/components/AppPages/ConfigurePage.js
var ConfigurePage_ConfigurePage=/*#__PURE__*/function(_React$Component){Object(inherits["a" /* default */])(ConfigurePage,_React$Component);function ConfigurePage(){Object(classCallCheck["a" /* default */])(this,ConfigurePage);return Object(possibleConstructorReturn["a" /* default */])(this,Object(getPrototypeOf["a" /* default */])(ConfigurePage).apply(this,arguments));}Object(createClass["a" /* default */])(ConfigurePage,[{key:"render",value:function render(){return react_default.a.createElement("div",null,this.props.isSpotifyUserLogged?this.showUserLoggedInformation():react_default.a.createElement("div",{className:"button-div"},react_default.a.createElement(Button_default.a,{className:"configure-page-login-logout-button",onClick:this.logInToSpotify.bind(this)},"Log In To SPOTIFY")));}},{key:"showUserLoggedInformation",value:function showUserLoggedInformation(){return react_default.a.createElement("div",{className:"configure-page-content"},react_default.a.createElement("div",{className:"configure-page-user-logged-div"},react_default.a.createElement("h3",{className:"configure-page-user-logged-div-title"},"Profile"),react_default.a.createElement("form",{className:"configure-page-user-logged-div-form"},react_default.a.createElement("div",{className:"configure-page-user-logged-div-form-item-group"},react_default.a.createElement("label",{className:"configure-page-user-logged-div-form-item-group-title"},"Name"),react_default.a.createElement("p",{className:"configure-page-user-logged-div-form-item-group-value"},this.props.spotifyUserLoggedInfo.display_name)),react_default.a.createElement("div",{className:"configure-page-user-logged-div-form-item-group"},react_default.a.createElement("label",{className:"configure-page-user-logged-div-form-item-group-title"},"Country"),react_default.a.createElement("p",{className:"configure-page-user-logged-div-form-item-group-value"},this.props.spotifyUserLoggedInfo.country)),react_default.a.createElement("div",{className:"configure-page-user-logged-div-form-item-group"},react_default.a.createElement("label",{className:"configure-page-user-logged-div-form-item-group-title"},"Email"),react_default.a.createElement("p",{className:"configure-page-user-logged-div-form-item-group-value"},this.props.spotifyUserLoggedInfo.email)))),react_default.a.createElement("div",{className:"configure-page-logout-button-div"},react_default.a.createElement(Button_default.a,{className:"configure-page-login-logout-button",onClick:this.logOutSpotify.bind(this)},"Log Out SPOTIFY")));}},{key:"logInToSpotify",value:function logInToSpotify(){this.props.showLoadingModal();window.location.replace("/spotify/login");}},{key:"logOutSpotify",value:function logOutSpotify(){this.props.showLoadingModal();window.location.replace("/logout");}}]);return ConfigurePage;}(react_default.a.Component);/* harmony default export */ var components_AppPages_ConfigurePage = (ConfigurePage_ConfigurePage);
// EXTERNAL MODULE: ./src/components/common/LoadingModal.css
var common_LoadingModal = __webpack_require__(101);

// CONCATENATED MODULE: ./src/components/common/LoadingModal.js
var LoadingModal_React=__webpack_require__(0);var LoadingModal_ButtonToolbar=__webpack_require__(21).ButtonToolbar;var LoadingModal_Modal=__webpack_require__(21).Modal;var lastTimeOpened;var LoadingModal_LoadingModal=/*#__PURE__*/function(_React$Component){Object(inherits["a" /* default */])(LoadingModal,_React$Component);function LoadingModal(props,context){var _this;Object(classCallCheck["a" /* default */])(this,LoadingModal);_this=Object(possibleConstructorReturn["a" /* default */])(this,Object(getPrototypeOf["a" /* default */])(LoadingModal).call(this,props,context));_this.lgClose=function(){return _this.setState({lgShow:false,name:''});};_this.state={lgShow:_this.props.showLoadingModal,name:''};_this.handleNameChange=_this.handleNameChange.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));_this.handleClick=_this.handleClick.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));return _this;}Object(createClass["a" /* default */])(LoadingModal,[{key:"componentWillReceiveProps",value:function componentWillReceiveProps(nextProps){var _this2=this;if(nextProps.showLoadingModal!==this.props.showLoadingModal)if(nextProps.showLoadingModal){lastTimeOpened=new Date();this.setState({lgShow:nextProps.showLoadingModal});}else{var timeElapsed=new Date()-lastTimeOpened;if(Math.floor(timeElapsed/1000)<3){setTimeout(function(){return _this2.setState({lgShow:nextProps.showLoadingModal});},3000-timeElapsed);}else{this.setState({lgShow:nextProps.showLoadingModal});}}}},{key:"handleClick",value:function handleClick(){this.lgClose();this.props.action(this.state.name);}},{key:"handleNameChange",value:function handleNameChange(event){this.setState({name:event.target.value});}},{key:"render",value:function render(){return LoadingModal_React.createElement(LoadingModal_ButtonToolbar,null,LoadingModal_React.createElement(LoadingModal_Modal,{size:"lg",show:this.state.lgShow// onHide={this.lgClose}
},LoadingModal_React.createElement("div",{className:"modal-loading-div"},LoadingModal_React.createElement("img",{alt:"",className:"modal-loading-div-gif",src:"loading.gif"}))));}}]);return LoadingModal;}(LoadingModal_React.Component);/* harmony default export */ var components_common_LoadingModal = (LoadingModal_LoadingModal);
// CONCATENATED MODULE: ./src/pages/App.js
var App_App=/*#__PURE__*/function(_React$Component){Object(inherits["a" /* default */])(App,_React$Component);function App(props){var _this;Object(classCallCheck["a" /* default */])(this,App);_this=Object(possibleConstructorReturn["a" /* default */])(this,Object(getPrototypeOf["a" /* default */])(App).call(this,props));_this.transitionateToPage=function(page){this.setState({actualPage:page});};_this.handleResponse=function(responseObject){if(responseObject.errorToShow){this.modifyAlert({error:{text:responseObject.errorToShow}});if(responseObject.shouldReLogInToSpotify){this.setState({isSpotifyUserLogged:false});}}else{this.modifyAlert({message:{text:responseObject.messageToShow}});}};_this.state={isSpotifyUserLogged:false,actualPage:enum_pages.PLAYLISTS,alert:{message:{toShow:false,text:''},error:{toShow:false,text:''}},showLoadingModal:false};_this.modifyAlert=_this.modifyAlert.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));_this.resetAlert=_this.resetAlert.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));_this.showLoadingModal=_this.showLoadingModal.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));_this.hideLoadingModal=_this.hideLoadingModal.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));_this.handleResponse=_this.handleResponse.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));return _this;}Object(createClass["a" /* default */])(App,[{key:"componentDidMount",value:function componentDidMount(){var _this2=this;if(new URLSearchParams(window.location.search).has('loginerror')){window.history.pushState("object or string","Title","/");this.modifyAlert({error:{text:'There was some error when login to Spotify. Please retry'}});}fetch('/spotify/islogged',{method:'POST',headers:{"Content-Type":"application/json"}}).then(function(result){var state=_this2;if(result.ok){result.json().then(function(userData){state.setState({isSpotifyUserLogged:true,userInfo:userData});});}else{_this2.setState({isSpotifyUserLogged:false});}});}},{key:"render",value:function render(){return react_default.a.createElement(components_DefaultLayout,{isSpotifyUserLogged:this.state.isSpotifyUserLogged,actualPage:this.state.actualPage,onChange:this.transitionateToPage.bind(this)},react_default.a.createElement(components_common_LoadingModal,{showLoadingModal:this.state.showLoadingModal}),react_default.a.createElement(common_AlertDismissable,{alert:this.state.alert,showLoadingModal:this.state.showLoadingModal,resetAlert:this.resetAlert}),this.state.actualPage===enum_pages.PLAYLISTS?react_default.a.createElement(AppPages_PlaylistsPage,this.getPlaylistPageProps()):react_default.a.createElement(components_AppPages_ConfigurePage,this.getConfigurePageProps()));}},{key:"getPlaylistPageProps",value:function getPlaylistPageProps(){return{isSpotifyUserLogged:this.state.isSpotifyUserLogged,handleResponse:this.handleResponse,showError:this.showError,showMessage:this.showMessage,showLoadingModal:this.showLoadingModal,hideLoadingModal:this.hideLoadingModal};}},{key:"getConfigurePageProps",value:function getConfigurePageProps(){return{isSpotifyUserLogged:this.state.isSpotifyUserLogged,spotifyUserLoggedInfo:this.state.userInfo,showLoadingModal:this.showLoadingModal,hideLoadingModal:this.hideLoadingModal};}},{key:"modifyAlert",value:function modifyAlert(alert){var newAlertObject=this.state.alert;if(alert.error){if(this.state.alert.error.toShow){newAlertObject.error.text=this.state.alert.error.text+' '+alert.error.text;this.setState({alert:newAlertObject});}else{newAlertObject.error.text=alert.error.text;newAlertObject.error.toShow=true;this.setState({alert:newAlertObject});}}else{if(this.state.alert.message.toShow){newAlertObject.message.text=this.state.alert.message.text+' '+alert.message.text;this.setState({alert:newAlertObject});}else{newAlertObject.message.text=alert.message.text;newAlertObject.message.toShow=true;this.setState({alert:newAlertObject});}}}},{key:"resetAlert",value:function resetAlert(){this.setState({alert:{message:{toShow:false,text:''},error:{toShow:false,text:''}}});}},{key:"showLoadingModal",value:function showLoadingModal(){this.setState({showLoadingModal:true});}},{key:"hideLoadingModal",value:function hideLoadingModal(){this.setState({showLoadingModal:false});}}]);return App;}(react_default.a.Component);/* harmony default export */ var src_pages_App = (App_App);
// CONCATENATED MODULE: ./src/pages/serviceWorker.js
// This optional code is used to register a service worker.
// register() is not called by default.
// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.
// To learn more about the benefits of this model and instructions on how to
// opt-in, read http://bit.ly/CRA-PWA
var isLocalhost=Boolean(window.location.hostname==='localhost'||// [::1] is the IPv6 localhost address.
window.location.hostname==='[::1]'||// 127.0.0.1/8 is considered localhost for IPv4.
window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function register(config){if( true&&'serviceWorker'in navigator){// The URL constructor is available in all browsers that support SW.
var publicUrl=new URL("",window.location.href);if(publicUrl.origin!==window.location.origin){// Our service worker won't work if PUBLIC_URL is on a different origin
// from what our page is served on. This might happen if a CDN is used to
// serve assets; see https://github.com/facebook/create-react-app/issues/2374
return;}window.addEventListener('load',function(){var swUrl="".concat("","/service-worker.js");if(isLocalhost){// This is running on localhost. Let's check if a service worker still exists or not.
checkValidServiceWorker(swUrl,config);// Add some additional logging to localhost, pointing developers to the
// service worker/PWA documentation.
navigator.serviceWorker.ready.then(function(){console.log('This web app is being served cache-first by a service '+'worker. To learn more, visit http://bit.ly/CRA-PWA');});}else{// Is not localhost. Just register service worker
registerValidSW(swUrl,config);}});}}function registerValidSW(swUrl,config){navigator.serviceWorker.register(swUrl).then(function(registration){registration.onupdatefound=function(){var installingWorker=registration.installing;if(installingWorker==null){return;}installingWorker.onstatechange=function(){if(installingWorker.state==='installed'){if(navigator.serviceWorker.controller){// At this point, the updated precached content has been fetched,
// but the previous service worker will still serve the older
// content until all client tabs are closed.
console.log('New content is available and will be used when all '+'tabs for this page are closed. See http://bit.ly/CRA-PWA.');// Execute callback
if(config&&config.onUpdate){config.onUpdate(registration);}}else{// At this point, everything has been precached.
// It's the perfect time to display a
// "Content is cached for offline use." message.
console.log('Content is cached for offline use.');// Execute callback
if(config&&config.onSuccess){config.onSuccess(registration);}}}};};}).catch(function(error){console.error('Error during service worker registration:',error);});}function checkValidServiceWorker(swUrl,config){// Check if the service worker can be found. If it can't reload the page.
fetch(swUrl).then(function(response){// Ensure service worker exists, and that we really are getting a JS file.
var contentType=response.headers.get('content-type');if(response.status===404||contentType!=null&&contentType.indexOf('javascript')===-1){// No service worker found. Probably a different app. Reload the page.
navigator.serviceWorker.ready.then(function(registration){registration.unregister().then(function(){window.location.reload();});});}else{// Service worker found. Proceed as normal.
registerValidSW(swUrl,config);}}).catch(function(){console.log('No internet connection found. App is running in offline mode.');});}function unregister(){if('serviceWorker'in navigator){navigator.serviceWorker.ready.then(function(registration){registration.unregister();});}}
// CONCATENATED MODULE: ./src/pages/index.js
react_dom_default.a.render(react_default.a.createElement(src_pages_App,null),document.getElementById('root'));// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister();

/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 95:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 97:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

/******/ });
//# sourceMappingURL=index.bundle.js.map