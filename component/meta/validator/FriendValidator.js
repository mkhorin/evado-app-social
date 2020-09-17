/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado-meta-base/validator/Validator');

module.exports = class FriendValidator extends Base {

    async validateAttr (name, model) {
        const initiator = model.get('initiator');
        const invitee = model.get('invitee');
        if (CommonHelper.isEqual(initiator, invitee)) {
            return model.addError(name, 'Invitee cannot be the initiator');
        }
        const members = [initiator, invitee];
        const id = await model.class.find({
            initiator: members,
            invitee: members
        }).id();
        if (id && !model.isId(id)) {
            return model.addError(name, 'Already friends');
        }
    }
};

const CommonHelper = require('areto/helper/CommonHelper');