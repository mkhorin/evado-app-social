/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado-meta-base/validator/Validator');

module.exports = class CommentTargetValidator extends Base {

    async validateAttr (name, model) {
        if (!model.get('album') && !model.get('photo')) {
            model.addError(name, 'Comment target not set');
        }
    }
};