import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import Documents from '../../api/Documents/Documents';

Migrations.add({
  version: 1,
  name: 'Add tags field to documents.',
  up() {
    const docsWithoutTags = Documents.find(
      { tags: { $exists: false } },
      { fields: { _id: 1 } },
    ).fetch();

    docsWithoutTags.forEach(({ _id }) => {
      Documents.update(_id, { $set: { tags: [] } });
    });
  },
  down() {
    const docsWithTags = Documents.find(
      { tags: { $exists: true } },
      { fields: { _id: 1 } },
    ).fetch();

    docsWithTags.forEach(({ _id }) => {
      Documents.update(_id, { $unset: { tags: [] } });
    });
  },
});

Meteor.startup(() => Migrations.migrateTo(0));
