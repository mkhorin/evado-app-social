/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Photo = class Photo extends Front.Loadable {

    getUrl (action = 'read') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'photo',
            view: 'albumPhoto',
            id: this.id
        };
    }

    render (data) {
        data.album = this.album;
        return this.resolveTemplate('photo', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};