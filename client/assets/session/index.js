/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/ScriptLoader.js
/**
 * @author Tomer Riko Shalev
 */

/**
 * load jsx scripts dynamically
 */
class ScriptLoader {
    EvalScript_ErrMessage = "EvalScript error."

    constructor() {
        this.cs = new CSInterface()
    }

    get cs() {
        return this._cs
    }

    set cs(val) {
        this._cs = val
    }

    /**
     * loadJSX - load a jsx file dynamically, this
     * will also load all of it's includes which is desirable
     *
     * @param  {type} fileName the file name
     * @return {type}          description
     */
    loadJSX(fileName) {
        var cs = this.cs
        try {
            var extensionRoot = cs.getSystemPath(SystemPath.EXTENSION) + "/host/";

            cs.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
        } catch { }
    }

    /**
     * evalScript - evaluate a JSX script
     *
     * @param  {type} functionName the string name of the function to invoke
     * @param  {type} params the params object
     * @return {Promise} a promise
     */
    evalScript(functionName, params) {
        var params_string = params ? JSON.stringify(params) : ''
        var eval_string = `${functionName}('${params_string}')`
        var that = this

        return new Promise((resolve, reject) => {

            var callback = function(eval_res) {
                // console.log('weird' + eval_res)
                if(typeof eval_res === 'string') {
                    // console.log(eval_res)
                    if(eval_res.toLowerCase().indexOf('error') != -1) {
                        that.log('err eval')
                        reject(that.createScriptError(eval_res))

                        return
                    }
                }

                that.log('success eval')

                resolve(eval_res)

                return
            }

            try {
                that.cs.evalScript(eval_string, callback)
            } catch {}
        })

    }

    createScriptError(reason, data) {
        return {reason, data}
    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    log(val) {
        console.log(`${this.name} ${val}`)
    }

    get name() {
        return 'ScriptLoader:: '
    }

}

var scriptLoader = new ScriptLoader()

/* harmony default export */ const src_ScriptLoader = (scriptLoader);

;// CONCATENATED MODULE: ./src/managers/LogManager.js
/**
 * @author Tomer Riko Shalev
 */


/**
 * log management
 *
 */
class LogManager {
    _logs = []

    constructor() {

    }

    init() {
        this.log('initing...')

        var log = console.log

        if(console === undefined)
            return
        var that = this
        // override the console.log method
        console.log = function () {
            // log.call(this, 'My Console!!!')
            // log.apply(this, Array.prototype.slice.call(arguments))
            // retain older console.log functionality
            log.call(this, ...arguments)
            // save the log internally
            that.addRawLog(...arguments)
        }

    }

    /**
     * addLog - collect log
     *
     * @param  {Object} val anything
     *
     */
    addRawLog(val) {
        this._logs.push(val)
    }

    get rawLogs() {
        return this._logs
    }

    get name() {
        return 'LogManager:: '
    }

    log(val) {
        return `${this.name} ${val}`
    }
}

;// CONCATENATED MODULE: ./src/managers/DataManagers.js
/**
 * @author Tomer Riko Shalev
 */



class DataManagers {
    _manager_log = undefined

    constructor() {

    }

    init() {
        this._manager_log = new LogManager()

        this._manager_log.init()
    }

    /**
     * get log - the log manager
     *
     * @return {LogManager} the log manager
     */
    get log() {
        return this._manager_log
    }

}

;// CONCATENATED MODULE: ./src/Session.js
/**
 * @author Tomer Riko Shalev
 */



/**
 * the main plugin session. This can enter the node modules as
 * well as the host
 *
 */
class Session {

    _managers = new DataManagers()

    constructor() {
        //super()

        this.init()
    }

    /**
     * init - session
     *
     */
    init() {
        // init before everything so I can intercept console.log
        this._managers.init()
        this.log('session is initing...')
        // load jsx file dynamically
        this.log('loading the main jsx file')
        src_ScriptLoader.loadJSX('main.jsx')

        // some testing
        this.test()
        // var fs = require('fs-extra')
        //console.log(fs)

        this.log('session is inited')
    }


    /**
     * get data managers
     *
     * @return {type}  description
     */
    get managers() {
        return this._managers
    }

    /**
     * scriptLoader - get the script loader
     *
     */
    scriptLoader() {
        return src_ScriptLoader
    }

    /**
     * test - let's test things
     *
     */
    test() {
        var obj = {
            name: 'tomer'
        }

        src_ScriptLoader.evalScript('test_host', obj).then((res) => {
            this.log('result is ' + res)
        })
    }

    /**
     * invoke the plugin
     *
     * @param  {{textures:boolean, masks:boolean, info: boolean, flatten:boolean}} options for plugin
     *
     * @return {object} describes how well the execution of plugin was
     */
    invokePlugin(options) {
        const { folderPath, isFlattenChecked,
                isInfoChecked, isInspectVisibleChecked,
                isMasksChecked, isTexturesChecked,
                isMeaningfulNamesChecked, isHierarchicalChecked} = options

        // i reparse everything to detect failures
        const pluginData = {
            destinationFolder: folderPath,
            exportInfoJson: isInfoChecked,
            inspectOnlyVisibleLayers: isInspectVisibleChecked,
            exportMasks: isMasksChecked,
            exportTextures: isTexturesChecked,
            flatten: !isHierarchicalChecked,
            namePrefix: isMeaningfulNamesChecked ? 'layer' : undefined
        }

        var that = this

        return new Promise((resolve, reject) => {

            src_ScriptLoader.evalScript('invoke_document_worker', pluginData)
                        .then((res) => {
                            resolve(JSON.parse(res))
                        })
                        .catch(err => {
                            reject(err)
                        })

        })

    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    log(val) {
        console.log(`${this.name} ${val}`)
    }

    get name() {
        return 'Session:: '
    }

}

var session = new Session()

/* harmony default export */ const src_Session = (session);

;// CONCATENATED MODULE: ./index.js
/**
 * @author Tomer Riko Shalev
 */



console.log(src_Session)
window.session = src_Session

