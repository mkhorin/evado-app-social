'use strict';

// set NODE_ENV=development
// node console/security --action createUsers
// node console/security --action createUser --name Name --email Email --password Password
// node console/security --action createSecurity
// node console/security --action changePassword --email Email --password Password
// node console/security --action assignRole --email Email --role Role
// node console/security --action export [--file default] [--space 2]
// node console/security --action import [--file default] [--clear true]

const Application = require('../Application');
const Console = require('evado/console/Console');
const instance = new Console({Application});
const params = Console.parseProcessArguments();

(async () => {
    switch (params.action) {
        case 'createUsers':
            await instance.createUsers(); // from configuration
            break;
        case 'createUser':
            await instance.createUser(params);
            break;
        case 'createSecurity':
            await instance.createSecurity(); // from configuration
            break;
        case 'changePassword':
            await instance.changePassword(params);
            break;
        case 'assignRole':
            await instance.assignRole(params);
            break;
        case 'export':
            await instance.exportSecurity(params);
            break;
        case 'import':
            await instance.importSecurity(params);
            break;
        default:
            instance.log('error', `Unknown action: ${params.action}`);
    }
    process.exit();
})();