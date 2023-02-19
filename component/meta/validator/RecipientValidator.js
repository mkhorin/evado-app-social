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
        const invitationQuery = model.class.findByState('pending').and({sender, recipient});
        const invitation = await invitationQuery.id();
        if (invitation && !model.isId(invitation)) {
            return model.addError(name, 'Invitation already exists');
        }
        const members = [sender, recipient];
        const friendClass = model.class.meta.getClass('friend');
        const friendQuery = friendClass.find({
            initiator: members,
            invitee: members
        });
        const friend = await friendQuery.id();
        if (friend) {
            return model.addError(name, 'Already friends');
        }
    }
};

const CommonHelper = require('areto/helper/CommonHelper');