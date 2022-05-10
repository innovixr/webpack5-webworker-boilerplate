/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "F": () => (/* reexport */ Client),
  "j": () => (/* reexport */ Server)
});

;// CONCATENATED MODULE: ./src/workers/Client.js
// this is the worker main code
class Client {
    constructor() {
        console.log( "this code running in the worker" );
        this.installListeners();
        this.run();
        //this.installShim();
    }

    run() {
        setInterval( () => {
            self.postMessage( `hello, its ${Date.now()}` );
        }, 1000 );
    }

    onMainThreadMessage( ev ) {
        //console.log( 'worker: onMessage event received', ev );
        if ( this.onMessage )
        {
            this.onMessage( ev );
        }
    }

    installListeners() {
        // note that self is only defined natively when
        // we are in a web worker
        self.addEventListener( 'message', this.onMainThreadMessage.bind( this ) );
    }

    /*
     * bonus ! :) 

    installPixiJsShim() {

        self.HTMLVideoElement = function HTMLVideoElement() { };
        self.HTMLImageElement = function HTMLImageElement() { };
        self.HTMLCanvasElement = self.OffscreenCanvas;

        self.document = {
            createElement( type ) {
                if ( type === 'canvas' )
                {
                    return new OffscreenCanvas( 0, 0 );
                }

                return {
                    style: {}
                };
            },

            addEventListener() { },
        };

        self.window = {
            console: self.console,
            addEventListener() { },
            removeEventListener() { },
            navigator: {},
            document: self.document,

            // This is necessary for PIXI.js to correctly detect that WebGL is present:
            // https://github.com/pixijs/pixi.js/blob/f6f00047d6c523df2aa366cf3745eb831cec6ec5/src/core/utils/index.js#L314
            WebGLRenderingContext: self.WebGL2RenderingContext || self.WebGL2RenderingContext,
            requestAnimationFrame: self.requestAnimationFrame.bind( self ),

        };
    }
    */
}



;// CONCATENATED MODULE: ./src/workers/Server.js
class Server {
    constructor( options ) {
        /*
         * this failed because of import for now ..
        let str = `
        console.log('from worker');
        //import * as Application from '/application-module.js';
        //console.log(Application);
        //const client = new Application.WorkerClient();
        `;
        const blob = new Blob( [ str ], { type: "text/javascript" } );
        this.worker = new Worker( URL.createObjectURL( blob ), { type: 'module' } );
        */

        this.worker = new Worker( options.file, { type: 'module' } );
        this.worker.addEventListener( 'message', this.onWorkerMessage.bind( this ) );
    }

    onWorkerMessage( ev ) {
        //console.log( 'main thread: message received from worker', ev );
        if ( this.onMessage )
        {
            this.onMessage( ev );
        }
    }

    postMessage( message ) {
        this.worker.postMessage( message );
    }

    terminate() {
        this.worker.terminate();
    }
}



;// CONCATENATED MODULE: ./src/application.js





var __webpack_exports__WorkerClient = __webpack_exports__.F;
var __webpack_exports__WorkerServer = __webpack_exports__.j;
export { __webpack_exports__WorkerClient as WorkerClient, __webpack_exports__WorkerServer as WorkerServer };
