/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado-meta-base/validator/Validator');

module.exports = class RecipientValidator extends Base {

    async validateAttr (name, model) {
        const sender = model.get('sender');
        const recipient = model.get('recipient');
        if (CommonHelper.isEqual(sender, recipient)) {
            return model.addError(name, 'Recipient cannot be the sender');
        }
        const invitation = await model.class.findByState('pending').and({sender, recipient}).id();
        if (invitation && !model.isId(invitation)) {
            return model.addError(name, 'Invitation already exists');
        }
        const members = [sender, recipient];
        const friend = await model.class.meta.getClass('friend').find({
            initiator: members,
            invitee: members
        }).id();
        if (friend) {
            return model.addError(name, 'Already friends');
        }
    }
};

const CommonHelper = require('areto/helper/CommonHelper');