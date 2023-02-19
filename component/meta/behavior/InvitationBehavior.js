/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('evado-meta-base/behavior/Behavior');

module.exports = class InvitationBehavior extends Base {

    async afterInsert () {
        const id = this.owner.getId();
        const sender = await this.getRelated('sender');
        const name = sender.header.resolve();
        const recipient = await this.getRelated('recipient');
        const user = recipient.get('user');
        await this.module.notify('invited', user, {id, name});
    }

    async afterTransit (transition) {
        switch (transition.name) {
            case 'accept': {
                await this.createFriend();
                break;
            }
            case 'decline': {
                await this.notifySender('declined');
                break;
            }
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
        const recipient = await this.getRelated('recipient');
        const name = recipient.header.resolve();
        const sender = await this.getRelated('sender');
        const user = sender.get('user');
        await this.module.notify(notification, user, {name});
    }
};