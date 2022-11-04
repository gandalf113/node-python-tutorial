const express = require('express');
const { spawn } = require('child_process');

const app = express();

const executePython = async (script, args) => {
    const arguments = args.map(arg => arg.toString());

    const py = spawn("python", [script, ...arguments]);

    const result = await new Promise((resolve, reject) => {
        let output;

        // Get output from python script
        py.stdout.on('data', (data) => {
            output = JSON.parse(data);
        });

        // Handle erros
        py.stderr.on("data", (data) => {
            console.error(`[python] Error occured: ${data}`);
            reject(`Error occured in ${script}`);
        });

        py.on("exit", (code) => {
            console.log(`Child process exited with code ${code}`);
            resolve(output);
        });
    });

    return result;
}

app.get('/', async (req, res) => {
    try {
        const result = await executePython('python/script.py', [8, 5]);

        res.json({ result: result });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

app.listen(5000, () => {
    console.log('[server] Application started!')
});