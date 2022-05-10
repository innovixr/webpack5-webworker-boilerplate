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

export { Server };
