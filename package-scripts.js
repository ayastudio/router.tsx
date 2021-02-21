#!/usr/bin/env node

/*
    Prepare the totalExec function
*/

const { execSync } = require('child_process');
const totalExec = (execArray) => {
    
    for (let i = 0; i < execArray.length; ++i) {
        
        execSync(execArray[i].toString(), (error, stdout, stderr) => {
            if (error) {
                console.error(`|> Error: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`|> stderr: ${stderr}`);
                return;
            }

            console.log(`|> stdout:\n${stdout}`);
        });
    }
};

/*
    Handle the args
*/

const args = process.argv.slice(2);

if (args.length < 1) {

    console.log('Error: no arguments given');
    // Stop the execution
    process.exit(0);
}

if (args.length > 1) {

    console.log('Error: too much arguments given');
    // Stop the execution
    process.exit(0);
}

/*
    Main part
*/

const argument = args[0];

switch (argument) {
    case 'win-publish':
        totalExec([
            'tsc'
            , 'babel src --out-dir dist --extensions ".ts,.tsx"'
            , 'npm version patch'
            , 'git push'
            , 'npm publish'
        ]);
        break;

    default:
        console.log('Error: sorry, that is not something I know how to do.');
}
