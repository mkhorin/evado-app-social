/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('evado-meta-base/filter/RelationFilter');

module.exports = class RelatedComments extends Base {

    async apply (query, model) {
        const owner = model.getId();
        const albumClass = model.class.meta.getClass('album');
        const album = await albumClass.find({owner}).ids();
        const photoClass = model.class.meta.getClass('photo');
        const photo = await photoClass.find({owner}).ids();
        return query.and(['or', {album}, {photo}]);
    }
};