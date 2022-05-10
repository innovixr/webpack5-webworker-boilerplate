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

export { Client };
