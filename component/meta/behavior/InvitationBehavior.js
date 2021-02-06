/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('evado-meta-base/behavior/Behavior');

module.exports = class InvitationBehavior extends Base {

    async afterInsert () {
        const id = this.owner.getId();
        const name = (await this.getRelated('sender')).header.resolve();
        const recipient = (await this.getRelated('recipient')).get('user');
        await this.module.notify('invited', recipient, {id, name});
    }

    async afterTransit (transition) {
        switch (transition.name) {
            case 'accept':
                await this.createFriend();
                break;
            case 'decline':
                await this.notifySender('declined');
                break;
        }
    }

    async createFriend () {
        const friendClass = this.getMetadataClass('friend');
        const friend = this.owner.createByView(friendClass);
        friend.assign({
            initiator: this.get('sender'),
            invitee: this.get('recipient')
        });
        if (await friend.save()) {
            await this.notifySender('friended');
        }
    }

    async notifySender (notification) {
        const name = (await this.getRelated('recipient')).header.resolve();
        const recipient = (await this.getRelated('sender')).get('user');
        await this.module.notify(notification, recipient, {name});
    }
};