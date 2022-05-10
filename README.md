# webpack5-webworker-boilerplate
Boilerplate for webpack5 and code organization with webworkers.

It's just work, but i hope we can do better.

If we want to `import` something in the code running in the worker, 
we can do it only if we are using an extra js file.

If we try remove the extra js file dependencie, by injecting the 2 lines we have in the extra js file, using `Blob`, `import` will fail silenty.


Please PR to improve, thank you.