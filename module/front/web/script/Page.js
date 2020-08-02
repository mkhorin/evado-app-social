'use strict';

Front.Page = class Page extends Front.Element {

    init () {
        this.name = this.getData('page');
        this.front.on('show:page', this.onPage.bind(this));
    }

    onPage (event, data) {
        if (this.name === data.name) {
            this.activate(data);
        }
    }

    activate () {
        this.front.togglePage(this.name);
    }

    showPage () {
        this.front.showPage(this.name, ...arguments);
    }
};

Front.MainPage = class MainPage extends Front.Page {
};

Front.MemberPage = class MemberPage extends Front.Page {

    init () {
        super.init();
        this.member = this.getHandler('Member');
        this.front.on('action:member', this.onMember.bind(this));
    }

    onMember (event, {member}) {
        this.showPage();
        this.member.setInstance(member);
    }
};

Front.AlbumPage = class AlbumPage extends Front.Page {

    init () {
        super.init();
        this.album = this.getHandler('Album');
        this.front.on('action:album', this.onAlbum.bind(this));
    }

    onAlbum (event, {album}) {
        this.showPage();
        this.album.setInstance(album);
    }
};

Front.PhotoPage = class PhotoPage extends Front.Page {

    init () {
        super.init();
        this.photo = this.getHandler('Photo');
        this.front.on('action:photo', this.onPhoto.bind(this));
    }

    onPhoto (event, {album, photo}) {
        this.showPage();
        this.photo.album = album;
        this.photo.setInstance(photo);
    }
};