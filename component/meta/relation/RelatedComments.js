/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('evado-meta-base/filter/RelationFilter');

module.exports = class RelatedComments extends Base {

    async apply (query, model) {
        const owner = model.getId();
        const album = await model.class.meta.getClass('album').find().and({owner}).ids();
        const photo = await model.class.meta.getClass('photo').find().and({owner}).ids();
        return query.and(['OR', {album}, {photo}]);
    }
};