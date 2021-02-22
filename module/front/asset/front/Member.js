/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Member = class Member extends Front.Loadable {

    getUrl () {
        return super.getUrl('read');
    }

    getPostData () {
        return {
            class: 'member',
            view: 'publicView',
            id: this.id
        };
    }

    render (data) {
        data.avatar = this.resolveTemplate(data.avatar ? 'avatar' : 'avatarPlaceholder', data);
        return this.resolveTemplate('member', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};