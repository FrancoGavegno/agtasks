"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskFields = void 0;
const backend_1 = require("@aws-amplify/backend");
exports.createTaskFields = (0, backend_1.defineFunction)({
    name: 'createTaskFields',
    entry: './handler.ts',
    timeoutSeconds: 900,
    memoryMB: 1024,
    environment: {
        TASKFIELD_TABLE: 'TaskField-edyzenrmzvdgnoom3qe2772a3u-NONE',
        LOG_LEVEL: 'INFO',
    },
});
//# sourceMappingURL=resource.js.map